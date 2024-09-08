from typing import List

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi_jwt_auth import AuthJWT

from app.models.todo import TodoModel, TodoCreate, TodoUpdate
from app.services.todo import TodoService
from authentication.api_access import APIAccess
from authentication.auth import TokenService

router = APIRouter()


@router.post("/", response_model=TodoModel)
async def create_todo(request: Request, todo: TodoCreate, authorize: AuthJWT = Depends()):
    user = TokenService(authorize=authorize, api_access=[APIAccess.USER, APIAccess.DEV]).validate_access_token()
    return await TodoService(request.app.mongodb).create_todo(user.id, todo)


@router.get("/", response_model=List[TodoModel])
async def get_todos(request: Request, authorize: AuthJWT = Depends()):
    user = TokenService(authorize=authorize, api_access=[APIAccess.USER, APIAccess.DEV]).validate_access_token()
    return await TodoService(request.app.mongodb).get_todos(user.id)


@router.get("/{todo_id}", response_model=TodoModel)
async def get_todo(request: Request, todo_id: str, authorize: AuthJWT = Depends()):
    user = TokenService(authorize=authorize, api_access=[APIAccess.USER, APIAccess.DEV]).validate_access_token()
    todo = await TodoService(request.app.mongodb).get_todo(todo_id)
    if not todo or todo.user_id != user.id:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@router.put("/{todo_id}", response_model=TodoModel)
async def update_todo(request: Request, todo_id: str, todo_update: TodoUpdate, authorize: AuthJWT = Depends()):
    user = TokenService(authorize=authorize, api_access=[APIAccess.USER, APIAccess.DEV]).validate_access_token()
    todo = await TodoService(request.app.mongodb).get_todo(todo_id)
    if not todo or todo.user_id != user.id:
        raise HTTPException(status_code=404, detail="Todo not found")
    return await TodoService(request.app.mongodb).update_todo(todo_id, todo_update)


@router.delete("/{todo_id}")
async def delete_todo(request: Request, todo_id: str, authorize: AuthJWT = Depends()):
    user = TokenService(authorize=authorize, api_access=[APIAccess.USER, APIAccess.DEV]).validate_access_token()
    todo = await TodoService(request.app.mongodb).get_todo(todo_id)
    if not todo or todo.user_id != user.id:
        raise HTTPException(status_code=404, detail="Todo not found")
    success = await TodoService(request.app.mongodb).delete_todo(todo_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete todo")
    return {"message": "Todo deleted successfully"}
