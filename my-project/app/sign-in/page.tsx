"use client"
import { GoogleAuthButton } from "../../components/GoogleAuthButton"
import { jwtDecode } from "jwt-decode"
import { useRouter } from "next/navigation"

function SigninFormDemo() {
  const router = useRouter();
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="shadow-2xl w-full max-w-md rounded-3xl bg-white border border-gray-100 p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome Back</h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Sign in to your account using your Google account for quick and secure access
          </p>
        </div>

        <div className="border-t border-gray-100 pt-8">
          <GoogleAuthButton
            onSuccess={async (idToken: string) => {
              try {
                const res = await fetch("http://127.0.0.1:8000/google-login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id_token: idToken }),
                })
                if (res.ok) {
                  const result = await res.json()
                  // Decode Google ID token to get Google avatar
                  try {
                    // jwtDecode is imported at the top
                    const googleProfile = jwtDecode(idToken) as { picture?: string };
                    if (googleProfile.picture) {
                      localStorage.setItem("avatar", googleProfile.picture);
                    }
                  } catch (e) { /* ignore */ }
                  localStorage.setItem("token", result.access_token)
                  if (result.avatar) {
                    localStorage.setItem("avatar", result.avatar);
                  }
                  router.push('/dashboard')
                } else {
                  const err = await res.json()
                  alert(err.detail || "Google Sign-in failed")
                }
              } catch (error) {
                alert("Google Sign-in failed: " + error)
              }
            }}
          />
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

export default SigninFormDemo
