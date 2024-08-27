from pydantic import BaseModel


class AuthRequest(BaseModel):
    email: str
    password: str
    timezone: str = None

    class Config:
        orm_mode = True
