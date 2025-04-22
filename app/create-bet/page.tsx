"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Home } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/contexts/auth-context"
import { getFriends } from "@/services/user-service"
import { createBet } from "@/services/bet-service"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function CreateBetPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [betType, setBetType] = useState("custom")
  const [currencyType, setCurrencyType] = useState("money")
  const [friends, setFriends] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    category: "",
    opponent: "",
    endDate: "",
    thirdPartyVerification: false,
    verifier: "",
    isPublic: true,
    odds: "even",
  })

  useEffect(() => {
    const loadFriends = async () => {
      if (!user) return

      try {
        const friendsData = await getFriends(user.id)
        setFriends(friendsData)
      } catch (error) {
        console.error("Error loading friends:", error)
      }
    }

    loadFriends()
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  const handleSubmit = async () => {
    if (!user) return

    if (!formData.title || !formData.amount || !formData.opponent) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const amount = Number.parseFloat(formData.amount)
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount.")
      }

      const betData = {
        title: formData.title,
        description: formData.description,
        amount,
        bet_coins: currencyType === "betcoin",
        category: formData.category || null,
        creator_id: user.id,
        opponent_id: formData.opponent,
        status: "pending",
        third_party_verification: formData.thirdPartyVerification,
        verifier_id: formData.thirdPartyVerification ? formData.verifier : null,
        is_public: formData.isPublic,
        end_date: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      }

      const betId = await createBet(betData)

      if (betId) {
        toast({
          title: "Bet created successfully",
          description: "Your bet has been created and is waiting for acceptance.",
        })
        router.push("/my-bets")
      } else {
        throw new Error("Failed to create bet.")
      }
    } catch (error: any) {
      console.error("Error creating bet:", error)
      toast({
        title: "Error creating bet",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-4 pb-24">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold">Create a Bet</h1>
        <Link href="/dashboard">
          <Home className="h-6 w-6" />
        </Link>
      </div>

      <Tabs value={betType} onValueChange={setBetType} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="custom">Custom Bet</TabsTrigger>
          <TabsTrigger value="template">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="custom" className="mt-4 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="What's the bet about?"
                className="mt-1"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the terms of your bet..."
                className="mt-1"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label className="mb-2 block">Currency Type</Label>
              <RadioGroup
                defaultValue="money"
                className="flex gap-4"
                value={currencyType}
                onValueChange={setCurrencyType}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="money" id="money" />
                  <Label htmlFor="money" className="flex items-center">
                    <span className="mr-1">$</span>
                    <span>Money</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="betcoin" id="betcoin" />
                  <Label htmlFor="betcoin" className="flex items-center">
                    <svg className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M15 9.5L12 8L9 9.5V14.5L12 16L15 14.5V9.5Z" fill="white" />
                    </svg>
                    <span>Bet-Coins</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">{currencyType === "money" ? "Amount ($)" : "Bet-Coins"}</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  placeholder={currencyType === "money" ? "25" : "50"}
                  className="mt-1"
                  value={formData.amount}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger id="category" className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="games">Games</SelectItem>
                    <SelectItem value="fantasy">Fantasy Leagues</SelectItem>
                    <SelectItem value="personal">Personal Challenge</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="opponent">Opponent</Label>
              <Select value={formData.opponent} onValueChange={(value) => handleSelectChange("opponent", value)}>
                <SelectTrigger id="opponent" className="mt-1">
                  <SelectValue placeholder="Select a friend" />
                </SelectTrigger>
                <SelectContent>
                  {friends.length > 0 ? (
                    friends.map((friend) => (
                      <SelectItem key={friend.id} value={friend.id}>
                        {friend.full_name || friend.username}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      No friends available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="advanced">
                <AccordionTrigger className="text-sm font-medium">Advanced Options</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="third-party">Third-Party Verification</Label>
                        <p className="text-xs text-muted-foreground">
                          Elect a neutral third party to verify the outcome
                        </p>
                      </div>
                      <Switch
                        id="third-party"
                        checked={formData.thirdPartyVerification}
                        onCheckedChange={(checked) => handleSwitchChange("thirdPartyVerification", checked)}
                      />
                    </div>

                    {formData.thirdPartyVerification && (
                      <div>
                        <Label htmlFor="verifier">Verifier</Label>
                        <Select
                          value={formData.verifier}
                          onValueChange={(value) => handleSelectChange("verifier", value)}
                        >
                          <SelectTrigger id="verifier" className="mt-1">
                            <SelectValue placeholder="Select a mutual friend" />
                          </SelectTrigger>
                          <SelectContent>
                            {friends.length > 0 ? (
                              friends
                                .filter((friend) => friend.id !== formData.opponent)
                                .map((friend) => (
                                  <SelectItem key={friend.id} value={friend.id}>
                                    {friend.full_name || friend.username}
                                  </SelectItem>
                                ))
                            ) : (
                              <SelectItem value="" disabled>
                                No friends available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="public">Make Bet Public</Label>
                        <p className="text-xs text-muted-foreground">Allow friends to see and comment on this bet</p>
                      </div>
                      <Switch
                        id="public"
                        checked={formData.isPublic}
                        onCheckedChange={(checked) => handleSwitchChange("isPublic", checked)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        className="mt-1"
                        value={formData.endDate}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor="odds">Custom Odds</Label>
                      <Select value={formData.odds} onValueChange={(value) => handleSelectChange("odds", value)}>
                        <SelectTrigger id="odds" className="mt-1">
                          <SelectValue placeholder="Even (1:1)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="even">Even (1:1)</SelectItem>
                          <SelectItem value="2-1">2:1</SelectItem>
                          <SelectItem value="3-1">3:1</SelectItem>
                          <SelectItem value="custom">Custom...</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating Bet..." : "Create Bet"}
          </Button>
        </TabsContent>

        <TabsContent value="template" className="mt-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                </div>
                <h3 className="font-medium">Golf Match</h3>
                <p className="text-xs text-muted-foreground mt-1">Stroke play, match play, or skins game</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <h3 className="font-medium">Fantasy League</h3>
                <p className="text-xs text-muted-foreground mt-1">Season-long or weekly matchups</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="4" y="3" width="16" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <circle cx="15.5" cy="8.5" r="1.5" />
                    <circle cx="8.5" cy="15.5" r="1.5" />
                    <circle cx="15.5" cy="15.5" r="1.5" />
                  </svg>
                </div>
                <h3 className="font-medium">Poker Game</h3>
                <p className="text-xs text-muted-foreground mt-1">Tournament or cash game structure</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <h3 className="font-medium">Fitness Challenge</h3>
                <p className="text-xs text-muted-foreground mt-1">Weight loss, steps, or workout goals</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
