import { createServerClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { requestId, status } = await request.json()

    if (!requestId || !status || !["accepted", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Missing or invalid parameters" }, { status: 400 })
    }

    const supabase = createServerClient()

    if (status === "accepted") {
      // Update the friendship status to accepted
      const { error } = await supabase.from("friendships").update({ status: "accepted" }).eq("id", requestId)

      if (error) {
        console.error("Error accepting friend request:", error)
        return NextResponse.json({ error: "Failed to accept friend request" }, { status: 500 })
      }
    } else {
      // Delete the friendship record if rejected
      const { error } = await supabase.from("friendships").delete().eq("id", requestId)

      if (error) {
        console.error("Error rejecting friend request:", error)
        return NextResponse.json({ error: "Failed to reject friend request" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in respond to friend request API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
