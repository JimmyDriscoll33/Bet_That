"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Search, Home, QrCode, Users } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

export default function GroupsPage() {
  const [joinCode, setJoinCode] = useState("")

  return (
    <div className="max-w-lg mx-auto p-4 pb-24">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard">
          <Home className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold">Groups</h1>
        <Button size="sm" className="rounded-full flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>New Group</span>
        </Button>
      </div>

      <Tabs defaultValue="my-groups" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-groups">My Groups</TabsTrigger>
          <TabsTrigger value="join">Join Group</TabsTrigger>
        </TabsList>

        <TabsContent value="my-groups" className="mt-4">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search groups..." className="pl-9 rounded-full" />
          </div>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center justify-center py-8">
                <Users className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-medium mb-2">No Groups Yet</h2>
                <p className="text-muted-foreground text-center mb-4">Join a group or create your own to get started</p>
                <Button className="mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Create a Group
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="join" className="mt-4">
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-xl border text-center">
              <h3 className="text-lg font-bold mb-4">Join with Code</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Enter a group invite code to join an existing betting group
              </p>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Enter group code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="rounded-l-full"
                />
                <Button className="rounded-r-full" disabled={!joinCode.trim()}>
                  Join
                </Button>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border text-center">
              <h3 className="text-lg font-bold mb-4">Scan QR Code</h3>
              <p className="text-sm text-muted-foreground mb-4">Scan a QR code to quickly join a betting group</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="rounded-full">
                    <QrCode className="h-4 w-4 mr-2" />
                    Scan QR Code
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Scan QR Code</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col items-center justify-center p-4">
                    <div className="bg-gray-100 w-64 h-64 rounded-lg flex items-center justify-center mb-4">
                      <QrCode className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Point your camera at a group QR code to join
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
