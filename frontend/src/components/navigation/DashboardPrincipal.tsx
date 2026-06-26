import React from "react";
import { ConteudoDashboard } from "../dashboard/ConteudoDashboard";
import type { DashboardPrincipalProps } from "../dashboard/types";
import { MenuLateral } from "./MenuLateral";

export const DashboardPrincipal: React.FC<DashboardPrincipalProps> = ({
  abaAtiva,
  usuarioLogado,
  onAlterarAba,
  onPrepararAnalise,
  ...propsConteudo
}) => {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden lg:flex-row">
      <MenuLateral
        abaAtiva={abaAtiva}
        usuarioLogado={usuarioLogado}
        onAlterarAba={onAlterarAba}
        onPrepararAnalise={onPrepararAnalise}
      />

      <ConteudoDashboard
        abaAtiva={abaAtiva}
        usuarioLogado={usuarioLogado}
        onPrepararAnalise={onPrepararAnalise}
        {...propsConteudo}
      />
    </div>
  );
};