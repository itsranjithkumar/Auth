"use client"
import { GoogleAuthButton } from "../../components/GoogleAuthButton"

import { useRouter } from "next/navigation"

function SignupFormDemo() {
  const router = useRouter();
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="shadow-2xl w-full max-w-md rounded-3xl bg-white border border-gray-100 p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Join Aceternity</h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Create your new account instantly using Google. Get started in seconds with secure authentication
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
                  localStorage.setItem("access_token", result.access_token)
                  router.push('/dashboard')
                } else {
                  const err = await res.json()
                  alert(err.detail || "Google Sign-up failed")
                }
              } catch (error) {
                alert("Google Sign-up failed: " + error)
              }
            }}
          />
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

export default SignupFormDemo
