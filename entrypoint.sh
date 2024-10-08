#!/bin/bash

# Run Alembic migrations
alembic upgrade head

# Start the app
exec uvicorn main:app --host 0.0.0.0 --port 8001 --reload --log-config app/config/uvicorn_logger_config.json