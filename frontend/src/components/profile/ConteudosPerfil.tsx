import React from "react";
import { AlertTriangle } from "lucide-react";

export const ConteudoSobreAplicativo: React.FC = () => {
  return (
    <div className="space-y-2 border-t border-gray-100 pt-3 mt-1.5 text-xs text-gray-600 leading-relaxed">
      <p>
        <strong>Projeto:</strong> DermaScan
      </p>

      <p>Este aplicativo foi desenvolvido como uma solução educacional.</p>

      <p>
        Desenvolvido originalmente sob a arquitetura{" "}
        <strong>React Native</strong> e TypeScript, integrando redes
        convolucionais para detecção de anomalias epiteliais na saúde digital.
      </p>

      <p className="text-[10px] text-gray-400 font-mono mt-1">
        DermaScan - Versão Acadêmica 1.0
      </p>
    </div>
  );
};

export const ConteudoAvisoMedico: React.FC = () => {
  return (
    <div className="space-y-2 border-t border-gray-100 pt-3 mt-1.5 text-xs text-gray-650 leading-relaxed">
      <p className="font-bold text-amber-700 flex items-center gap-1.5">
        <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0" />
        FINALIDADE INFORMATIVA E EDUCACIONAL
      </p>

      <p>
        Este aplicativo possui finalidade puramente educacional e informativa,
        não realizando diagnósticos médicos definitivos de qualquer natureza.
      </p>

      <p>
        O resultado gerado por este analisador probabilístico por inteligência
        artificial é um indicador complementar e{" "}
        <strong>
          não substitui de forma alguma uma consulta médica presencial ou exame
          especializado (dermatoscopia)
        </strong>
        {"."}
      </p>

      <p>
        Em caso de evolução rápida da lesão, sangramento espontâneo, dor local,
        coceira intensa, alteração de coloração (diâmetro ou simetria) ou
        aparecimento de bordas irregulares, procure imediatamente um médico
        dermatologista certificado.
      </p>
    </div>
  );
};

export const ConteudoPrivacidadeDados: React.FC = () => {
  return (
    <div className="space-y-2 border-t border-gray-100 pt-3 mt-1.5 text-xs text-gray-600 leading-relaxed">
      <p>
        <strong>Tratamento das Imagens de Pele:</strong>
      </p>

      <p>
        Compreendemos a delicadeza envolvida no registro de imagens
        dermatológicas. Suas fotos são enviadas via protocolo seguro HTTPS para
        nossa API em nuvem apenas para extrair as probabilidades clínicas.
      </p>

      <p>
        Como padrão de segurança, os dados são utilizados no contexto do
        histórico da aplicação e devem ser interpretados somente como apoio
        educacional, não como diagnóstico médico definitivo.
      </p>
    </div>
  );
};

type LinhaPermissaoProps = Readonly<{
  nome: string;
}>;

function LinhaPermissao({ nome }: LinhaPermissaoProps) {
  return (
    <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-150">
      <span className="font-semibold text-gray-800">{nome}:</span>

      <span className="text-[10px] bg-emerald-500 text-white font-bold uppercase px-2 py-0.5 rounded-full">
        Ativo / Permitido
      </span>
    </div>
  );
}

export const ConteudoPermissoes: React.FC = () => {
  return (
    <div className="space-y-3.5 border-t border-gray-100 pt-3 mt-1.5 text-xs text-gray-600">
      <p>
        Verifique as permissões ativas concedidas ao aplicativo nas diretivas do
        sistema operacional:
      </p>

      <div className="space-y-2">
        <LinhaPermissao nome="Câmera Fotográfica" />
        <LinhaPermissao nome="Galeria de Mídia" />
      </div>
    </div>
  );
};
