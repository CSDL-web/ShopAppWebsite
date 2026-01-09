# file chat_ai_service.py
import os
import time
from sqlalchemy import create_engine
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits import create_sql_agent
from langchain_community.chat_message_histories import SQLChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Import API Keys
LIST_KEYS = []
try:
    from app.api_config import LIST_KEYS
    print("✅ Đã nạp API Key từ app.api_config")
except ImportError:
    try:
        import api_config
        LIST_KEYS = api_config.LIST_KEYS
        print("✅ Đã nạp API Key từ api_config trực tiếp")
    except ImportError:
        print("❌ LỖI: Không tìm thấy file api_config.py!")


# Danh sách model dùng để truy vấn SQL (sẽ xoay vòng)
DB_MODELS = [
    "models/gemini-2.5-flash",
    "models/gemini-3-flash",
    "models/gemini-2.5-flash-lite"
]

# Model dùng để Chat/Router 
TEXT_MODEL = "models/gemma-3-27b-it"


# 1. SETUP ENGINE DB & POLICY

db_user = os.getenv("MYSQL_USER")
db_pass = os.getenv("MYSQL_PASSWORD")
db_name = os.getenv("MYSQL_DATABASE")
db_host = os.getenv("DB_HOST", "mysql_container")

db_uri = f"mysql+mysqlconnector://{db_user}:{db_pass}@{db_host}/{db_name}"
SHARED_ENGINE = create_engine(
    db_uri,
    pool_size=10, max_overflow=20, pool_recycle=3600, pool_pre_ping=True
)

def load_shop_policy():
    """Đọc file policy.txt để nạp kiến thức cho AI"""
    path = os.path.join(os.getcwd(), "app/data/shop_policy.txt")
    try:
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return f.read()
    except Exception as e:
        print(f" Không đọc được file policy: {e}")
    return "Hiện chưa có thông tin chính sách cụ thể."

SHOP_POLICY_CONTENT = load_shop_policy()


# 2. CLASS QUẢN LÝ KEY & MODEL

class ResourceManager:
    def __init__(self):
        self.keys = LIST_KEYS
        self.key_index = 0
        
        self.models = DB_MODELS
        self.model_index = 0

        if not self.keys:
            print("⚠️ KHÔNG CÓ API KEY!")

    def get_current_key(self):
        return self.keys[self.key_index] if self.keys else None

    def get_current_db_model(self):
        return self.models[self.model_index]

    def rotate_resources(self):
        """Xoay cả Key lẫn Model cùng lúc để đổi vận"""
        if not self.keys: return
        
        # 1. Xoay Key
        self.key_index = (self.key_index + 1) % len(self.keys)
        new_key = self.keys[self.key_index]
        
        # 2. Xoay Model
        self.model_index = (self.model_index + 1) % len(self.models)
        new_model = self.models[self.model_index]

        print(f" ROTATION: Key [...{new_key[-6:]}] | Model [{new_model}]")
        return new_key, new_model

resource_manager = ResourceManager()


# 3. CLASS HISTORY

class LimitedSQLChatMessageHistory(SQLChatMessageHistory):
    def __init__(self, session_id, connection, table_name, keep_last_n_pairs=3):
        super().__init__(session_id=session_id, connection=connection, table_name=table_name)
        self.keep_last_n_pairs = keep_last_n_pairs

    @property
    def messages(self):
        all_messages = super().messages
        return all_messages[-(self.keep_last_n_pairs * 2):]


# 4. SERVICE CHÍNH

