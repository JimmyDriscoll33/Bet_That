"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export function SeedAchievements() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const seedAchievements = async () => {
    setLoading(true)

    try {
      // Check if achievements already exist
      const { count, error: countError } = await supabase
        .from("achievements")
        .select("*", { count: "exact", head: true })

      if (countError) {
        throw countError
      }

      if (count && count > 0) {
        toast({
          title: "Achievements already exist",
          description: "The achievements table already has data.",
        })
        setLoading(false)
        return
      }

      // Insert achievement data
      const { error } = await supabase.from("achievements").insert([
        {
          name: "Big Spender",
          description: "Place a bet of $100 or more",
          icon: "dollar",
          color: "yellow",
          bet_coins_reward: 50,
        },
        {
          name: "Winning Streak",
          description: "Win 5 bets in a row",
          icon: "zap",
          color: "purple",
          bet_coins_reward: 100,
        },
        {
          name: "Verified Pro",
          description: "Verify 10 bet outcomes as a third party",
          icon: "trophy",
          color: "blue",
          bet_coins_reward: 75,
        },
        {
          name: "Social Butterfly",
          description: "Join 5 different betting groups",
          icon: "users",
          color: "pink",
          bet_coins_reward: 50,
        },
        {
          name: "Sharpshooter",
          description: "Win 10 bets total",
          icon: "target",
          color: "green",
          bet_coins_reward: 100,
        },
      ])

      if (error) {
        throw error
      }

      toast({
        title: "Achievements seeded successfully",
        description: "Initial achievement data has been added to the database.",
      })
    } catch (error: any) {
      console.error("Error seeding achievements:", error)
      toast({
        title: "Error seeding achievements",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={seedAchievements} disabled={loading}>
      {loading ? "Seeding..." : "Seed Achievements"}
    </Button>
  )
}
