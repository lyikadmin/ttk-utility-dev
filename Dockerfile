# Use official Node.js image for SPA static files
FROM node:20-alpine as spa
WORKDIR /app
COPY . .
RUN npm install -g http-server

# Use official Python image for FastAPI backend
FROM python:3.11-slim as api
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir -r requirements.txt

# Final stage: run both servers using supervisord
FROM python:3.11-slim
WORKDIR /app
COPY --from=spa /app /app
COPY --from=api /app /app
RUN pip install --no-cache-dir -r requirements.txt && \
    apt-get update && apt-get install -y supervisor && rm -rf /var/lib/apt/lists/*

# Add supervisord config
RUN echo "[supervisord]\nnodaemon=true\n[program:spa]\ncommand=http-server . -p 8080 -c-1\ndirectory=/app\n[program:api]\ncommand=uvicorn token_api:app --host 0.0.0.0 --port 8000\ndirectory=/app\n" > /etc/supervisord.conf

EXPOSE 8080 8000
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]