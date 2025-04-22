import { createServerClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
  }

  const supabase = createServerClient()

  // Get pending friend requests where the user is the recipient
  const { data, error } = await supabase
    .from("friendships")
    .select(`
      id,
      user_id,
      sender:user_id (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .eq("friend_id", userId)
    .eq("status", "pending")

  if (error) {
    console.error("Error fetching pending friend requests:", error)
    return NextResponse.json({ error: "Failed to fetch pending friend requests" }, { status: 500 })
  }

  return NextResponse.json({ requests: data || [] })
}
