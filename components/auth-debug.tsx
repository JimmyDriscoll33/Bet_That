"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AuthDebug() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function getSession() {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error("Error getting session:", error)
        }
        setSession(data.session)
      } catch (err) {
        console.error("Exception getting session:", err)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event)
      setSession(session)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return <div>Loading authentication status...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication Debug</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <strong>Status:</strong> {session ? "Authenticated" : "Not authenticated"}
          </div>

          {session && (
            <>
              <div>
                <strong>User ID:</strong> {session.user.id}
              </div>
              <div>
                <strong>Email:</strong> {session.user.email}
              </div>
              <div>
                <strong>Token expires:</strong> {new Date(session.expires_at * 1000).toLocaleString()}
              </div>
            </>
          )}

          <Button onClick={handleSignOut} variant="destructive">
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
