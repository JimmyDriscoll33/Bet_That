import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

type User = Database["public"]["Tables"]["users"]["Row"]
type FriendshipStatus = "pending" | "accepted" | "rejected"

export async function getUserProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data
}

export async function updateUserProfile(userId: string, updates: Partial<User>): Promise<boolean> {
  const { error } = await supabase.from("users").update(updates).eq("id", userId)

  if (error) {
    console.error("Error updating user profile:", error)
    return false
  }

  return true
}

export async function searchUsers(query: string): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .or(`username.ilike.%${query}%,full_name.ilike.%${query}%,email.ilike.%${query}%`)
    .limit(10)

  if (error) {
    console.error("Error searching users:", error)
    return []
  }

  return data || []
}

export async function getFriends(userId: string): Promise<User[]> {
  // Get all accepted friendships where the user is either the user or the friend
  const { data: friendships, error } = await supabase
    .from("friendships")
    .select("user_id, friend_id")
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
    .eq("status", "accepted")

  if (error) {
    console.error("Error fetching friendships:", error)
    return []
  }

  if (!friendships || friendships.length === 0) {
    return []
  }

  // Extract friend IDs
  const friendIds = friendships.map((friendship) =>
    friendship.user_id === userId ? friendship.friend_id : friendship.user_id,
  )

  // Fetch friend profiles
  const { data: friends, error: friendsError } = await supabase.from("users").select("*").in("id", friendIds)

  if (friendsError) {
    console.error("Error fetching friends:", friendsError)
    return []
  }

  return friends || []
}

export async function getFriendRequests(userId: string): Promise<User[]> {
  // Get all pending friendships where the user is the friend (they received the request)
  const { data: friendships, error } = await supabase
    .from("friendships")
    .select("user_id")
    .eq("friend_id", userId)
    .eq("status", "pending")

  if (error) {
    console.error("Error fetching friend requests:", error)
    return []
  }

  if (!friendships || friendships.length === 0) {
    return []
  }

  // Extract requester IDs
  const requesterIds = friendships.map((friendship) => friendship.user_id)

  // Fetch requester profiles
  const { data: requesters, error: requestersError } = await supabase.from("users").select("*").in("id", requesterIds)

  if (requestersError) {
    console.error("Error fetching requesters:", requestersError)
    return []
  }

  return requesters || []
}

export async function sendFriendRequest(userId: string, friendId: string): Promise<boolean> {
  // Check if a friendship already exists
  const { data: existingFriendship, error: checkError } = await supabase
    .from("friendships")
    .select("*")
    .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`)
    .single()

  if (checkError && checkError.code !== "PGRST116") {
    // PGRST116 is "no rows returned" which is what we want
    console.error("Error checking existing friendship:", checkError)
    return false
  }

  if (existingFriendship) {
    console.error("Friendship already exists")
    return false
  }

  // Create the friendship
  const { error } = await supabase.from("friendships").insert({
    user_id: userId,
    friend_id: friendId,
    status: "pending",
  })

  if (error) {
    console.error("Error sending friend request:", error)
    return false
  }

  return true
}

export async function respondToFriendRequest(
  userId: string,
  friendId: string,
  status: FriendshipStatus,
): Promise<boolean> {
  // Find the friendship
  const { data: friendship, error: findError } = await supabase
    .from("friendships")
    .select("*")
    .eq("user_id", friendId)
    .eq("friend_id", userId)
    .eq("status", "pending")
    .single()

  if (findError) {
    console.error("Error finding friend request:", findError)
    return false
  }

  if (!friendship) {
    console.error("Friend request not found")
    return false
  }

  // Update the friendship status
  const { error: updateError } = await supabase.from("friendships").update({ status }).eq("id", friendship.id)

  if (updateError) {
    console.error("Error responding to friend request:", updateError)
    return false
  }

  return true
}

export async function removeFriend(userId: string, friendId: string): Promise<boolean> {
  // Delete the friendship in both directions
  const { error } = await supabase
    .from("friendships")
    .delete()
    .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`)

  if (error) {
    console.error("Error removing friend:", error)
    return false
  }

  return true
}

export async function getUserStats(userId: string): Promise<{ total_bets: number; win_rate: number }> {
  const { data, error } = await supabase.from("users").select("win_rate").eq("id", userId).single()
  const { count, error: countError } = await supabase
    .from("bets")
    .select("*", { count: "exact", head: true })
    .or(`creator_id.eq.${userId},opponent_id.eq.${userId}`)

  if (error || countError) {
    console.error("Error fetching user stats:", error || countError)
    return { total_bets: 0, win_rate: 0 }
  }

  return {
    total_bets: count || 0,
    win_rate: data?.win_rate || 0,
  }
}
