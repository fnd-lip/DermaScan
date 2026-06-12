import React, { useState } from "react";
import { ItemPreferenciaPerfil } from "./ItemPreferenciaPerfil";

interface PreferenciasPerfilProps {
  salvarAuto: boolean;
  onToggleSalvarAuto: (valor: boolean) => void;
}

export const PreferenciasPerfil: React.FC<PreferenciasPerfilProps> = ({
  salvarAuto,
  onToggleSalvarAuto,
}) => {
  const [modoEscuroSimulado, setModoEscuroSimulado] = useState(false);
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);

  return (
    <div>
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 mb-2.5">
        Preferências
      </h3>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
        <ItemPreferenciaPerfil
          titulo="Salvar histórico automaticamente"
          descricao="Persiste suas resoluções no cache do celular ordinário."
          ativo={salvarAuto}
          onToggle={() => onToggleSalvarAuto(!salvarAuto)}
        />

        <ItemPreferenciaPerfil
          titulo="Ativar Modo Escuro (Simulado)"
          descricao="Alterna paleta cromática sutil para o visual noturno."
          ativo={modoEscuroSimulado}
          onToggle={() => setModoEscuroSimulado((valorAtual) => !valorAtual)}
        />

        <ItemPreferenciaPerfil
          titulo="Notificações Inteligentes"
          descricao="Envia lembretes mensais preventivos de auto-exame."
          ativo={notificacoesAtivas}
          onToggle={() => setNotificacoesAtivas((valorAtual) => !valorAtual)}
          descricaoLeve
        />
      </div>
    </div>
  );
};