"use client"

import type React from "react"

import { useEffect } from "react"
import { setupStorage } from "@/lib/supabase-storage"

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize storage buckets
    setupStorage()
  }, [])

  return <>{children}</>
}
