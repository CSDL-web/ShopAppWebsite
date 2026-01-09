import uvicorn
import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware # <--- THÊM CÁI NÀY
from app.configs.appConfig import create_app

app = create_app()

# --- BẮT ĐẦU ĐOẠN FIX LỖI NETWORK (CORS) ---
# Cho phép Frontend ở bất kỳ đâu cũng gọi được vào
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cho phép tất cả các nguồn
    allow_credentials=True,
    allow_methods=["*"],  # Cho phép tất cả các phương thức (GET, POST...)
    allow_headers=["*"],  # Cho phép tất cả các headers
)
# --- KẾT THÚC ĐOẠN FIX ---

# --- BẮT ĐẦU ĐOẠN FIX ẢNH ---
try:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    upload_dir = os.path.join(current_dir, "uploads")

    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)

    # Mount thư mục ảnh (Đúng đường dẫn Frontend gọi)
    app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")
    print(f"✅ MOUNT SUCCESS: {upload_dir}")

except Exception as e:
    print(f"❌ MOUNT ERROR: {e}")
# -----------------------------

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
