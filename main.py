import os

from asgi_correlation_id import CorrelationIdMiddleware
from dotenv import load_dotenv
from fastapi import FastAPI, Depends
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
from fastapi_sqlalchemy import DBSessionMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from app.controllers.auth import router as auth_router
from app.controllers.todo import router as todo_router
from app.database.postgreSQL import PostgreSQL
from authentication.api_access import APIAccess
from authentication.auth import TokenService

app = FastAPI()

load_dotenv()
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:5432/{DB_NAME}"

MONGO_HOST = os.getenv("MONGO_HOST", "mongodb")
MONGO_PORT = os.getenv("MONGO_PORT", "27017")
MONGO_URL = f"mongodb://{MONGO_HOST}:{MONGO_PORT}"

engine_args = {
    "pool_size": 20,
    "max_overflow": 50,
    "pool_timeout": 30,
    "pool_recycle": 1800,
    "pool_pre_ping": False,
}

app.add_middleware(DBSessionMiddleware, db_url=DB_URL, engine_args=engine_args)
app.add_middleware(CorrelationIdMiddleware)

origins = ["*", ]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=['X-Request-ID']
)

database = PostgreSQL(DB_URL)
engine = database.get_engine()


@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(MONGO_URL)
    app.mongodb = app.mongodb_client.todos_db


@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()


app.include_router(auth_router, prefix="/api/auth")

app.include_router(todo_router, prefix="/api/todos")


class Settings(BaseModel):
    authjwt_secret_key: str = os.getenv("JWT_SECRET_KEY")

    class Config:
        orm_mode = True


@AuthJWT.load_config
def get_config():
    return Settings()


@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )


@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "hello world !!"}


@app.get("/api/test")
def test_api(authorize: AuthJWT = Depends()):
    user = TokenService(authorize=authorize, api_access=[APIAccess.USER, APIAccess.DEV]).validate_access_token()
    return {'success': True, 'user': user}
