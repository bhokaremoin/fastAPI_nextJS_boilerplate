from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import ARRAY, JSONB

from app.models.base_model import DBBaseModel


class User(DBBaseModel):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True)
    password = Column(String)
    ip_addresses = Column(ARRAY(JSONB), default=[])
    timezone = Column(String, default=None)

    @classmethod
    def get_user_by_id(cls, session, user_id):
        return session.query(User).filter(User.id == user_id).first()

    @classmethod
    def get_user_by_email(cls, session, email):
        return session.query(User).filter(User.email == email).first()

    @classmethod
    def create_user(cls, session, email, password, ip_addresses=None, timezone=None):
        new_user = User(
            email=email,
            password=password,
            ip_addresses=ip_addresses,
            timezone=timezone,
        )
        session.add(new_user)
        session.commit()
        session.flush()
        session.refresh(new_user)
        return new_user
