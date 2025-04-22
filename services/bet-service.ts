import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

type Bet = Database["public"]["Tables"]["bets"]["Row"]
type Comment = Database["public"]["Tables"]["comments"]["Row"]
type Evidence = Database["public"]["Tables"]["evidence"]["Row"]

export async function createBet(betData: Omit<Bet, "id" | "created_at" | "updated_at">): Promise<string | null> {
  const { data, error } = await supabase.from("bets").insert(betData).select("id").single()

  if (error) {
    console.error("Error creating bet:", error)
    return null
  }

  return data?.id || null
}

export async function getUserBets(userId: string, status?: string): Promise<Bet[]> {
  let query = supabase.from("bets").select("*").or(`creator_id.eq.${userId},opponent_id.eq.${userId}`)

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user bets:", error)
    return []
  }

  return data || []
}

export async function getBetDetails(betId: string): Promise<{
  bet: Bet | null
  comments: Comment[]
  evidence: Evidence[]
}> {
  // Fetch the bet
  const { data: bet, error: betError } = await supabase.from("bets").select("*").eq("id", betId).single()

  if (betError) {
    console.error("Error fetching bet details:", betError)
    return { bet: null, comments: [], evidence: [] }
  }

  // Fetch comments
  const { data: comments, error: commentsError } = await supabase
    .from("comments")
    .select("*")
    .eq("bet_id", betId)
    .order("created_at", { ascending: true })

  if (commentsError) {
    console.error("Error fetching bet comments:", commentsError)
    return { bet, comments: [], evidence: [] }
  }

  // Fetch evidence
  const { data: evidence, error: evidenceError } = await supabase
    .from("evidence")
    .select("*")
    .eq("bet_id", betId)
    .order("created_at", { ascending: true })

  if (evidenceError) {
    console.error("Error fetching bet evidence:", evidenceError)
    return { bet, comments: comments || [], evidence: [] }
  }

  return {
    bet,
    comments: comments || [],
    evidence: evidence || [],
  }
}

export async function addComment(betId: string, userId: string, text: string): Promise<boolean> {
  const { error } = await supabase.from("comments").insert({
    bet_id: betId,
    user_id: userId,
    text,
  })

  if (error) {
    console.error("Error adding comment:", error)
    return false
  }

  return true
}

export async function addEvidence(
  betId: string,
  userId: string,
  text: string | null,
  imageUrl: string | null,
): Promise<boolean> {
  const { error } = await supabase.from("evidence").insert({
    bet_id: betId,
    user_id: userId,
    text,
    image_url: imageUrl,
  })

  if (error) {
    console.error("Error adding evidence:", error)
    return false
  }

  return true
}

export async function resolveBet(betId: string, winnerId: string): Promise<boolean> {
  // Get the bet details first
  const { data: bet, error: betError } = await supabase.from("bets").select("*").eq("id", betId).single()

  if (betError) {
    console.error("Error fetching bet for resolution:", betError)
    return false
  }

  // Start a transaction
  const { error: updateError } = await supabase.rpc("resolve_bet", {
    p_bet_id: betId,
    p_winner_id: winnerId,
  })

  if (updateError) {
    console.error("Error resolving bet:", updateError)
    return false
  }

  return true
}

export async function getGroupBets(groupId: string): Promise<Bet[]> {
  const { data, error } = await supabase
    .from("bets")
    .select("*")
    .eq("group_id", groupId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching group bets:", error)
    return []
  }

  return data || []
}

export async function getFriendsBets(userId: string): Promise<Bet[]> {
  // First get the user's friends
  const { data: friendships, error: friendshipsError } = await supabase
    .from("friendships")
    .select("user_id, friend_id")
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
    .eq("status", "accepted")

  if (friendshipsError) {
    console.error("Error fetching friendships:", friendshipsError)
    return []
  }

  if (!friendships || friendships.length === 0) {
    return []
  }

  // Extract friend IDs
  const friendIds = friendships.map((friendship) =>
    friendship.user_id === userId ? friendship.friend_id : friendship.user_id,
  )

  // Get public bets where friends are involved
  const { data: bets, error: betsError } = await supabase
    .from("bets")
    .select("*")
    .or(`creator_id.in.(${friendIds.join(",")}),opponent_id.in.(${friendIds.join(",")})`)
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(20)

  if (betsError) {
    console.error("Error fetching friends bets:", betsError)
    return []
  }

  return bets || []
}
