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
          use_fedcm_for_button={true}
        />
      </GoogleOAuthProvider>
    </div>
  );
}
