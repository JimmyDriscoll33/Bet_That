import { createServerClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId, friendId } = await request.json()

    if (!userId || !friendId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Check if a friendship already exists
    const { data: existingFriendship, error: checkError } = await supabase
      .from("friendships")
      .select("*")
      .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" which is what we want
      console.error("Error checking existing friendship:", checkError)
      return NextResponse.json({ error: "Failed to check existing friendship" }, { status: 500 })
    }

    if (existingFriendship) {
      return NextResponse.json({ error: "Friendship already exists" }, { status: 400 })
    }

    // Create the friendship
    const { error } = await supabase.from("friendships").insert({
      user_id: userId,
      friend_id: friendId,
      status: "pending",
    })

    if (error) {
      console.error("Error sending friend request:", error)
      return NextResponse.json({ error: "Failed to send friend request" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in friend request API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
