# STAGE 1: Building the React frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /frontend

COPY frontend/package.json frontend/package-lock.json* ./

# Install frontend dependencies
RUN npm ci

# Copy source code
COPY frontend/ ./

# Build the frontend
RUN npm run build

# STAGE 2: Python backend with uv
FROM python:3.11-slim

# Upgrade pip
RUN python -m pip install --upgrade pip

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

COPY pyproject.toml uv.lock* ./

# Install python dependencies with uv
RUN uv pip install --system --no-cache .

# Copy backend code
COPY backend/ ./

# Copy the built frontend into /app to serve as static files
COPY --from=frontend-builder /frontend/dist ./static

EXPOSE 8001

# Update CORS middleware to allow all origins in production
ENV PYTHONUNBUFFERED=1

# Start the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]