class ChatAIService:
    def __init__(self):
        self.engine = SHARED_ENGINE
        # Chỉ include các bảng quan trọng để tránh token quá lớn
        self.db = SQLDatabase(self.engine, include_tables=["products", "categories", "orders", "order_details", "coupons"])
        
        self.llm_text = None
        self.text_chain = None
        self.llm_db = None
        self.agent_executor = None
        self.chain_with_history = None
        
        self._init_chains()

    def _init_chains(self):
        current_key = resource_manager.get_current_key()
        current_db_model = resource_manager.get_current_db_model()

        if not current_key:
            print(" LỖI: Không có API Key!")
            return 

        try:
         
            # Model này sẽ đọc Policy file để trả lời trực tiếp
            self.llm_text = ChatGoogleGenerativeAI(
                model=TEXT_MODEL, 
                google_api_key=current_key,
                temperature=0.7
            )

            # Prompt nhúng nội dung file txt
            system_prompt = (
                "Hệ thống: Bạn là trợ lý ảo chăm sóc khách hàng chuyên nghiệp của ShopApp.\n"
                "Nhiệm vụ: Hỗ trợ giải đáp chính sách, địa chỉ và tư vấn phạm vi sản phẩm.\n\n"
                "Dưới đây là **CHÍNH SÁCH CỬA HÀNG VÀ DANH MỤC SẢN PHẨM**:\n"
                "--------------------------------------------------\n"
                f"{SHOP_POLICY_CONTENT}\n"
                "--------------------------------------------------\n"
                "HƯỚNG DẪN TRẢ LỜI:\n"
                "1. Nếu câu hỏi có trong file thông tin trên: Trả lời ngay lập tức, ngắn gọn, chính xác.\n"
                "2. Nếu khách hỏi mua sản phẩm KHÔNG nằm trong danh mục (ví dụ: quần áo, đồ ăn): Hãy báo shop không kinh doanh mặt hàng đó.\n"
                "3. Nếu là câu hỏi xã giao: Trò chuyện thân thiện, vui vẻ.\n"
                "--------------------------------------------------\n"
                "Người dùng hỏi: {input}"
            )

            self.text_prompt = ChatPromptTemplate.from_messages([
                ("human", system_prompt)
            ])
            self.text_chain = self.text_prompt | self.llm_text | StrOutputParser()

           
            # Dùng model hiện tại trong vòng xoay (gemini-2.5, 3, hoặc 2.5-lite)
            self.llm_db = ChatGoogleGenerativeAI(
                model=current_db_model,
                google_api_key=current_key,
                temperature=0
            )

            self.agent_executor = create_sql_agent(
                llm=self.llm_db,
                db=self.db,
                agent_type="openai-tools",
                verbose=True,
                handle_parsing_errors=True
            )

            self.chain_with_history = RunnableWithMessageHistory(
                self.agent_executor,
                self._get_session_history,
                input_messages_key="input",
                history_messages_key="history",
            )
            
            print(f" AI Ready: Key[...{current_key[-6:]}] | DB Model[{current_db_model}]")
        except Exception as e:
            print(f" Lỗi khởi tạo Chains: {e}")

    def _get_session_history(self, session_id: str):
        return LimitedSQLChatMessageHistory(session_id=session_id, connection=self.engine, table_name="chat_history")

    def determine_intent(self, question: str):
        if not self.llm_text:
            return "CHAT"
        
        # Prompt Router: Phân loại xem có cần tra DB không
       
        prompt = (
            f"Câu hỏi: '{question}'.\n"
            "Phân loại thành:\n"
            "- 'DATABASE': nếu hỏi về dữ liệu động trong DB (giá sản phẩm, số lượng tồn kho, tình trạng đơn hàng, danh sách coupon, thống kê doanh thu).\n"
            "- 'CHAT': nếu là chào hỏi, hoặc hỏi về chính sách chung (ship, địa chỉ, đổi trả, bảo hành) đã có trong quy định.\n"
            "Chỉ trả về đúng 1 từ: DATABASE hoặc CHAT."
        )
        try:
            res = self.llm_text.invoke(prompt).content.strip().upper()
            return "DATABASE" if "DATABASE" in res else "CHAT"
        except:
            return "CHAT"

    def process_chat(self, question: str, session_id: str) -> str:
        if not resource_manager.get_current_key():
            return " Lỗi: Server chưa cấu hình API Key."
        
        # Retry loop logic
        max_attempts = max(len(resource_manager.keys) * 2, 3) # Thử nhiều lần hơn vì xoay cả model
        
        for attempt in range(max_attempts):
            # Nếu chưa có chain hoặc vừa bị lỗi -> init lại
            if not self.text_chain or not self.chain_with_history:
                self._init_chains()

            try:
                # 1. Xác định ý định
                intent = self.determine_intent(question)
                
                if intent == "DATABASE":
                    print(f"--- [DB QUERY] Model: {resource_manager.get_current_db_model()} ---")
                    result = self.chain_with_history.invoke(
                        {"input": question},
                        config={"configurable": {"session_id": session_id}}
                    )
                    return self._format_output(result.get("output", ""))
                else:
                    print(f"--- [TEXT/POLICY CHAT] ---")
                    # Gemma check file policy và trả lời
                    return self.text_chain.invoke({"input": question})

            except Exception as e:
                error_msg = str(e)
                print(f" Lỗi (Lần {attempt+1}): {error_msg}")

                # Các lỗi thường gặp cần xoay tua
                # 429: Hết quota
                # 400/403: Key lỗi hoặc Model không truy cập được (do vùng miền hoặc quyền)
                # 500: Lỗi server Google
                is_retryable = any(x in error_msg for x in ["429", "RESOURCE_EXHAUSTED", "400", "403", "500", "503"])
                
                if is_retryable:
                    print(" Đang xoay Key & Model để thử lại...")
                    resource_manager.rotate_resources()
                    self._init_chains() # Re-init với combo mới
                    time.sleep(1)
                    continue
                
                # Nếu lỗi cú pháp SQL hoặc logic agent thì return luôn chứ không xoay
                return "Hệ thống đang gặp sự cố xử lý câu hỏi này. Bạn thử lại câu khác nhé."
        
        return "Tất cả các Key và Model đều đang bận hoặc hết hạn mức. Vui lòng thử lại sau."

    def _format_output(self, output):
        if isinstance(output, list):
            return "".join([item.get("text", "") if isinstance(item, dict) else str(item) for item in output])
        return str(output)