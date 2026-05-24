import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import type { Prisma } from "../generated/prisma";
import { classificarLesao } from "../services/classificacao.service";
import { classificarComMlService } from "../services/ml.service";

function converterParaJsonPrisma(valor: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(valor ?? [])) as Prisma.InputJsonValue;
}

export async function classificarImagem(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { imageBase64, sampleId } = req.body as {
      imageBase64?: string;
      sampleId?: string;
    };

    const usuarioId = req.usuarioId;

    if (!usuarioId) {
      res.status(401).json({
        error: "Usuário não autenticado.",
      });
      return;
    }

    if (!imageBase64 && !sampleId) {
      res.status(400).json({
        error: "Envie uma imagem ou uma amostra para análise.",
      });
      return;
    }

    const predicao = imageBase64
      ? await classificarComMlService(imageBase64)
      : classificarLesao(sampleId);

    const predicaoComImagem = predicao as typeof predicao & {
      imagemUrl?: string | null;
    };

    const imagemUrlFinal = imageBase64 || predicaoComImagem.imagemUrl || null;

    const probabilidadesJson = converterParaJsonPrisma(
      predicao.probabilidades ?? [],
    );

    const analise = await prisma.analise.create({
      data: {
        usuarioId,
        sampleId: sampleId ?? null,
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
      confianca: predicao.confianca,
      nivelAtencao: predicao.nivelAtencao,
      probabilidades: predicao.probabilidades ?? [],
      fonte: predicao.fonte,
      imagemUri: imagemUrlFinal,
      dataAnalise: analise.criadoEm.toISOString(),
    });
  } catch (erro) {
    console.error("Erro ao classificar imagem:", erro);

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
        nivelAtencao: analise.nivelAtencao,
        probabilidades: analise.probabilidades ?? [],
        dataAnalise: analise.criadoEm.toISOString(),
        imagemUri: analise.imagemUrl,
        fonte: analise.fonte,
      })),
    );
  } catch (erro) {
    console.error("Erro ao listar análises:", erro);

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
  } catch (erro) {
    console.error("Erro ao excluir análise:", erro);

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
  } catch (erro) {
    console.error("Erro ao limpar histórico:", erro);

    res.status(500).json({
      error: "Erro interno ao limpar histórico.",
    });
  }
}