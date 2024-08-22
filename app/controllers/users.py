from fastapi import APIRouter, Query
from fastapi_sqlalchemy import db

from app.models.users import User

router = APIRouter()


@router.get('/check_user')
async def check_user(user_email: str = Query(...)):
    user = User.get_user_by_email(session=db.session, email=user_email)
    user_exists = user is not None
    return {"success": True, "user_exists": user_exists}
