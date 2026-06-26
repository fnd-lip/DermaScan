import React from "react";
import { TelaAnalise } from "../../screens/TelaAnalise";
import { TelaConferirImagem } from "../../screens/TelaConferirImagem";
import { TelaProcessandoAnalise } from "../../screens/TelaProcessandoAnalise";
import { TelaResultado } from "../../screens/TelaResultado";
import type { TelaAnaliseWorkspaceProps } from "./types";

export const TelaAnaliseWorkspace: React.FC<TelaAnaliseWorkspaceProps> = ({
  faseAnalise,
  imagemSelecionada,
  isCustomPhoto,
  predicaoAtiva,
  salvoNoHistorico,
  onSelecionarImagem,
  onVoltarParaUpload,
  onConfirmarAnalise,
  onNovaAnalise,
  onSalvarNoHistorico,
}) => {
  return (
    <div className="relative h-full overflow-hidden">
      {faseAnalise === "upload" && (
        <TelaAnalise onImagemSelecionada={onSelecionarImagem} />
      )}

      {faseAnalise === "conferir" && (
        <TelaConferirImagem
          imagemUri={imagemSelecionada}
          onVoltar={onVoltarParaUpload}
          onConfirmar={onConfirmarAnalise}
          isCustomPhoto={isCustomPhoto}
        />
      )}

      {faseAnalise === "processando" && (
        <TelaProcessandoAnalise onFinalizarProcessamento={() => {}} />
      )}

      {faseAnalise === "resultado" && predicaoAtiva && (
        <TelaResultado
          predicao={predicaoAtiva}
          imagemUri={imagemSelecionada}
          onNovaAnalise={onNovaAnalise}
          onSalvarNoHistorico={onSalvarNoHistorico}
          salvo={salvoNoHistorico}
        />
      )}
    </div>
  );
};
