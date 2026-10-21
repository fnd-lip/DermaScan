import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

interface BotaoGoogleAutenticacaoProps {
  readonly onCredencial: (credential: string) => void;
  readonly onErro: () => void;
}

export function BotaoGoogleAutenticacao({
  onCredencial,
  onErro,
}: BotaoGoogleAutenticacaoProps) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const usarRedirect = import.meta.env.PROD;

  if (!clientId) {
    return (
      <p className="py-3 text-center text-xs text-[#686577]">
        Login com Google indisponível neste ambiente.
      </p>
    );
  }

  return (
    <div className="flex w-full justify-center">
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
          onSuccess={(resposta) => {
            if (!resposta.credential) {
              onErro();
              return;
            }

            onCredencial(resposta.credential);
          }}
          onError={onErro}
          type="standard"
          theme="outline"
          size="medium"
          shape="rectangular"
          text="continue_with"
          logo_alignment="left"
          width="320"
          ux_mode={usarRedirect ? "redirect" : "popup"}
          login_uri={
            usarRedirect
              ? `${window.location.origin}/auth/google/redirect`
              : undefined
          }
          use_fedcm_for_button={!usarRedirect}
        />
      </GoogleOAuthProvider>
    </div>
  );
}
