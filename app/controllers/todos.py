from fastapi import APIRouter, Depends
from fastapi_jwt_auth import AuthJWT
from fastapi_sqlalchemy import db

from app.models.todos import Todos
from authentication.api_access import APIAccess
from authentication.auth import AuthService

router = APIRouter()


@router.get('/')
def get_todos(authorize: AuthJWT = Depends()):
    user = AuthService(authorize=authorize, api_access=[APIAccess.USER, APIAccess.DEV]).validate_access_token()
    todos = Todos.get_todos_by_user_id(session=db.session, user_id=user.id)
    return {'success': True, 'todos': todos}
