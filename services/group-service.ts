import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"
import { nanoid } from "nanoid"

type Group = Database["public"]["Tables"]["groups"]["Row"]
type GroupMember = Database["public"]["Tables"]["group_members"]["Row"]
type Message = Database["public"]["Tables"]["messages"]["Row"]

export async function createGroup(name: string, description: string | null, createdBy: string): Promise<string | null> {
  // Generate a unique invite code
  const inviteCode = nanoid(8)

  const { data, error } = await supabase
    .from("groups")
    .insert({
      name,
      description,
      invite_code: inviteCode,
      created_by: createdBy,
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error creating group:", error)
    return null
  }

  // Add the creator as a member
  const { error: memberError } = await supabase.from("group_members").insert({
    group_id: data.id,
    user_id: createdBy,
  })

  if (memberError) {
    console.error("Error adding creator to group:", memberError)
    // We don't return null here because the group was created
  }

  return data?.id || null
}

export async function getUserGroups(userId: string): Promise<Group[]> {
  // Get all groups where the user is a member
  const { data: memberships, error: membershipError } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", userId)

  if (membershipError) {
    console.error("Error fetching user group memberships:", membershipError)
    return []
  }

  if (!memberships || memberships.length === 0) {
    return []
  }

  // Extract group IDs
  const groupIds = memberships.map((membership) => membership.group_id)

  // Fetch group details
  const { data: groups, error: groupsError } = await supabase.from("groups").select("*").in("id", groupIds)

  if (groupsError) {
    console.error("Error fetching groups:", groupsError)
    return []
  }

  return groups || []
}

export async function getGroupDetails(groupId: string): Promise<{
  group: Group | null
  members: any[]
}> {
  // Fetch the group
  const { data: group, error: groupError } = await supabase.from("groups").select("*").eq("id", groupId).single()

  if (groupError) {
    console.error("Error fetching group details:", groupError)
    return { group: null, members: [] }
  }

  // Fetch members with user details
  const { data: members, error: membersError } = await supabase
    .from("group_members")
    .select(`
      id,
      joined_at,
      users:user_id (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .eq("group_id", groupId)

  if (membersError) {
    console.error("Error fetching group members:", membersError)
    return { group, members: [] }
  }

  return {
    group,
    members: members || [],
  }
}

export async function joinGroupByCode(userId: string, inviteCode: string): Promise<boolean> {
  // Find the group by invite code
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select("id")
    .eq("invite_code", inviteCode)
    .single()

  if (groupError) {
    console.error("Error finding group by invite code:", groupError)
    return false
  }

  if (!group) {
    console.error("Group not found with invite code:", inviteCode)
    return false
  }

  // Check if user is already a member
  const { data: existingMembership, error: checkError } = await supabase
    .from("group_members")
    .select("id")
    .eq("group_id", group.id)
    .eq("user_id", userId)
    .single()

  if (!checkError && existingMembership) {
    console.error("User is already a member of this group")
    return false
  }

  // Add user to the group
  const { error: joinError } = await supabase.from("group_members").insert({
    group_id: group.id,
    user_id: userId,
  })

  if (joinError) {
    console.error("Error joining group:", joinError)
    return false
  }

  return true
}

export async function leaveGroup(userId: string, groupId: string): Promise<boolean> {
  const { error } = await supabase.from("group_members").delete().eq("group_id", groupId).eq("user_id", userId)

  if (error) {
    console.error("Error leaving group:", error)
    return false
  }

  return true
}

export async function getGroupMessages(groupId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from("messages")
    .select(`
      id,
      text,
      created_at,
      users:user_id (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .eq("group_id", groupId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching group messages:", error)
    return []
  }

  return data || []
}

export async function sendGroupMessage(groupId: string, userId: string, text: string): Promise<boolean> {
  const { error } = await supabase.from("messages").insert({
    group_id: groupId,
    user_id: userId,
    text,
  })

  if (error) {
    console.error("Error sending group message:", error)
    return false
  }

  return true
}

export async function getGroups(userId: string): Promise<Group[]> {
  // Get all groups where the user is a member
  const { data: memberships, error: membershipError } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", userId)

  if (membershipError) {
    console.error("Error fetching user group memberships:", membershipError)
    return []
  }

  if (!memberships || memberships.length === 0) {
    return []
  }

  // Extract group IDs
  const groupIds = memberships.map((membership) => membership.group_id)

  // Fetch group details
  const { data: groups, error: groupsError } = await supabase.from("groups").select("*").in("id", groupIds)

  if (groupsError) {
    console.error("Error fetching groups:", groupsError)
    return []
  }

  return groups || []
}
