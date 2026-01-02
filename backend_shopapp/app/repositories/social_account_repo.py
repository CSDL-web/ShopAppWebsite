from sqlalchemy.orm import Session
from typing import Optional
from app.models.social_account_model import SocialAccount

class SocialAccountRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, data: dict) -> SocialAccount:
        account = SocialAccount(**data)
        self.db.add(account)
        self.db.commit()
        self.db.refresh(account)
        return account

    def get_by_provider(self, provider: str, provider_id: str) -> Optional[SocialAccount]:
        return self.db.query(SocialAccount).filter(
            SocialAccount.provider == provider,
            SocialAccount.provider_id == provider_id
        ).first()