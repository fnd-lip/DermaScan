import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import type { Prisma } from "../generated/prisma";
import { classificarComMlService } from "../services/ml.service";
import { salvarImagemBase64 } from "../services/arquivo.service";

function converterParaJsonPrisma(valor: unknown): Prisma.InputJsonValue {
  return structuredClone(valor ?? []) as Prisma.InputJsonValue;
}

function montarUrlImagem(
  req: Request,
  imagemUrl: string | null,
): string | null {
  if (!imagemUrl) {
    return null;
  }

  if (imagemUrl.startsWith("http")) {
    return imagemUrl;
  }

  if (imagemUrl.startsWith("data:image")) {
    return imagemUrl;
  }

  return `${req.protocol}://${req.get("host")}${imagemUrl}`;
}

export async function classificarImagem(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { imageBase64 } = req.body as {
      imageBase64?: string;
    };

    const usuarioId = req.usuarioId;

    if (!usuarioId) {
      res.status(401).json({
        error: "Usuário não autenticado.",
      });
      return;
    }

    if (
      !imageBase64 ||
      typeof imageBase64 !== "string" ||
      imageBase64.trim().length === 0
    ) {
      res.status(400).json({
        error: "Envie uma imagem válida para análise.",
      });
      return;
    }

    const predicao = await classificarComMlService(imageBase64);

    const { codigo, confiancaPercentual, alertaAtencao, alertas } = predicao;

    const imagemSalva = await salvarImagemBase64(imageBase64, usuarioId);

    const imagemUrlFinal = imagemSalva.caminhoRelativo;

    const probabilidadesJson = converterParaJsonPrisma(predicao.probabilidades);

    const analise = await prisma.analise.create({
      data: {
        usuario: {
          connect: {
            id: usuarioId,
          },
        },
        imagemUrl: imagemUrlFinal,
        classePrevista: predicao.classePrevista,
        confianca: predicao.confianca,
        nivelAtencao: predicao.nivelAtencao,
        fonte: predicao.fonte,
        probabilidades: probabilidadesJson,
      },
    });

    res.json({
      id: analise.id,
      classePrevista: predicao.classePrevista,
      codigo,
      confianca: predicao.confianca,
      confiancaPercentual,
      nivelAtencao: predicao.nivelAtencao,
      alertaAtencao,
      alertas,
      probabilidades: predicao.probabilidades,
      fonte: predicao.fonte,
      imagemUri: montarUrlImagem(req, imagemUrlFinal),
      dataAnalise: analise.criadoEm.toISOString(),
    });
  } catch (error_) {
    console.error("Erro ao classificar imagem:", error_);

    res.status(500).json({
      error: "Erro interno ao processar a análise.",
    });
  }
}

export async function listarAnalises(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const usuarioId = req.usuarioId;

    if (!usuarioId) {
      res.status(401).json({
        error: "Usuário não autenticado.",
      });
      return;
    }

    const analises = await prisma.analise.findMany({
      where: {
        usuarioId,
      },
      orderBy: {
        criadoEm: "desc",
      },
    });

    res.json(
      analises.map((analise) => ({
        id: analise.id,
        classePrevista: analise.classePrevista,
        confianca: analise.confianca,
        confiancaPercentual: Number((analise.confianca * 100).toFixed(2)),
        nivelAtencao: analise.nivelAtencao,
        probabilidades: analise.probabilidades ?? [],
        dataAnalise: analise.criadoEm.toISOString(),
        imagemUri: montarUrlImagem(req, analise.imagemUrl),
        fonte: analise.fonte,
      })),
    );
  } catch (error_) {
    console.error("Erro ao listar análises:", error_);

    res.status(500).json({
      error: "Erro interno ao buscar histórico de análises.",
    });
  }
}

export async function excluirAnalise(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const idParam = req.params.id;
    const usuarioId = req.usuarioId;

    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    if (!usuarioId) {
      res.status(401).json({
        error: "Usuário não autenticado.",
      });
      return;
    }

    if (!id) {
      res.status(400).json({
        error: "ID da análise não informado.",
      });
      return;
    }

    const resultado = await prisma.analise.deleteMany({
      where: {
        id,
        usuarioId,
      },
    });

    if (resultado.count === 0) {
      res.status(404).json({
        error: "Análise não encontrada para este usuário.",
      });
      return;
    }

    res.json({
      mensagem: "Análise excluída com sucesso.",
    });
  } catch (error_) {
    console.error("Erro ao excluir análise:", error_);

    res.status(500).json({
      error: "Erro interno ao excluir análise.",
    });
  }
}

export async function limparAnalises(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const usuarioId = req.usuarioId;

    if (!usuarioId) {
      res.status(401).json({
        error: "Usuário não autenticado.",
      });
      return;
    }

    await prisma.analise.deleteMany({
      where: {
        usuarioId,
      },
    });

    res.json({
      mensagem: "Histórico de análises limpo com sucesso.",
    });
  } catch (error_) {
    console.error("Erro ao limpar histórico:", error_);

    res.status(500).json({
      error: "Erro interno ao limpar histórico.",
    });
  }
}
