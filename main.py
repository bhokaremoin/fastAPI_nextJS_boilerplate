import os

from asgi_correlation_id import CorrelationIdMiddleware
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
from fastapi_sqlalchemy import DBSessionMiddleware
from pydantic import BaseModel
# from sqlalchemy.orm import sessionmaker
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from app.controllers.auth import router as auth_router
from database import Database

app = FastAPI()

load_dotenv()
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:5432/{DB_NAME}"

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

database = Database(DB_URL)
engine = database.get_engine()

app.include_router(auth_router, prefix="/api/auth")


class Settings(BaseModel):
    # jwt_secret = get_config("JWT_SECRET_KEY")
    authjwt_secret_key: str = os.getenv("JWT_SECRET_KEY")


# callback to get your configuration
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
