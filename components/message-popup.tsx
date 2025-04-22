"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { MessageSquare, Send, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getFriends } from "@/services/user-service"

export function MessagePopup() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [friends, setFriends] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFriend, setSelectedFriend] = useState<any>(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const loadFriends = async () => {
      if (!user) return

      try {
        const userFriends = await getFriends(user.id)
        setFriends(userFriends)
      } catch (error) {
        console.error("Error loading friends:", error)
      } finally {
        setLoading(false)
      }
    }

    if (open) {
      loadFriends()
    }
  }, [user, open])

  const handleSendMessage = () => {
    if (!message.trim() || !selectedFriend) return

    // In a real app, you would send the message to the backend
    alert(`Message sent to ${selectedFriend.username}: ${message}`)
    setMessage("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 flex-1">
          <MessageSquare className="h-4 w-4" />
          <span>Messages</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Messages</DialogTitle>
          <DialogDescription>Chat with your friends</DialogDescription>
        </DialogHeader>

        <div className="flex h-[400px] flex-col">
          <div className="flex-1 overflow-auto border rounded-md p-2">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p>Loading friends...</p>
              </div>
            ) : friends.length > 0 ? (
              <div className="space-y-2">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-muted ${
                      selectedFriend?.id === friend.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedFriend(friend)}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
                      <img
                        src={friend.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
                        alt={friend.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{friend.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <User className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No friends yet</p>
                <Button className="mt-4" size="sm" asChild>
                  <a href="/dashboard/friends">Find Friends</a>
                </Button>
              </div>
            )}
          </div>

          {selectedFriend && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Chatting with {selectedFriend.username}</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage()
                    }
                  }}
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
