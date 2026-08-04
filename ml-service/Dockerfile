FROM python:3.11-slim AS runtime

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_ONLY_BINARY=:all:

COPY requirements.lock.txt .

RUN python -m pip install \
    --require-hashes \
    --no-deps \
    --index-url https://pypi.org/simple \
    --extra-index-url https://download.pytorch.org/whl/cpu \
    -r requirements.lock.txt

COPY src ./src
COPY models/modelo_dermascan.pth ./models/modelo_dermascan.pth

EXPOSE 5001

CMD ["bentoml", "serve", "src.service:DermaScanService", "--host", "0.0.0.0", "--port", "5001"]