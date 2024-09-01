from sqlalchemy import Column, Integer, String, LargeBinary
from sqlalchemy.dialects.postgresql import ARRAY, JSONB

from app.models.base_model import DBBaseModel


class User(DBBaseModel):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True)
    password = Column(LargeBinary)
    role = Column(String, default='USER')
    ip_addresses = Column(ARRAY(JSONB), default=[])
    timezone = Column(String, default=None)
