"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { getBetDetails, addComment, addEvidence, resolveBet } from "@/services/bet-service"
import { getUserProfile } from "@/services/user-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "@/components/image-upload"
import { initializeStorage } from "@/lib/supabase-storage"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Loader2, MessageSquare, FileImage, Award, Calendar, DollarSign, Users } from "lucide-react"
import Image from "next/image"
import type { Database } from "@/types/supabase"

type Bet = Database["public"]["Tables"]["bets"]["Row"]
type Comment = Database["public"]["Tables"]["comments"]["Row"]
type Evidence = Database["public"]["Tables"]["evidence"]["Row"]
type User = Database["public"]["Tables"]["users"]["Row"]

export default function BetDetailsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [bet, setBet] = useState<Bet | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [evidence, setEvidence] = useState<Evidence[]>([])
  const [creator, setCreator] = useState<User | null>(null)
  const [opponent, setOpponent] = useState<User | null>(null)
  const [verifier, setVerifier] = useState<User | null>(null)
  const [winner, setWinner] = useState<User | null>(null)

  const [newComment, setNewComment] = useState("")
  const [newEvidence, setNewEvidence] = useState("")
  const [evidenceImage, setEvidenceImage] = useState<string | null>(null)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [submittingEvidence, setSubmittingEvidence] = useState(false)
  const [resolvingBet, setResolvingBet] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const loadBetDetails = async () => {
      setLoading(true)
      try {
        // Initialize storage buckets
        await initializeStorage()

        const { bet: betData, comments: commentsData, evidence: evidenceData } = await getBetDetails(id as string)

        if (!betData) {
          toast({
            title: "Error",
            description: "Bet not found.",
            variant: "destructive",
          })
          router.push("/dashboard/my-bets")
          return
        }

        setBet(betData)
        setComments(commentsData)
        setEvidence(evidenceData)

        // Load user profiles
        const creatorData = await getUserProfile(betData.creator_id)
        const opponentData = await getUserProfile(betData.opponent_id)

        setCreator(creatorData)
        setOpponent(opponentData)

        if (betData.third_party_verification && betData.verifier_id) {
          const verifierData = await getUserProfile(betData.verifier_id)
          setVerifier(verifierData)
        }

        if (betData.winner_id) {
          const winnerData = await getUserProfile(betData.winner_id)
          setWinner(winnerData)
        }
      } catch (error) {
        console.error("Error loading bet details:", error)
        toast({
          title: "Error",
          description: "Failed to load bet details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadBetDetails()
  }, [id, user, router, toast])

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !bet) return

    setSubmittingComment(true)
    try {
      const success = await addComment(bet.id, user.id, newComment)

      if (success) {
        // Refresh comments
        const { comments: updatedComments } = await getBetDetails(bet.id)
        setComments(updatedComments)
        setNewComment("")

        toast({
          title: "Comment Added",
          description: "Your comment has been added successfully.",
        })
      } else {
        throw new Error("Failed to add comment")
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !bet) return

    if (!newEvidence && !evidenceImage) {
      toast({
        title: "Error",
        description: "Please provide either text or an image as evidence.",
        variant: "destructive",
      })
      return
    }

    setSubmittingEvidence(true)
    try {
      const success = await addEvidence(bet.id, user.id, newEvidence || null, evidenceImage)

      if (success) {
        // Refresh evidence
        const { evidence: updatedEvidence } = await getBetDetails(bet.id)
        setEvidence(updatedEvidence)
        setNewEvidence("")
        setEvidenceImage(null)

        toast({
          title: "Evidence Added",
          description: "Your evidence has been added successfully.",
        })
      } else {
        throw new Error("Failed to add evidence")
      }
    } catch (error) {
      console.error("Error adding evidence:", error)
      toast({
        title: "Error",
        description: "Failed to add evidence. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmittingEvidence(false)
    }
  }

  const handleResolveBet = async (winnerId: string) => {
    if (!bet) return

    setResolvingBet(true)
    try {
      const success = await resolveBet(bet.id, winnerId)

      if (success) {
        // Refresh bet details
        const { bet: updatedBet } = await getBetDetails(bet.id)
        setBet(updatedBet)

        if (updatedBet?.winner_id) {
          const winnerData = await getUserProfile(updatedBet.winner_id)
          setWinner(winnerData)
        }

        toast({
          title: "Bet Resolved",
          description: "The bet has been resolved successfully.",
        })
      } else {
        throw new Error("Failed to resolve bet")
      }
    } catch (error) {
      console.error("Error resolving bet:", error)
      toast({
        title: "Error",
        description: "Failed to resolve bet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setResolvingBet(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading bet details...</span>
        </div>
      </div>
    )
  }

  if (!bet || !creator || !opponent) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Bet not found</h1>
          <p className="mt-2">The bet you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button className="mt-4" onClick={() => router.push("/dashboard/my-bets")}>
            Back to My Bets
          </Button>
        </div>
      </div>
    )
  }

  const canResolve =
    bet.status === "active" &&
    (user?.id === bet.creator_id || user?.id === bet.opponent_id || user?.id === bet.verifier_id)

  const isParticipant = user?.id === bet.creator_id || user?.id === bet.opponent_id || user?.id === bet.verifier_id

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{bet.title}</CardTitle>
              <CardDescription className="mt-2 flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Created on {new Date(bet.created_at).toLocaleDateString()}</span>
                {bet.end_date && (
                  <>
                    <span>•</span>
                    <span>Ends on {new Date(bet.end_date).toLocaleDateString()}</span>
                  </>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  bet.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : bet.status === "active"
                      ? "bg-green-100 text-green-800"
                      : bet.status === "completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
              </div>
              {bet.is_public && (
                <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Public</div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bet Image */}
          {bet.image_url && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
              <Image src={bet.image_url || "/placeholder.svg"} alt={bet.title} fill className="object-cover" />
            </div>
          )}

          {/* Bet Description */}
          <div>
            <h3 className="text-lg font-medium">Description</h3>
            <p className="mt-2">{bet.description || "No description provided."}</p>
          </div>

          {/* Bet Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Amount</span>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-1" />
                <span className="font-medium">
                  {bet.amount} {bet.bet_coins ? "Bet Coins" : "USD"}
                </span>
              </div>
            </div>

            {bet.category && (
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Category</span>
                <span className="font-medium">{bet.category}</span>
              </div>
            )}

            {bet.group_id && (
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Group</span>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-1" />
                  <span className="font-medium">Group Name</span>
                </div>
              </div>
            )}
          </div>

          {/* Participants */}
          <div>
            <h3 className="text-lg font-medium mb-4">Participants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={creator.avatar_url || undefined} alt={creator.username} />
                  <AvatarFallback>{creator.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{creator.full_name || creator.username}</p>
                  <p className="text-sm text-muted-foreground">Creator</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={opponent.avatar_url || undefined} alt={opponent.username} />
                  <AvatarFallback>{opponent.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{opponent.full_name || opponent.username}</p>
                  <p className="text-sm text-muted-foreground">Opponent</p>
                </div>
              </div>

              {verifier && (
                <div className="flex items-center space-x-4 md:col-span-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={verifier.avatar_url || undefined} alt={verifier.username} />
                    <AvatarFallback>{verifier.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{verifier.full_name || verifier.username}</p>
                    <p className="text-sm text-muted-foreground">Verifier</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Winner */}
          {bet.status === "completed" && winner && (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <Award className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="text-lg font-medium text-green-800">Winner</h3>
                  <div className="flex items-center mt-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={winner.avatar_url || undefined} alt={winner.username} />
                      <AvatarFallback>{winner.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <p className="ml-2 font-medium">{winner.full_name || winner.username}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Tabs for Comments and Evidence */}
          <Tabs defaultValue="comments">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="comments" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Comments ({comments.length})
              </TabsTrigger>
              <TabsTrigger value="evidence" className="flex items-center">
                <FileImage className="h-4 w-4 mr-2" />
                Evidence ({evidence.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comments" className="space-y-4 mt-4">
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>
                            {comment.user_id === creator.id
                              ? creator.username.slice(0, 2).toUpperCase()
                              : comment.user_id === opponent.id
                                ? opponent.username.slice(0, 2).toUpperCase()
                                : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {comment.user_id === creator.id
                            ? creator.full_name || creator.username
                            : comment.user_id === opponent.id
                              ? opponent.full_name || opponent.username
                              : "User"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p>{comment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">No comments yet.</p>
              )}

              {/* Add Comment Form */}
              {isParticipant && (
                <form onSubmit={handleAddComment} className="space-y-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    required
                  />
                  <Button type="submit" disabled={submittingComment || !newComment.trim()}>
                    {submittingComment ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post Comment"
                    )}
                  </Button>
                </form>
              )}
            </TabsContent>

            <TabsContent value="evidence" className="space-y-4 mt-4">
              {evidence.length > 0 ? (
                <div className="space-y-4">
                  {evidence.map((item) => (
                    <div key={item.id} className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>
                            {item.user_id === creator.id
                              ? creator.username.slice(0, 2).toUpperCase()
                              : item.user_id === opponent.id
                                ? opponent.username.slice(0, 2).toUpperCase()
                                : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {item.user_id === creator.id
                            ? creator.full_name || creator.username
                            : item.user_id === opponent.id
                              ? opponent.full_name || opponent.username
                              : "User"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleString()}
                        </span>
                      </div>
                      {item.text && <p className="mb-2">{item.text}</p>}
                      {item.image_url && (
                        <div className="mt-2">
                          <Image
                            src={item.image_url || "/placeholder.svg"}
                            alt="Evidence"
                            width={400}
                            height={300}
                            className="rounded-md object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">No evidence submitted yet.</p>
              )}

              {/* Add Evidence Form */}
              {isParticipant && (
                <form onSubmit={handleAddEvidence} className="space-y-4">
                  <Textarea
                    value={newEvidence}
                    onChange={(e) => setNewEvidence(e.target.value)}
                    placeholder="Describe your evidence..."
                  />

                  <ImageUpload
                    bucket="evidence"
                    onImageUploaded={setEvidenceImage}
                    onImageRemoved={() => setEvidenceImage(null)}
                    buttonText="Add Evidence Image"
                  />

                  <Button type="submit" disabled={submittingEvidence || (!newEvidence.trim() && !evidenceImage)}>
                    {submittingEvidence ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Evidence"
                    )}
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>

        {/* Resolve Bet */}
        {canResolve && (
          <CardFooter className="flex-col space-y-4">
            <Separator />
            <div className="w-full">
              <h3 className="text-lg font-medium mb-4">Resolve Bet</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={() => handleResolveBet(bet.creator_id)} disabled={resolvingBet} className="flex-1">
                  {creator.full_name || creator.username} Wins
                </Button>
                <Button onClick={() => handleResolveBet(bet.opponent_id)} disabled={resolvingBet} className="flex-1">
                  {opponent.full_name || opponent.username} Wins
                </Button>
              </div>
              {resolvingBet && (
                <div className="flex items-center justify-center mt-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Resolving bet...</span>
                </div>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
