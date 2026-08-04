import base64
import binascii
import io

import numpy as np
from PIL import Image, ImageOps, UnidentifiedImageError

MIN_IMAGE_SIZE = 128
MAX_IMAGE_PIXELS = 40_000_000
MAX_UPLOAD_BYTES = 15 * 1024 * 1024


def converter_base64_para_imagem(
    imagem_base64: str,
) -> Image.Image:
    if not isinstance(imagem_base64, str):
        raise ValueError("A imagem deve ser enviada em Base64")

    conteudo = imagem_base64.strip()

    if not conteudo:
        raise ValueError("A imagem está vazia")

    if conteudo.startswith("data:image/"):
        conteudo = conteudo.split(",", 1)[1]

    conteudo = "".join(conteudo.split())

    try:
        bytes_imagem = base64.b64decode(
            conteudo,
            validate=True,
        )
    except (
        binascii.Error,
        ValueError,
        TypeError,
    ) as erro:
        raise ValueError("Conteúdo Base64 inválido") from erro

    if len(bytes_imagem) > MAX_UPLOAD_BYTES:
        raise ValueError("A imagem excede o limite de 15 MB")

    try:
        with Image.open(io.BytesIO(bytes_imagem)) as arquivo:
            arquivo.load()
            imagem = ImageOps.exif_transpose(arquivo).convert("RGB")

    except (
        UnidentifiedImageError,
        OSError,
        Image.DecompressionBombError,
    ) as erro:
        raise ValueError("Arquivo de imagem inválido") from erro

    largura, altura = imagem.size

    if min(largura, altura) < MIN_IMAGE_SIZE:
        raise ValueError(f"Resolução insuficiente: " f"{largura}x{altura}.")

    if largura * altura > MAX_IMAGE_PIXELS:
        raise ValueError("A imagem possui pixels demais")

    if float(np.asarray(imagem).std()) < 2.0:
        raise ValueError("Imagem sem variação visual suficiente")

    return imagem
