import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export function GoogleAuthButton({ onSuccess }: { onSuccess: (token: string) => void }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (credentialResponse.credential) {
            onSuccess(credentialResponse.credential);
          } else {
            alert('Google login failed: No credential');
          }
        }}
        onError={() => {
          alert('Google login failed');
        }}
        useOneTap
      />
    </GoogleOAuthProvider>
  );
}
