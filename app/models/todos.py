from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import Session, relationship

from app.models.base_model import DBBaseModel


class Todos(DBBaseModel):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    description = Column(String)
    status = Column(String)  # ['OPEN', 'DONE' ]

    user = relationship("User", back_populates="todos")

    @classmethod
    def get_todos(cls, session: Session):
        return session.query(Todos).filter(Todos.status == "OPEN").all()

    @classmethod
    def get_todos_by_user_id(cls, session: Session, user_id: int):
        return session.query(Todos).filter(Todos.user_id == user_id).all()

    @classmethod
    def create_todo(cls, session: Session, description: str, status: str):
        todo = Todos(description=description, status=status)
        session.add(todo)
        session.commit()
        session.flush()
        session.refresh(todo)
        return todo

    @classmethod
    def update_status(cls, session: Session, todo_id: int, status: str):
        todo = session.query(Todos).filter(Todos.id == todo_id).first()
        todo.status = status
        session.add(todo)
        session.commit()
        session.refresh(todo)
        return todo

    @classmethod
    def update_description(cls, session: Session, todo_id: int, description: str):
        todo = session.query(Todos).filter(Todos.id == todo_id).first()
        todo.description = description
        session.add(todo)
        session.commit()
        session.refresh(todo)
        return todo

    @classmethod
    def delete_todo(cls, session: Session, todo_id: int):
        todo = session.query(Todos).filter(Todos.id == todo_id).first()
        session.delete(todo)
        session.commit()
        session.refresh(todo)
        return todo
