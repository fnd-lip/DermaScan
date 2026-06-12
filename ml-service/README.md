# DermaScan ML Service.

## Tecnologias

* Python
* BentoML
* PyTorch
* TorchVision
* Pillow
* Docker

## Pré-requisitos

Antes de rodar o serviço, instale:

```bash
Docker
```

Para rodar sem Docker, também é necessário ter:

```bash
Python 3.11
pip
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

```txt
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

Instale o PyTorch e TorchVision:

```bash
pip install --no-cache-dir --index-url https://download.pytorch.org/whl/cpu torch torchvision
```

Instale as demais dependências:

```bash
pip install -r requirements.txt
```

Execute o serviço:

```bash
bentoml serve src.service:DermaScanService --host 0.0.0.0 --port 5001
```

## Integração com o backend

Para o backend usar este serviço localmente, configure no arquivo `.env` do backend:

```env
ML_SERVICE_URL="http://localhost:5001"
```

Fluxo local recomendado:

```txt
Frontend:   http://localhost:5173
Backend:    http://localhost:4000
ML Service: http://localhost:5001
```

## Scripts e comandos úteis

Gerar imagem Docker:

```bash
docker build -t dermascan-ml-service .
```

Rodar container:

```bash
docker run --rm -p 5001:5001 dermascan-ml-service
```

