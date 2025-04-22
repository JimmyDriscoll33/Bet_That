"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(true)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback page loaded")

        // Get the code from the URL
        const code = searchParams.get("code")

        if (!code) {
          console.error("No authentication code found in URL")
          setError("No authentication code found in URL")
          setProcessing(false)
          return
        }

        console.log("Exchanging code for session")

        // Exchange the code for a session
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
          console.error("Error exchanging code for session:", exchangeError)
          setError("Authentication failed. Please try again.")
          setProcessing(false)
          return
        }

        // Check if we have a session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Error getting session:", sessionError)
          setError("Failed to get authentication session")
          setProcessing(false)
          return
        }

        if (session) {
          console.log("Session established, redirecting to dashboard")

          // Use window.location for a full page refresh to ensure auth state is updated
          window.location.href = "/dashboard"
        } else {
          console.error("No session found after code exchange")
          setError("Authentication successful but no session was created")
          setProcessing(false)
        }
      } catch (err) {
        console.error("Exception during auth callback:", err)
        setError("An unexpected error occurred during authentication")
        setProcessing(false)
      }
    }

    handleAuthCallback()
  }, [router, searchParams, supabase.auth])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Authentication Error</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Completing authentication...</h2>
        <div className="flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        {processing && <p className="mt-4 text-muted-foreground">This may take a few seconds...</p>}
      </div>
    </div>
  )
}
