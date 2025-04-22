"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getUserProfile, getUserStats, updateUserProfile } from "@/services/user-service"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletPopup } from "@/components/wallet-popup"
import { SettingsMenu } from "@/components/settings-menu"
import { MessagePopup } from "@/components/message-popup"
import { Skeleton } from "@/components/ui/skeleton"
import { Wallet, Coins, Camera } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AchievementsTab } from "@/components/achievements-tab"

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        // Load profile and stats in parallel
        const [userProfile, userStats] = await Promise.all([getUserProfile(user.id), getUserStats(user.id)])

        setProfile(userProfile || { username: "User", bet_coins: 0, balance: 0 })
        setStats(userStats || { total_bets: 0, win_rate: 0 })
      } catch (err) {
        console.error("Error loading profile:", err)
        setError("Failed to load profile data. Please try again.")
        // Set default values to prevent rendering issues
        setProfile({ username: "User", bet_coins: 0, balance: 0 })
        setStats({ total_bets: 0, win_rate: 0 })
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [user])

  const handleProfileImageUpdate = async (imageUrl: string) => {
    if (!user || !profile) return

    try {
      const success = await updateUserProfile(user.id, {
        avatar_url: imageUrl,
      })

      if (success) {
        setProfile({
          ...profile,
          avatar_url: imageUrl,
        })

        toast({
          title: "Profile updated",
          description: "Your profile picture has been updated successfully.",
        })
        setIsUploadDialogOpen(false)
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile picture",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p>Please log in to view your profile.</p>
        <Button className="mt-4" asChild>
          <Link href="/login">Log In</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <SettingsMenu />
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      ) : (
        <>
          {/* Balance Cards - New prominent section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-2">
                  <Wallet className="h-6 w-6 mr-2" />
                  <h2 className="text-xl font-bold">Wallet Balance</h2>
                </div>
                <p className="text-3xl font-bold">${profile?.balance || 0}</p>
                <p className="text-sm opacity-80 mt-2">Available for betting</p>
                <Button variant="secondary" className="mt-4 w-full" asChild>
                  <Link href="/wallet">Manage Wallet</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-2">
                  <Coins className="h-6 w-6 mr-2" />
                  <h2 className="text-xl font-bold">Bet Coins</h2>
                </div>
                <p className="text-3xl font-bold">{profile?.bet_coins || 0}</p>
                <p className="text-sm opacity-80 mt-2">Earn more by winning bets</p>
                <Button variant="secondary" className="mt-4 w-full">
                  Earn More Coins
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2 bg-muted">
                      <Image
                        src={
                          profile?.avatar_url ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || "/placeholder.svg"}`
                        }
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                        <DialogTrigger asChild>
                          <button
                            className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-600 rounded-full p-1.5 text-white shadow-md transition-colors"
                            type="button"
                          >
                            <Camera className="h-3.5 w-3.5" />
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle>Update Profile Picture</DialogTitle>
                          <ImageUpload
                            onImageUploaded={handleProfileImageUpdate}
                            defaultImage={profile?.avatar_url}
                            bucket="profiles"
                            folder={user.id}
                            size="lg"
                            buttonText="Update Profile Picture"
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold">{profile?.username || "User"}</h2>
                  <p className="text-muted-foreground">{profile?.full_name || ""}</p>
                  <p className="text-sm text-muted-foreground mt-1">{user?.email || ""}</p>

                  <div className="grid grid-cols-3 gap-4 w-full mt-6 text-center">
                    <div>
                      <p className="font-bold">{stats?.total_bets || 0}</p>
                      <p className="text-xs text-muted-foreground">Bets</p>
                    </div>
                    <div>
                      <p className="font-bold">{stats?.win_rate || 0}%</p>
                      <p className="text-xs text-muted-foreground">Win Rate</p>
                    </div>
                    <div>
                      <p className="font-bold">{profile?.bet_coins || 0}</p>
                      <p className="text-xs text-muted-foreground">Bet Coins</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6 w-full">
                    <WalletPopup />
                    <MessagePopup />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardContent className="p-0">
                <Tabs defaultValue="activity">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="achievements">Achievements</TabsTrigger>
                    <TabsTrigger value="friends">Friends</TabsTrigger>
                  </TabsList>
                  <TabsContent value="activity" className="p-4">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No recent activity</p>
                      <Button className="mt-4" asChild>
                        <Link href="/dashboard/create-bet">Create a Bet</Link>
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="achievements" className="p-4">
                    {user && <AchievementsTab userId={user.id} />}
                  </TabsContent>
                  <TabsContent value="friends" className="p-4">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No friends yet</p>
                      <Button className="mt-4" asChild>
                        <Link href="/dashboard/friends">Find Friends</Link>
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
