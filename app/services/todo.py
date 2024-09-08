from typing import List

from bson import ObjectId

from app.models.todo import TodoModel, TodoCreate, TodoUpdate


class TodoService:

    def __init__(self, db):
        self.db = db

    async def create_todo(self, user_id: int, todo: TodoCreate) -> TodoModel:
        todo_dict = todo.dict()
        todo_dict["user_id"] = user_id
        result = await self.db.todos.insert_one(todo_dict)
        created_todo = await self.db.todos.find_one({"_id": result.inserted_id})
        return TodoModel(**created_todo)

    async def get_todo(self, todo_id: str):
        todo = await self.db.todos.find_one({"_id": ObjectId(todo_id)})
        if todo:
            return TodoModel(**todo)
        return None

    async def get_todos(self, user_id: int) -> List[TodoModel]:
        todos = await self.db.todos.find({"user_id": user_id}).to_list(length=None)
        return [TodoModel(**todo) for todo in todos]

    async def update_todo(self, todo_id: str, todo_update: TodoUpdate) -> TodoModel:
        update_data = {k: v for k, v in todo_update.dict().items() if v is not None}
        await self.db.todos.update_one({"_id": ObjectId(todo_id)}, {"$set": update_data})
        return await self.get_todo(todo_id)

    async def delete_todo(self, todo_id: str) -> bool:
        result = await self.db.todos.delete_one({"_id": ObjectId(todo_id)})
        return result.deleted_count > 0
