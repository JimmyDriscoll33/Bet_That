"use client"

import { useEffect, useState } from "react"
import { BetCard } from "@/components/bet-card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Filter, Search } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getFriendsBets } from "@/services/bet-service"
import { getUserProfile } from "@/services/user-service"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { user } = useAuth()
  const [friendsBets, setFriendsBets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userProfiles, setUserProfiles] = useState<Record<string, any>>({})

  useEffect(() => {
    const loadData = async () => {
      if (!user) return

      setLoading(true)

      try {
        const bets = await getFriendsBets(user.id)
        setFriendsBets(bets)

        // Load user profiles for all users involved in bets
        const userIds = new Set<string>()
        bets.forEach((bet) => {
          userIds.add(bet.creator_id)
          userIds.add(bet.opponent_id)
        })

        const profiles: Record<string, any> = {}
        for (const id of userIds) {
          const profile = await getUserProfile(id)
          if (profile) {
            profiles[id] = profile
          }
        }

        setUserProfiles(profiles)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  const getUserName = (userId: string) => {
    const profile = userProfiles[userId]
    return profile ? profile.username : "Unknown"
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="max-w-lg mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Bet That</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="friends" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="friends">Friends' Bets</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>
          <TabsContent value="friends" className="mt-4 space-y-4">
            {loading ? (
              // Loading skeletons
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="bet-card mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="flex -space-x-2 mr-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <Skeleton className="h-10 w-10 rounded-full" />
                        </div>
                        <div>
                          <Skeleton className="h-5 w-32 mb-1" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full mb-3" />
                    <Skeleton className="h-4 w-3/4 mb-3" />
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-4 w-10" />
                      <Skeleton className="h-4 w-10" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                  </div>
                ))
            ) : friendsBets.length > 0 ? (
              friendsBets.map((bet) => (
                <BetCard
                  key={bet.id}
                  player1={getUserName(bet.creator_id)}
                  player2={getUserName(bet.opponent_id)}
                  title={bet.title}
                  description={bet.description || ""}
                  amount={bet.amount}
                  type={bet.category || "Friendly Wager"}
                  betCoins={bet.bet_coins}
                  comments={[]} // We'll load these separately when viewing the bet
                  evidence={[]} // We'll load these separately when viewing the bet
                  verified={bet.status === "completed"}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No bets from friends yet.</p>
                <p className="text-sm text-muted-foreground mt-1">Add friends to see their bets here!</p>
                <Button className="mt-4" asChild>
                  <a href="/dashboard/friends">Find Friends</a>
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="trending" className="mt-4 space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Trending bets coming soon!</p>
              <p className="text-sm text-muted-foreground mt-1">Check back later for popular bets.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
