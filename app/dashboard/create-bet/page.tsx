"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { createBet } from "@/services/bet-service"
import { getFriends } from "@/services/user-service"
import { getGroups } from "@/services/group-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "@/components/image-upload"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Camera, ChevronLeft, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CreateBetPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("10")
  const [betCoins, setBetCoins] = useState(false)
  const [opponentId, setOpponentId] = useState("")
  const [groupId, setGroupId] = useState("")
  const [isPublic, setIsPublic] = useState(true)

  // Advanced options
  const [category, setCategory] = useState("")
  const [thirdPartyVerification, setThirdPartyVerification] = useState(false)
  const [verifierId, setVerifierId] = useState("")
  const [odds, setOdds] = useState("even")
  const [endDate, setEndDate] = useState("")

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [showImageUpload, setShowImageUpload] = useState(false)

  const [friends, setFriends] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const loadData = async () => {
      setLoading(true)
      try {
        // Load friends and groups
        const friendsData = await getFriends(user.id)
        const groupsData = await getGroups(user.id)

        setFriends(friendsData)
        setGroups(groupsData)
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Error",
          description: "Failed to load friends and groups. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!title || !amount) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and amount for your bet.",
        variant: "destructive",
      })
      return
    }

    if (!opponentId && !groupId) {
      toast({
        title: "Missing Opponent",
        description: "Please select an opponent or group for your bet.",
        variant: "destructive",
      })
      return
    }

    if (thirdPartyVerification && !verifierId) {
      toast({
        title: "Missing Verifier",
        description: "Please select a verifier for third-party verification.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const betData = {
        title,
        description,
        amount: Number.parseFloat(amount),
        bet_coins: betCoins,
        category: category || null,
        creator_id: user.id,
        opponent_id: opponentId || null,
        group_id: groupId || null,
        status: "pending",
        is_public: isPublic,
        third_party_verification: thirdPartyVerification,
        verifier_id: thirdPartyVerification ? verifierId : null,
        image_url: imageUrl,
        odds: odds || "even",
        end_date: endDate ? new Date(endDate).toISOString() : null,
      }

      const betId = await createBet(betData)

      if (betId) {
        toast({
          title: "Bet Created",
          description: "Your bet has been created successfully.",
        })
        router.push(`/dashboard/my-bets`)
      } else {
        throw new Error("Failed to create bet")
      }
    } catch (error) {
      console.error("Error creating bet:", error)
      toast({
        title: "Error",
        description: "Failed to create bet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleImageUploaded = (url: string) => {
    setImageUrl(url)
    setShowImageUpload(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container max-w-3xl mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Link href="/dashboard" className="mr-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Create a Bet</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="overflow-hidden border-2 border-border">
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 p-6">
            <h2 className="text-xl font-semibold text-green-800 dark:text-green-300">Bet Details</h2>
            <p className="text-sm text-green-700 dark:text-green-400 mt-1">
              Set up the basic details for your friendly wager
            </p>
          </div>

          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-base">
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's the bet about?"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-base">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the details of your bet..."
                  className="mt-1.5"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount" className="text-base">
                    Amount
                  </Label>
                  <div className="relative mt-1.5">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      {betCoins ? (
                        <div className="h-5 w-5 text-yellow-500 flex items-center justify-center">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M15 9.5L12 8L9 9.5V14.5L12 16L15 14.5V9.5Z" fill="white" />
                          </svg>
                        </div>
                      ) : (
                        <span className="text-gray-500">$</span>
                      )}
                    </div>
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      step="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-base">Bet Type</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="betCoins" checked={betCoins} onCheckedChange={setBetCoins} />
                      <Label htmlFor="betCoins" className="cursor-pointer">
                        {betCoins ? "Bet Coins" : "Real Money"}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="opponent" className="text-base">
                    Opponent
                  </Label>
                  <Select value={opponentId} onValueChange={setOpponentId}>
                    <SelectTrigger id="opponent" className="mt-1.5">
                      <SelectValue placeholder="Select an opponent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Group Bet)</SelectItem>
                      {friends.map((friend) => (
                        <SelectItem key={friend.id} value={friend.id}>
                          {friend.full_name || friend.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="group" className="text-base">
                    Group (Optional)
                  </Label>
                  <Select value={groupId} onValueChange={setGroupId}>
                    <SelectTrigger id="group" className="mt-1.5">
                      <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Group</SelectItem>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base">Visibility</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Switch id="isPublic" checked={isPublic} onCheckedChange={setIsPublic} />
                    <Label htmlFor="isPublic" className="cursor-pointer">
                      {isPublic ? "Public" : "Private"}
                    </Label>
                  </div>
                </div>

                <div>
                  <Label className="text-base">Bet Image (Optional)</Label>
                  {imageUrl ? (
                    <div className="relative mt-1.5 h-32 rounded-md overflow-hidden">
                      <Image src={imageUrl || "/placeholder.svg"} alt="Bet image" fill className="object-cover" />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm"
                        onClick={() => setShowImageUpload(true)}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mt-1.5 border-dashed flex items-center justify-center h-32"
                      onClick={() => setShowImageUpload(true)}
                    >
                      <Camera className="h-5 w-5 mr-2" />
                      <span>Add Image</span>
                    </Button>
                  )}

                  {showImageUpload && (
                    <div className="mt-2">
                      <ImageUpload
                        bucket="bets"
                        folder={user?.id || "anonymous"}
                        onImageUploaded={handleImageUploaded}
                        onCancel={() => setShowImageUpload(false)}
                        buttonText="Upload Image"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="advanced" className="border-2 border-border rounded-lg">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center">
                <span className="text-lg font-semibold">Advanced Options</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category" className="text-base">
                    Category
                  </Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Sports, Games, Fitness"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="endDate" className="text-base">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="odds" className="text-base">
                    Odds
                  </Label>
                  <Select value={odds} onValueChange={setOdds}>
                    <SelectTrigger id="odds" className="mt-1.5">
                      <SelectValue placeholder="Select odds" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="even">Even (1:1)</SelectItem>
                      <SelectItem value="2-1">2:1</SelectItem>
                      <SelectItem value="3-1">3:1</SelectItem>
                      <SelectItem value="5-1">5:1</SelectItem>
                      <SelectItem value="10-1">10:1</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="thirdParty" className="text-base cursor-pointer">
                      Third-Party Verification
                    </Label>
                    <Switch
                      id="thirdParty"
                      checked={thirdPartyVerification}
                      onCheckedChange={setThirdPartyVerification}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Have a neutral third party verify the outcome of this bet
                  </p>
                </div>

                {thirdPartyVerification && (
                  <div>
                    <Label htmlFor="verifier" className="text-base">
                      Verifier
                    </Label>
                    <Select value={verifierId} onValueChange={setVerifierId}>
                      <SelectTrigger id="verifier" className="mt-1.5">
                        <SelectValue placeholder="Select a verifier" />
                      </SelectTrigger>
                      <SelectContent>
                        {friends
                          .filter((friend) => friend.id !== opponentId)
                          .map((friend) => (
                            <SelectItem key={friend.id} value={friend.id}>
                              {friend.full_name || friend.username}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex justify-end">
          <Button type="submit" className="w-full md:w-auto px-8" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Bet"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
