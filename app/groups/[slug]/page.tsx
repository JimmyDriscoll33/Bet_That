"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft, Send, Plus, Info, Home, Users } from "lucide-react"
import Link from "next/link"
import { BetCard } from "@/components/bet-card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Sample group members data
const groupMembers = [
  { id: 1, name: "John Doe", username: "johndoe", avatar: "JD", color: "bg-blue-500" },
  { id: 2, name: "Sarah Miller", username: "sarahmiller", avatar: "SM", color: "bg-purple-500" },
  { id: 3, name: "Mike Johnson", username: "mikej", avatar: "MJ", color: "bg-red-500" },
  { id: 4, name: "Alex Thompson", username: "alext", avatar: "AT", color: "bg-green-500" },
  { id: 5, name: "Emma Wilson", username: "emmaw", avatar: "EW", color: "bg-yellow-500" },
  { id: 6, name: "Chris Davis", username: "chrisd", avatar: "CD", color: "bg-indigo-500" },
  { id: 7, name: "Jessica Lee", username: "jessical", avatar: "JL", color: "bg-pink-500" },
  { id: 8, name: "Ryan Garcia", username: "ryang", avatar: "RG", color: "bg-orange-500" },
]

export default function GroupPage({ params }: { params: { slug: string } }) {
  const [message, setMessage] = useState("")
  const [selectedMember, setSelectedMember] = useState<null | (typeof groupMembers)[0]>(null)

  const groupName = params.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return (
    <div className="flex flex-col h-screen pb-0">
      <div className="p-4 border-b flex items-center sticky top-0 bg-background z-10">
        <Link href="/groups">
          <ArrowLeft className="h-6 w-6 mr-3" />
        </Link>
        <Avatar className="h-10 w-10 mr-3">
          <AvatarFallback className="bg-primary text-primary-foreground">{groupName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="font-bold">{groupName}</h1>
          <p className="text-xs text-muted-foreground">8 members</p>
        </div>
        <Link href="/dashboard" className="mr-2">
          <Home className="h-5 w-5" />
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Info className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Group Info</SheetTitle>
            </SheetHeader>
            <div className="py-6">
              <div className="flex items-center justify-center mb-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                    {groupName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h2 className="text-xl font-bold text-center mb-1">{groupName}</h2>
              <p className="text-sm text-muted-foreground text-center mb-6">Created on April 5, 2025</p>

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Members ({groupMembers.length})
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {groupMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center p-2 rounded-lg hover:bg-secondary cursor-pointer"
                      onClick={() => setSelectedMember(member)}
                    >
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback className={`text-xs text-white ${member.color}`}>
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">@{member.username}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full">
                  Share Group
                </Button>
                <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50">
                  Leave Group
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Member selection dialog */}
        <Dialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a bet with {selectedMember?.name}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center py-4">
              <Avatar className="h-16 w-16 mb-4">
                <AvatarFallback className={`text-lg text-white ${selectedMember?.color}`}>
                  {selectedMember?.avatar}
                </AvatarFallback>
              </Avatar>
              <p className="text-center mb-6">Start a private bet with {selectedMember?.name} from your group</p>
              <div className="flex gap-2 w-full">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedMember(null)}>
                  Cancel
                </Button>
                <Button className="flex-1">Create Bet</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <div className="px-4 pt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="bets">Bets</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="flex-1 flex flex-col p-4 overflow-y-auto">
          <div className="flex-1 space-y-4 mb-4">
            <div className="flex justify-center">
              <span className="text-xs bg-secondary px-2 py-1 rounded-full text-muted-foreground">Today</span>
            </div>

            <div className="flex items-start">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback className="bg-blue-500 text-white text-xs">JD</AvatarFallback>
              </Avatar>
              <div className="bg-secondary p-3 rounded-lg rounded-tl-none max-w-[80%]">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-sm">Who's in for our draft this weekend?</p>
              </div>
            </div>

            <div className="flex items-start">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback className="bg-purple-500 text-white text-xs">SM</AvatarFallback>
              </Avatar>
              <div className="bg-secondary p-3 rounded-lg rounded-tl-none max-w-[80%]">
                <p className="text-sm font-medium">Sarah Miller</p>
                <p className="text-sm">I'm in! What time are we thinking?</p>
              </div>
            </div>

            <div className="flex items-start justify-end">
              <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none max-w-[80%]">
                <p className="text-sm">I can do Saturday afternoon or evening</p>
              </div>
              <Avatar className="h-8 w-8 ml-2">
                <AvatarFallback className="bg-green-500 text-white text-xs">ME</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex items-start">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback className="bg-blue-500 text-white text-xs">JD</AvatarFallback>
              </Avatar>
              <div className="bg-secondary p-3 rounded-lg rounded-tl-none max-w-[80%]">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-sm">Let's do 6pm on Saturday. Anyone want to bet on who gets first pick?</p>
              </div>
            </div>

            <div className="flex items-start">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback className="bg-red-500 text-white text-xs">MJ</AvatarFallback>
              </Avatar>
              <div className="bg-secondary p-3 rounded-lg rounded-tl-none max-w-[80%]">
                <p className="text-sm font-medium">Mike Johnson</p>
                <p className="text-sm">I'll bet $20 I get a top 3 pick!</p>
              </div>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" size="sm" className="rounded-full flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Create Bet</span>
              </Button>
            </div>
          </div>

          <div className="sticky bottom-0 pt-2">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="rounded-full"
              />
              <Button size="icon" className="rounded-full" disabled={!message.trim()}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bets" className="flex-1 p-4 overflow-y-auto">
          <Tabs defaultValue="active">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="active">Active Bets</TabsTrigger>
              <TabsTrigger value="past">Past Bets</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              <BetCard
                player1="John"
                player2="Mike"
                title="Draft Position Bet"
                description="$20 on Mike getting a top 3 pick in the fantasy draft"
                amount={20}
                type="Fantasy Football"
                comments={[{ user: "Sarah", text: "The randomizer never lies!" }]}
                evidence={[]}
              />

              <BetCard
                player1="Sarah"
                player2="Alex"
                title="Season Champion"
                description="$50 on who wins the league this season"
                amount={50}
                type="Fantasy Football"
                comments={[{ user: "John", text: "Bold bet with the draft not even done yet" }]}
                evidence={[]}
              />

              <BetCard
                player1="Mike"
                player2="Chris"
                title="Weekly Matchup"
                description="$10 on Week 1 head-to-head matchup"
                amount={10}
                type="Fantasy Football"
                comments={[]}
                evidence={[]}
              />
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              <BetCard
                player1="John"
                player2="Sarah"
                title="Last Season Champion"
                description="$100 on who wins the league championship"
                amount={100}
                type="Fantasy Football"
                comments={[{ user: "Mike", text: "That was a close one!" }]}
                evidence={[
                  {
                    user: "John",
                    text: "Final standings screenshot",
                    image: "/placeholder.svg?height=300&width=400",
                  },
                ]}
                verified={true}
              />

              <BetCard
                player1="Alex"
                player2="Chris"
                title="Most Points"
                description="$25 on who scores the most total points in the season"
                amount={25}
                type="Fantasy Football"
                comments={[]}
                evidence={[
                  {
                    user: "Alex",
                    text: "Season point totals",
                    image: "/placeholder.svg?height=300&width=400",
                  },
                ]}
                verified={true}
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-center mt-6">
            <Button className="rounded-full flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Create New Bet</span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="members" className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-1 gap-3">
            {groupMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-xl border hover:border-primary transition-colors"
                onClick={() => setSelectedMember(member)}
              >
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback className={`text-white ${member.color}`}>{member.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-xs text-muted-foreground">@{member.username}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="rounded-full">
                  Create Bet
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
