from fastapi import APIRouter, Query, HTTPException, Depends, Request, Response
from fastapi_jwt_auth import AuthJWT
from fastapi_sqlalchemy import db

from app.models.types.request.auth_controller.authRequest import AuthRequest
from app.models.users import User
from app.services.users import UserService
from authentication.api_access import APIAccess
from authentication.auth import AuthService

router = APIRouter()


@router.get('/check_user')
async def check_user(user_email: str = Query(...)):
    user = User.get_user_by_email(session=db.session, email=user_email)
    user_exists = user is not None
    return {"success": True, "user_exists": user_exists}


@router.post('/sign_up')
async def sign_up(req: Request, response: Response, request_payload: AuthRequest, Authorize: AuthJWT = Depends()):
    # ip_data = UserService.get_ip(req)
    ip_data = []
    email = request_payload.email.lower()
    if not UserService.is_valid_email(email):
        raise HTTPException(status_code=400, detail='Invalid email')
    user = User.get_user_by_email(session=db.session, email=email)
    if user is not None:
        raise HTTPException(status_code=400, detail='Email already registered')
    user = UserService.create_user(ip_data, request_payload)
    access = [APIAccess.USER]
    access_token = AuthService(authorize=Authorize, api_access=access).create_access_token(user.email)
    # response.set_cookie(key="access_token", value=access_token, max_age=3600, httponly=False)
    return {"success": True, "access_token": access_token}


@router.post('/sign_in')
async def sign_in(req: Request, response: Response, request_payload: AuthRequest, Authorize: AuthJWT = Depends()):
    email = request_payload.email.lower()
    user = User.get_user_by_email(session=db.session, email=email)
    if not user:
        raise HTTPException(status_code=400, detail='User Email does not exist')
    if user.password != request_payload.password:
        return {"success": False, "message": "Password mismatch"}
    access = [APIAccess.USER]
    access_token = AuthService(authorize=Authorize, api_access=access).create_access_token(user.email)
    # response.set_cookie(key="access_token", value=access_token, max_age=3600, httponly=False)
    return {"success": True, "access_token": access_token}
