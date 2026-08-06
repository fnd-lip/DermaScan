# DermaScan ML Service

## Tecnologias

- Python 3.11
- BentoML
- PyTorch
- TorchVision
- Pillow
- Docker

## Pré-requisitos

Para rodar o serviço com Docker, instale:

- Docker

Para rodar sem Docker, instale:

- Python 3.11
- pip

O arquivo do modelo deve existir no caminho:

```text
models/modelo_dermascan.pth
```

## Rodar com Docker

Dentro da pasta `ml-service`, gere a imagem:

```bash
docker build -t dermascan-ml-service .
```

Depois execute o container:

```bash
docker run --rm -p 5001:5001 dermascan-ml-service
```

O serviço ficará disponível em:

```text
http://localhost:5001
```

## Rodar sem Docker

Dentro da pasta `ml-service`, crie um ambiente virtual:

```bash
python -m venv .venv
```

Ative o ambiente virtual.

No Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Instale o PyTorch e o TorchVision:

```bash
python -m pip install --no-cache-dir --index-url https://download.pytorch.org/whl/cpu torch torchvision
```

Instale as demais dependências:

```bash
python -m pip install -r requirements.txt
```

Execute o serviço:

```bash
bentoml serve src.service:DermaScanService --host 0.0.0.0 --port 5001
```

## Integração com o backend

Para o backend usar este serviço localmente, configure o arquivo `.env` do backend:

```env
ML_SERVICE_URL="http://localhost:5001"
```

Fluxo local recomendado:

```text
Frontend:   http://localhost:5173
Backend:    http://localhost:4000
ML Service: http://localhost:5001
```

## Scripts e comandos úteis

Gerar a imagem Docker:

```bash
docker build -t dermascan-ml-service .
```

Rodar o container:

```bash
docker run --rm -p 5001:5001 dermascan-ml-service
```
