FROM python:3.11-slim

RUN apt-get update && apt-get install -y curl git && rm -rf /var/lib/apt/lists/*

# Install Python deps into system Python first (before AdaL CLI install)
COPY requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# Install AdaL CLI — runs in same Python environment so adalflow types are shared
RUN curl -fsSL https://adal.sylph.ai/install.sh | bash
ENV PATH="/root/.local/bin:/usr/local/bin:${PATH}"

WORKDIR /app
COPY . .

EXPOSE 8000
CMD uvicorn main:app --host 0.0.0.0 --port $PORT