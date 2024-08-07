import os
from datetime import timedelta
from typing import List

from fastapi import HTTPException
from fastapi_jwt_auth import AuthJWT
from fastapi_sqlalchemy import db

from app.models.users import User
from authentication.api_access import APIAccess
from authentication.permissions import PermissionService


class AuthService:

    def __init__(self, authorize: AuthJWT, api_access: List[APIAccess]):
        self.authorize = authorize
        self.api_access = api_access

    def create_access_token(self, email: str):
        expiry_time_hours = os.getenv("JWT_EXPIRY_TIME_HOURS")
        if type(expiry_time_hours) == str:
            expiry_time_hours = int(expiry_time_hours)
        if expiry_time_hours is None:
            expiry_time_hours = 200
        expires = timedelta(hours=expiry_time_hours)
        access_token = self.authorize.create_access_token(subject=email, expires_time=expires)
        return access_token

    def validate_access_token(self):
        email = self.authorize.get_jwt_subject()
        user = User.get_user_by_email(session=db.session, email=email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if not PermissionService().check_authorization(api_access=self.api_access, user=user):
            raise HTTPException(status_code=403, detail="Unauthorized")
        return user
