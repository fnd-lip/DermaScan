import { AlertTriangle, Camera, ShieldCheck } from "lucide-react";

const estiloConteudo =
  "mt-1.5 space-y-3 border-t border-gray-100 pt-4 text-xs leading-relaxed text-gray-600";

export function ConteudoSobreAplicativo() {
  return (
    <div className={estiloConteudo}>
      <p>
        <strong className="text-[#252137]">DermaScan</strong> é uma plataforma
        de apoio à avaliação de lesões de pele, desenvolvida para profissionais
        de dermatologia.
      </p>

      <p>
        A solução utiliza modelos computacionais para fornecer informações
        complementares à análise clínica, auxiliando a interpretação de imagens
        dermatológicas.
      </p>

      <p>
        O DermaScan foi pensado para integrar tecnologia e prática profissional,
        mantendo o especialista no centro das decisões.
      </p>

      <p className="pt-1 text-[11px] text-gray-400">
        DermaScan · Plataforma de apoio à avaliação dermatológica
      </p>
    </div>
  );
}

export function ConteudoAvisoMedico() {
  return (
    <div className={estiloConteudo}>
      <div className="flex items-center gap-2 text-[#6962dd]">
        <AlertTriangle size={17} aria-hidden="true" className="shrink-0" />
        <strong>Uso clínico e limitações</strong>
      </div>

      <p>
        O DermaScan oferece informações complementares para apoiar a avaliação
        dermatológica. Seus resultados não constituem diagnóstico clínico
        definitivo.
      </p>

      <p>
        As estimativas produzidas por modelos de inteligência artificial devem
        ser interpretadas considerando a anamnese, o exame físico e os demais
        achados clínicos relevantes.
      </p>

      <p>
        A indicação de dermatoscopia, exames complementares, acompanhamento ou
        tratamento permanece sob responsabilidade do profissional habilitado.
      </p>

      <p className="font-medium text-[#252137]">
        A decisão clínica deve considerar o conjunto das evidências disponíveis,
        não apenas o resultado apresentado pela plataforma.
      </p>
    </div>
  );
}

export function ConteudoPrivacidadeDados() {
  return (
    <div className={estiloConteudo}>
      <div className="flex items-center gap-2 text-[#6962dd]">
        <ShieldCheck size={17} aria-hidden="true" />
        <strong>Privacidade e informações clínicas</strong>
      </div>

      <p>
        Imagens dermatológicas e informações associadas podem conter dados
        pessoais sensíveis e exigem cuidados específicos de proteção.
      </p>

      <p>
        As imagens utilizadas nas análises são enviadas ao serviço responsável
        pelo processamento. Os registros também podem integrar o histórico da
        aplicação.
      </p>

      <p>
        O acesso, o armazenamento, a retenção e a exclusão desses dados devem
        seguir as políticas de segurança e privacidade estabelecidas para a
        plataforma.
      </p>

      <p>
        Evite incluir informações que identifiquem diretamente pacientes quando
        não forem necessárias à avaliação.
      </p>
    </div>
  );
}

export function ConteudoPermissoes() {
  return (
    <div className={estiloConteudo}>
      <div className="flex items-center gap-2 text-[#6962dd]">
        <Camera size={17} aria-hidden="true" />
        <strong>Permissões do dispositivo</strong>
      </div>

      <p>
        Algumas funcionalidades do DermaScan podem solicitar acesso aos recursos
        do dispositivo, conforme a forma de utilização.
      </p>

      <div className="space-y-3 rounded-xl bg-gray-50 p-4">
        <div>
          <p className="font-semibold text-[#252137]">Câmera</p>
          <p className="mt-1">
            O navegador pode solicitar autorização para capturar imagens
            diretamente.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <p className="font-semibold text-[#252137]">Arquivos e imagens</p>
          <p className="mt-1">
            Você pode selecionar imagens armazenadas no dispositivo para
            realizar análises.
          </p>
        </div>
      </div>

      <p>
        As permissões podem ser gerenciadas nas configurações do navegador ou
        dispositivo.
      </p>
    </div>
  );
}
