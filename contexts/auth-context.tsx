"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import type { Session, User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signUp: (email: string, password: string, username: string, fullName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // This function will run once on component mount to get the initial session
    const initializeAuth = async () => {
      try {
        setIsLoading(true)

        // Get the current session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting auth session:", error)
          return
        }

        if (session) {
          setSession(session)
          setUser(session.user)
          console.log("Auth initialized with session")
        } else {
          console.log("No active session found")
        }
      } catch (err) {
        console.error("Unexpected error during auth initialization:", err)
      } finally {
        setIsLoading(false)
      }
    }

    // Set up the auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state changed:", event)

      setSession(newSession)
      setUser(newSession?.user ?? null)
      setIsLoading(false)

      // Handle specific auth events
      if (event === "SIGNED_IN") {
        console.log("User signed in")
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out")
      } else if (event === "TOKEN_REFRESHED") {
        console.log("Token refreshed")
      } else if (event === "USER_UPDATED") {
        console.log("User updated")
      }
    })

    // Initialize auth
    initializeAuth()

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, username: string, fullName: string) => {
    setIsLoading(true)

    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            username,
            full_name: fullName,
          },
        },
      })

      if (authError) {
        throw authError
      }

      if (authData.user) {
        // Create a profile in the users table
        const { error: profileError } = await supabase.from("users").insert({
          id: authData.user.id,
          email,
          username,
          full_name: fullName,
          bet_coins: 100, // Starting bet coins
          balance: 0,
        })

        if (profileError) {
          console.error("Error creating user profile:", profileError)
          // Continue anyway since the auth account was created
        }

        // Wait for the session to be established
        if (authData.session) {
          setSession(authData.session)
          setUser(authData.user)
        }

        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error("Error during sign up:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (data.session) {
        setSession(data.session)
        setUser(data.user)
        router.push("/dashboard")
      } else {
        throw new Error("No session returned after sign in")
      }
    } catch (error: any) {
      console.error("Error during sign in:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      // Clear auth state
      setSession(null)
      setUser(null)

      // Redirect to home page
      router.push("/")
    } catch (error: any) {
      console.error("Error during sign out:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
