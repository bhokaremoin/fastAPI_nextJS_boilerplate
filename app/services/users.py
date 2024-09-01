from sqlalchemy.orm import Session

from app.models.users import User


class UserService:
    @staticmethod
    def get_user_by_id(session: Session, user_id: int):
        return session.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_user_by_email(session: Session, email: str):
        return session.query(User).filter(User.email == email).first()

    @staticmethod
    def create_user(session: Session, email: str, password: bytes, ip_addresses=None, timezone=None):
        new_user = User(
            email=email,
            password=password,
            role='USER',
            ip_addresses=ip_addresses,
            timezone=timezone,
        )
        session.add(new_user)
        session.commit()
        session.flush()
        session.refresh(new_user)
        return new_user
