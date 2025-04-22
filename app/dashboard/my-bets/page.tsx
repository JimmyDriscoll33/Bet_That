"use client"

import { useEffect, useState } from "react"
import { BetCard } from "@/components/bet-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getUserBets } from "@/services/bet-service"
import { getUserProfile } from "@/services/user-service"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export default function MyBetsPage() {
  const { user } = useAuth()
  const [activeBets, setActiveBets] = useState<any[]>([])
  const [pendingBets, setPendingBets] = useState<any[]>([])
  const [completedBets, setCompletedBets] = useState<any[]>([])
  const [userProfiles, setUserProfiles] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    wins: 0,
    losses: 0,
    winRate: 0,
  })

  useEffect(() => {
    const loadData = async () => {
      if (!user) return

      setLoading(true)

      try {
        // Get user profile for balance
        const profileData = await getUserProfile(user.id)
        setProfile(profileData)

        // Get all bets
        const bets = await getUserBets(user.id)

        // Separate bets by status
        const active = bets.filter((bet) => bet.status === "active")
        const pending = bets.filter((bet) => bet.status === "pending")
        const completed = bets.filter((bet) => bet.status === "completed")

        setActiveBets(active)
        setPendingBets(pending)
        setCompletedBets(completed)

        // Calculate stats
        const wins = completed.filter((bet) => bet.winner_id === user.id).length
        const losses = completed.length - wins
        const winRate = completed.length > 0 ? Math.round((wins / completed.length) * 100) : 0

        setStats({
          wins,
          losses,
          winRate,
        })

        // Load user profiles for all users involved in bets
        const userIds = new Set<string>()
        bets.forEach((bet) => {
          userIds.add(bet.creator_id)
          userIds.add(bet.opponent_id)
          if (bet.verifier_id) userIds.add(bet.verifier_id)
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
        console.error("Error loading bets:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  const getUserName = (userId: string) => {
    if (userId === user?.id) return "You"
    const profile = userProfiles[userId]
    return profile ? profile.username : "Unknown"
  }

  // Calculate total balance
  const calculateTotalBalance = () => {
    let total = 0

    // Add current balance
    if (profile) {
      total += profile.balance || 0
    }

    // Add potential winnings from active bets
    activeBets.forEach((bet) => {
      if (bet.creator_id === user?.id || bet.opponent_id === user?.id) {
        total += Number.parseFloat(bet.amount)
      }
    })

    return total.toFixed(2)
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Bets</h1>
        <Badge variant="outline" className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          <span>{stats.winRate}% Win Rate</span>
        </Badge>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground">Total Balance</p>
          <p className="text-2xl font-bold">${calculateTotalBalance()}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Record</p>
          <p className="text-lg font-bold">
            {stats.wins}W - {stats.losses}L
          </p>
        </div>
      </div>

      <Tabs defaultValue="active" className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4 space-y-4">
          {loading ? (
            // Loading skeletons
            Array(2)
              .fill(0)
              .map((_, i) => <Skeleton key={i} className="h-32" />)
          ) : activeBets.length > 0 ? (
            activeBets.map((bet) => (
              <BetCard
                key={bet.id}
                id={bet.id}
                player1={getUserName(bet.creator_id)}
                player2={getUserName(bet.opponent_id)}
                title={bet.title}
                description={bet.description || ""}
                amount={bet.amount}
                type={bet.category || "Friendly Wager"}
                betCoins={bet.bet_coins}
                comments={[]} // We'll load these separately when viewing the bet
                evidence={[]} // We'll load these separately when viewing the bet
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No active bets.</p>
              <p className="text-sm text-muted-foreground mt-1">Create a bet to get started!</p>
              <Button className="mt-4" asChild>
                <Link href="/dashboard/create-bet">Create a Bet</Link>
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="pending" className="mt-4 space-y-4">
          {loading ? (
            // Loading skeletons
            Array(2)
              .fill(0)
              .map((_, i) => <Skeleton key={i} className="h-32" />)
          ) : pendingBets.length > 0 ? (
            pendingBets.map((bet) => (
              <BetCard
                key={bet.id}
                id={bet.id}
                player1={getUserName(bet.creator_id)}
                player2={getUserName(bet.opponent_id)}
                title={bet.title}
                description={bet.description || ""}
                amount={bet.amount}
                type={bet.category || "Friendly Wager"}
                betCoins={bet.bet_coins}
                comments={[]} // We'll load these separately when viewing the bet
                evidence={[]} // We'll load these separately when viewing the bet
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No pending bets.</p>
              <p className="text-sm text-muted-foreground mt-1">Bets waiting for acceptance will appear here.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="completed" className="mt-4 space-y-4">
          {loading ? (
            // Loading skeletons
            Array(2)
              .fill(0)
              .map((_, i) => <Skeleton key={i} className="h-32" />)
          ) : completedBets.length > 0 ? (
            completedBets.map((bet) => (
              <BetCard
                key={bet.id}
                id={bet.id}
                player1={getUserName(bet.creator_id)}
                player2={getUserName(bet.opponent_id)}
                title={bet.title}
                description={bet.description || ""}
                amount={bet.amount}
                type={bet.category || "Friendly Wager"}
                betCoins={bet.bet_coins}
                comments={[]} // We'll load these separately when viewing the bet
                evidence={[]} // We'll load these separately when viewing the bet
                verified={true}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No completed bets.</p>
              <p className="text-sm text-muted-foreground mt-1">Completed bets will appear here.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
