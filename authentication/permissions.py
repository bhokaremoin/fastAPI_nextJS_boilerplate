import json
from fastapi import HTTPException
from authentication.api_access import APIAccess

class PermissionService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def check_authorization(self,api_access, user):
        for access in api_access:
            if access.value == "DEFAULT" or user.role.upper() == access.value:
                return True
        return False
    