import React, { useState } from "react";
import {
  User,
  Settings,
  ShieldCheck,
  Camera,
  LogOut,
  Info,
  ToggleLeft,
  ToggleRight,
  Check,
  Eye,
  AlertTriangle,
} from "lucide-react";

interface TelaPerfilProps {
  onRecarregarApp: () => void;
  salvarAuto: boolean;
  onToggleSalvarAuto: (val: boolean) => void;
  historicoCount: number;
  nomeUsuario?: string;
  emailUsuario?: string;
  onSairDaConta?: () => void;
}

export const TelaPerfil: React.FC<TelaPerfilProps> = ({
  onRecarregarApp,
  salvarAuto,
  onToggleSalvarAuto,
  historicoCount,
  nomeUsuario = "Usuário",
  emailUsuario = "E-mail não informado",
  onSairDaConta,
}) => {
  const [modoEscuroSimulado, setModoEscuroSimulado] = useState(false);
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
  const [abaAberta, setAbaAberta] = useState<string | null>("sobre");
  const [confirmandoSair, setConfirmandoSair] = useState(false);

  const toggleAutoSave = () => {
    onToggleSalvarAuto(!salvarAuto);
  };

  const menuSections = [
    {
      id: "sobre",
      titulo: "Sobre o Aplicativo",
      icone: <Info className="w-5 h-5 text-teal-600" />,
      conteudo: (
        <div className="space-y-2 border-t border-gray-100 pt-3 mt-1.5 text-xs text-gray-600 leading-relaxed">
          <p>
            <strong>Projeto:</strong> DermaScan
          </p>
          <p>
            Este aplicativo foi desenvolvido como uma solução educacional e
            acadêmica para demonstrar o uso prático de modelos de aprendizagem
            profunda (Deep Learning) na classificação automatizada de lesões
            dermatológicas baseado em imagens.
          </p>
          <p>
            Desenvolvido originalmente sob a arquitetura{" "}
            <strong>React Native</strong> e TypeScript, integrando redes
            convolucionais para detecção de anomalias epiteliais na saúde
            digital.
          </p>
          <p className="text-[10px] text-gray-400 font-mono mt-1">
            DermaScan - Versão Acadêmica 1.0
          </p>
        </div>
      ),
    },
    {
      id: "aviso_medico",
      titulo: "Aviso Médico Obrigatório",
      icone: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      conteudo: (
        <div className="space-y-2 border-t border-gray-100 pt-3 mt-1.5 text-xs text-gray-650 leading-relaxed">
          <p className="font-bold text-amber-700 flex items-center gap-1.5">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0" />
            FINALIDADE INFORMATIVA E EDUCACIONAL
          </p>
          <p>
            Este aplicativo possui finalidade puramente educacional e
            informativa, não realizando diagnósticos médicos definitivos de
            qualquer natureza.
          </p>
          <p>
            O resultado gerado por este analisador probabilístico por
            inteligência artificial é um indicador complementar e{" "}
            <strong>
              não substitui de forma alguma uma consulta médica presencial ou
              exame especializado (dermatoscopia)
            </strong>
            .
          </p>
          <p>
            Em caso de evolução rápida da lesão, sangramento espontâneo, dor
            local, coceira intensa, alteração de coloração (diâmetro ou
            simetria) ou aparecimento de bordas irregulares, procure
            imediatamente um médico dermatologista certificado.
          </p>
        </div>
      ),
    },
    {
      id: "privacidade",
      titulo: "Privacidade de Dados",
      icone: <ShieldCheck className="w-5 h-5 text-indigo-600" />,
      conteudo: (
        <div className="space-y-2 border-t border-gray-100 pt-3 mt-1.5 text-xs text-gray-600 leading-relaxed">
          <p>
            <strong>Tratamento das Imagens de Pele:</strong>
          </p>
          <p>
            Compreendemos a delicadeza envolvida no registro de imagens
            dermatológicas. Suas fotos são enviadas via protocolo seguro HTTPS
            para nossa API em nuvem (Gemini Vision 3.5 Flash) apenas e
            unicamente para extrair as probabilidades clínicas.
          </p>
          <p>
            Como padrão de segurança integral, as imagens{" "}
            <strong>
              não são salvas em bancos de dados perpetuados em servidores
              externos
            </strong>
            . Seu histórico e dados de análises anteriores permanecem
            exclusivamente residentes no cache de memória local (localStorage)
            de seu dispositivo pessoal.
          </p>
        </div>
      ),
    },
    {
      id: "permissoes",
      titulo: "Gerenciar Permissões",
      icone: <Camera className="w-5 h-5 text-emerald-600" />,
      conteudo: (
        <div className="space-y-3.5 border-t border-gray-100 pt-3 mt-1.5 text-xs text-gray-600">
          <p>
            Verifique as permissões ativas concedidas ao aplicativo nas
            diretivas do sistema operacional:
          </p>

          <div className="space-y-2">
            <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-150">
              <span className="font-semibold text-gray-800">
                Câmera Fotográfica:
              </span>
              <span className="text-[10px] bg-emerald-500 text-white font-bold uppercase px-2 py-0.5 rounded-full">
                Ativo / Permitido
              </span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-150">
              <span className="font-semibold text-gray-800">
                Galeria de Mídia:
              </span>
              <span className="text-[10px] bg-emerald-500 text-white font-bold uppercase px-2 py-0.5 rounded-full">
                Ativo / Permitido
              </span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 text-gray-800 p-5 overflow-y-auto font-sans pb-20 select-none">
      {/* Upper Profile presentation card */}
      <div className="bg-white border border-gray-100 p-4.5 rounded-2xl flex items-center gap-4 shadow-sm">
        {/* Avatar circle */}
        <div className="w-14 h-14 bg-teal-55 bg-teal-50 text-teal-700 font-bold border border-teal-100 rounded-full flex items-center justify-center text-lg shadow-inner">
          {nomeUsuario
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 leading-none">
            {nomeUsuario}
          </h3>
          <p className="text-[11px] text-gray-400 mt-1 font-mono truncate">
            {emailUsuario}
          </p>

          <div className="flex gap-2 mt-2">
            <span className="text-[9px] bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
              Usuário Acadêmico
            </span>
            <span className="text-[9px] bg-slate-100 text-gray-600 font-bold px-2 py-0.5 rounded-full font-mono">
              Laudos: {historicoCount}
            </span>
          </div>
        </div>
      </div>

      {/* Configuration Sliders / Switches */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 mb-2.5">
          Preferências
        </h3>

        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
          <div className="p-4 flex justify-between items-center bg-white">
            <div>
              <span className="text-xs font-bold text-gray-800 block">
                Salvar histórico automaticamente
              </span>
              <p className="text-[10px] text-gray-400 leading-snug mt-0.5">
                Persiste suas resoluções no cache do celular ordinário.
              </p>
            </div>
            <button
              onClick={toggleAutoSave}
              className="text-teal-600 focus:outline-none shrink-0 pl-1"
            >
              {salvarAuto ? (
                <ToggleRight className="w-9 h-9" />
              ) : (
                <ToggleLeft className="w-9 h-9 text-gray-300" />
              )}
            </button>
          </div>

          <div className="p-4 flex justify-between items-center bg-white">
            <div>
              <span className="text-xs font-bold text-gray-800 block">
                Ativar Modo Escuro (Simulado)
              </span>
              <p className="text-[10px] text-gray-400 leading-snug mt-0.5">
                Alterna paleta cromática sutil para o visual noturno.
              </p>
            </div>
            <button
              onClick={() => setModoEscuroSimulado(!modoEscuroSimulado)}
              className="text-teal-600 focus:outline-none shrink-0 pl-1"
            >
              {modoEscuroSimulado ? (
                <ToggleRight className="w-9 h-9" />
              ) : (
                <ToggleLeft className="w-9 h-9 text-gray-300" />
              )}
            </button>
          </div>

          <div className="p-4 flex justify-between items-center bg-white">
            <div>
              <span className="text-xs font-bold text-gray-800 block">
                Notificações Inteligentes
              </span>
              <p className="text-[10px] text-gray-400 leading-snug mt-0.5 font-light">
                Envia lembretes mensais preventivos de auto-exame.
              </p>
            </div>
            <button
              onClick={() => setNotificacoesAtivas(!notificacoesAtivas)}
              className="text-teal-600 focus:outline-none shrink-0 pl-1"
            >
              {notificacoesAtivas ? (
                <ToggleRight className="w-9 h-9" />
              ) : (
                <ToggleLeft className="w-9 h-9 text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Accordion List sections (Sobre, Privacidade, Permissões) */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 mb-2.5">
          Políticas e Atribuições
        </h3>

        <div className="space-y-3">
          {menuSections.map((item) => {
            const aberto = abaAberta === item.id;
            return (
              <div
                key={item.id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setAbaAberta(aberto ? null : item.id)}
                  className="w-full p-4 flex justify-between items-center text-left bg-white hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-gray-100 flex items-center justify-center shrink-0">
                      {item.icone}
                    </div>
                    <span className="text-xs.1 font-bold text-gray-700">
                      {item.titulo}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {aberto ? "Ocultar" : "Exibir"}
                  </span>
                </button>
                {aberto && (
                  <div className="px-4.5 pb-4.5 bg-white select-text font-normal animate-fadeIn">
                    {item.conteudo}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Logout Command reset button */}
      <div className="pt-3">
        {confirmandoSair ? (
          <div className="bg-red-50 border border-red-150 rounded-2xl p-4.5 flex flex-col items-center text-center space-y-3 animate-fadeIn">
            <p className="text-xs font-extrabold text-red-800">
              Deseja realmente sair da sua conta?
            </p>
            <p className="text-[10px] text-red-650/80 leading-snug">
              Sua sessão clínica ativa será encerrada. Será necessário se
              re-autenticar com e-mail e senha.
            </p>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => {
                  setConfirmandoSair(false);
                  if (onSairDaConta) {
                    onSairDaConta();
                  } else {
                    onRecarregarApp();
                  }
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                Sim, Sair
              </button>
              <button
                onClick={() => setConfirmandoSair(false)}
                className="flex-1 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmandoSair(true)}
            className="w-full py-3.5 text-center font-bold text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-2xl transition-all flex items-center justify-center gap-1.5 border border-red-100 shadow-xs active:scale-[0.99]"
          >
            <LogOut className="w-4 h-4" />
            Sair da Conta (Logout)
          </button>
        )}
      </div>
    </div>
  );
};
