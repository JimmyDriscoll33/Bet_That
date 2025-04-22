"use client"//trying to fix something

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Check for error parameter in URL
  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      setError(errorParam)
    }
  }, [searchParams])

  // Get redirect URL from query params
  const redirectPath = searchParams.get("redirect") || "/dashboard"

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log("Attempting sign in with email:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Auth error:", error)
        setError(error.message)
        return
      }

      if (data?.session) {
        console.log("Sign in successful, redirecting to dashboard")

        // Force a refresh of auth state before redirecting
        await supabase.auth.getSession()

        // Use window.location for a full page refresh to ensure auth state is updated
        window.location.href = redirectPath
      } else {
        setError("Authentication successful but no session was created")
      }
    } catch (err) {
      console.error("Exception during sign in:", err)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log("Attempting sign up with email:", email)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error("Sign up error:", error)
        setError(error.message)
        return
      }

      if (data.user) {
        console.log("Sign up successful")
        setError(null)
        alert("Check your email for the confirmation link")
      }
    } catch (err) {
      console.error("Exception during sign up:", err)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border p-6 shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome to Bet That</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Button type="submit" onClick={handleSignIn} disabled={loading} className="w-full">
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <Button type="button" variant="outline" onClick={handleSignUp} disabled={loading} className="w-full">
              {loading ? "Processing..." : "Create Account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
