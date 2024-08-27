import re
from datetime import datetime

from fastapi_sqlalchemy import db

from app.models.types.request.auth_controller.authRequest import AuthRequest
from app.models.users import User


class UserService:
    def __init__(self):
        pass

    @staticmethod
    def is_valid_email(email: str) -> bool:
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if re.match(email_regex, email):
            return True
        return False

    @staticmethod
    def get_ip(request):
        timestamp = datetime.now().isoformat()
        ip_address = request.headers.get('x-forwarded-for', None)
        return [{"ip": ip_address, "timestamp": timestamp}]

    @staticmethod
    def create_user(ip_data, request_payload: AuthRequest):
        return User.create_user(session=db.session, email=request_payload.email.lower(),
                                password=request_payload.password,
                                ip_addresses=ip_data,
                                timezone=request_payload.timezone)
