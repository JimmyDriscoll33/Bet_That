"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, User, UserPlus, Check, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function FriendsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  const [loadingRequests, setLoadingRequests] = useState(true)
  const [addFriendDialogOpen, setAddFriendDialogOpen] = useState(false)

  // Load pending friend requests
  useEffect(() => {
    if (!user) return

    const loadPendingRequests = async () => {
      setLoadingRequests(true)
      try {
        const response = await fetch(`/api/friends/pending?userId=${user.id}`)
        const data = await response.json()

        if (response.ok) {
          setPendingRequests(data.requests || [])
        } else {
          console.error("Error loading pending requests:", data.error)
        }
      } catch (error) {
        console.error("Error loading pending requests:", error)
      } finally {
        setLoadingRequests(false)
      }
    }

    loadPendingRequests()
  }, [user])

  const handleSearch = async () => {
    if (!searchQuery.trim() || !user) return

    setIsSearching(true)
    setSearchResults([])

    try {
      const response = await fetch(`/api/users/search?query=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()

      if (response.ok) {
        // Filter out the current user from results
        const filteredResults = data.users.filter((u: any) => u.id !== user.id)
        setSearchResults(filteredResults)
      } else {
        toast({
          title: "Search failed",
          description: data.error || "Failed to search for users",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error searching users:", error)
      toast({
        title: "Search failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddFriend = async (friendId: string) => {
    if (!user) return

    try {
      const response = await fetch("/api/friends/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          friendId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Friend request sent",
          description: "Your friend request has been sent successfully",
        })

        // Update the search results to show the request was sent
        setSearchResults(
          searchResults.map((result) => (result.id === friendId ? { ...result, requestSent: true } : result)),
        )
      } else {
        toast({
          title: "Failed to send request",
          description: data.error || "Failed to send friend request",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending friend request:", error)
      toast({
        title: "Failed to send request",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleRespondToRequest = async (requestId: string, status: "accepted" | "rejected") => {
    if (!user) return

    try {
      const response = await fetch("/api/friends/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          status,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: status === "accepted" ? "Friend request accepted" : "Friend request rejected",
          description:
            status === "accepted" ? "You are now friends with this user" : "The friend request has been rejected",
        })

        // Remove the request from the list
        setPendingRequests(pendingRequests.filter((req) => req.id !== requestId))
      } else {
        toast({
          title: "Failed to respond to request",
          description: data.error || "Failed to respond to friend request",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error responding to friend request:", error)
      toast({
        title: "Failed to respond to request",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Find Friends</h1>
        <div className="flex gap-2">
          <Dialog open={addFriendDialogOpen} onOpenChange={setAddFriendDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> Add Friend
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a Friend</DialogTitle>
                <DialogDescription>Search for a user by username or full name</DialogDescription>
              </DialogHeader>
              <div className="flex gap-2 my-4">
                <Input
                  placeholder="Search by username"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch()
                    }
                  }}
                />
                <Button onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {isSearching ? (
                  <div className="text-center py-4">
                    <p>Searching...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-4">
                    {searchResults.map((user) => (
                      <div key={user.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                            <img
                              src={
                                user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
                              }
                              alt={user.username}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{user.username}</p>
                            <p className="text-sm text-muted-foreground">{user.full_name}</p>
                          </div>
                        </div>
                        {user.requestSent ? (
                          <Button size="sm" variant="outline" disabled>
                            Request Sent
                          </Button>
                        ) : (
                          <Button size="sm" onClick={() => handleAddFriend(user.id)}>
                            <UserPlus className="h-4 w-4 mr-2" /> Add
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No users found</p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Search for users by username</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <QrCode className="mr-2 h-4 w-4" /> My QR Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Your QR Code</DialogTitle>
                <DialogDescription>Let friends scan this code to add you</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="bg-white p-4 rounded-lg mb-4">
                  {/* This would be a real QR code in production */}
                  <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                    <QrCode className="h-24 w-24 text-gray-500" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Have your friend scan this code to send you a friend request
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="requests">
            Requests {pendingRequests.length > 0 && `(${pendingRequests.length})`}
          </TabsTrigger>
          <TabsTrigger value="scan">Scan QR</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-2 mb-6">
                <Input
                  placeholder="Search by username"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch()
                    }
                  }}
                />
                <Button onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>

              {isSearching ? (
                <div className="text-center py-8">
                  <p>Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((user) => (
                    <div key={user.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                          <img
                            src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-sm text-muted-foreground">{user.full_name}</p>
                        </div>
                      </div>
                      {user.requestSent ? (
                        <Button size="sm" variant="outline" disabled>
                          Request Sent
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => handleAddFriend(user.id)}>
                          <UserPlus className="h-4 w-4 mr-2" /> Add
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No users found</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Search for users by username</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="mt-4">
          <Card>
            <CardContent className="p-6">
              {loadingRequests ? (
                <div className="text-center py-8">
                  <p>Loading requests...</p>
                </div>
              ) : pendingRequests.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="font-medium mb-2">Friend Requests</h3>
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                          <img
                            src={
                              request.sender.avatar_url ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${request.sender.username || "/placeholder.svg"}`
                            }
                            alt={request.sender.username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{request.sender.username}</p>
                          <p className="text-sm text-muted-foreground">{request.sender.full_name}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-red-50 hover:bg-red-100 border-red-200"
                          onClick={() => handleRespondToRequest(request.id, "rejected")}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-green-50 hover:bg-green-100 border-green-200"
                          onClick={() => handleRespondToRequest(request.id, "accepted")}
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No pending friend requests</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scan" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-8">
                <User className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-medium mb-2">Scan a QR Code</h2>
                <p className="text-muted-foreground text-center mb-4">
                  Ask your friend to show their QR code, then scan it to add them
                </p>
                <Button>
                  <QrCode className="mr-2 h-4 w-4" /> Open Scanner
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
