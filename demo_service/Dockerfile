FROM python:3.9-slim

WORKDIR /app

COPY . .


RUN pip install --no-cache-dir fastapi uvicorn[standard]

EXPOSE 8001

CMD ["python", "main.py"]
