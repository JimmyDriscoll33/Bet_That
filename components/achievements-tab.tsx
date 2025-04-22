"use client"

import { useState, useEffect } from "react"
import { getUserAchievements } from "@/services/achievement-service"
import { AchievementCard } from "@/components/achievement-card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AchievementsTabProps {
  userId: string
}

export function AchievementsTab({ userId }: AchievementsTabProps) {
  const [achievements, setAchievements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")

  useEffect(() => {
    const loadAchievements = async () => {
      setLoading(true)
      try {
        const data = await getUserAchievements(userId)
        setAchievements(data)
      } catch (error) {
        console.error("Error loading achievements:", error)
        setError("Failed to load achievements. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadAchievements()
  }, [userId])

  // Get unique categories
  const categories = ["all", ...new Set(achievements.map((a) => a.category))]

  // Filter achievements by category
  const filteredAchievements =
    activeCategory === "all" ? achievements : achievements.filter((a) => a.category === activeCategory)

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  if (achievements.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No achievements available yet</p>
        <Button className="mt-4" asChild>
          <Link href="/dashboard/create-bet">Create a Bet to Earn Achievements</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" onValueChange={setActiveCategory}>
        <TabsList className="w-full overflow-x-auto flex-nowrap">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  )
}
