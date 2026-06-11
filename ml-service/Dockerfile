FROM python:3.11-slim AS runtime

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY src ./src
COPY bentofile.yaml .
COPY models/modelo_dermascan.pth ./models/modelo_dermascan.pth

EXPOSE 5001

CMD ["bentoml", "serve", "src.service:DermaScanService", "--host", "0.0.0.0", "--port", "5001"]