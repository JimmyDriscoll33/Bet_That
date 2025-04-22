"use client"

import { useState } from "react"
import { Heart, MessageSquare, ChevronDown, ChevronUp, Camera, Shield } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface BetCardProps {
  id?: string
  player1: string
  player2: string
  title: string
  description: string
  amount: number
  type?: string
  comments?: { user: string; text: string }[]
  evidence?: { user: string; text: string; image?: string }[]
  verified?: boolean
  className?: string
  betCoins?: boolean
}

export function BetCard({
  id,
  player1,
  player2,
  title,
  description,
  amount,
  type = "Friendly Wager",
  comments = [],
  evidence = [],
  verified = false,
  className,
  betCoins = false,
}: BetCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showEvidence, setShowEvidence] = useState(false)
  const [newComment, setNewComment] = useState("")

  const cardContent = (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex -space-x-2 mr-3">
            <Avatar className="h-10 w-10 border-2 border-white">
              <AvatarFallback className="bg-blue-500 text-white">{player1.charAt(0)}</AvatarFallback>
            </Avatar>
            <Avatar className="h-10 w-10 border-2 border-white">
              <AvatarFallback className="bg-purple-500 text-white">{player2.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div className="flex items-center">
              <h3 className="font-bold">{title}</h3>
              {verified && <Shield className="h-4 w-4 text-primary ml-1" />}
            </div>
            <p className="text-xs text-muted-foreground">{type}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold flex items-center">
            {betCoins ? (
              <>
                <svg className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M15 9.5L12 8L9 9.5V14.5L12 16L15 14.5V9.5Z" fill="white" />
                </svg>
                {amount}
              </>
            ) : (
              <>${amount}</>
            )}
          </div>
          <div className="text-xs text-muted-foreground">2 days ago</div>
        </div>
      </div>

      <p className="text-sm mt-2">{description}</p>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-3">
          <button className="flex items-center text-sm text-muted-foreground hover:text-primary">
            <Heart className="h-4 w-4 mr-1" />
            <span>12</span>
          </button>
          <button
            className="flex items-center text-sm text-muted-foreground hover:text-primary"
            onClick={(e) => {
              e.preventDefault()
              setExpanded(true)
              setShowComments(!showComments)
              if (showEvidence) setShowEvidence(false)
            }}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{comments.length}</span>
          </button>
          <button
            className="flex items-center text-sm text-muted-foreground hover:text-primary"
            onClick={(e) => {
              e.preventDefault()
              setExpanded(true)
              setShowEvidence(!showEvidence)
              if (showComments) setShowComments(false)
            }}
          >
            <Camera className="h-4 w-4 mr-1" />
            <span>{evidence.length}</span>
          </button>
        </div>
        <button
          className="text-sm text-muted-foreground hover:text-primary"
          onClick={(e) => {
            e.preventDefault()
            setExpanded(!expanded)
          }}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t">
          {showComments && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Comments</h4>
              {comments.map((comment, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{comment.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="bg-secondary p-2 rounded-lg text-sm flex-1">
                    <p className="font-medium text-xs">{comment.user}</p>
                    <p>{comment.text}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Add a comment..."
                  className="text-sm"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onClick={(e) => e.preventDefault()}
                />
                <Button size="sm" disabled={!newComment.trim()} onClick={(e) => e.preventDefault()}>
                  Post
                </Button>
              </div>
            </div>
          )}

          {showEvidence && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Evidence</h4>
              {evidence.map((item, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{item.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="bg-secondary p-2 rounded-lg text-sm flex-1">
                    <p className="font-medium text-xs">{item.user}</p>
                    <p>{item.text}</p>
                    {item.image && (
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt="Evidence"
                        className="mt-2 rounded-md w-full max-h-40 object-cover"
                      />
                    )}
                  </div>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" className="flex items-center" onClick={(e) => e.preventDefault()}>
                  <Camera className="h-4 w-4 mr-1" />
                  <span>Add Evidence</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )

  if (id) {
    return (
      <Link href={`/bets/${id}`} className={cn("bet-card mb-4 block", className)}>
        {cardContent}
      </Link>
    )
  }

  return <div className={cn("bet-card mb-4", className)}>{cardContent}</div>
}
