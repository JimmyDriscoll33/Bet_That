import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

type Achievement = Database["public"]["Tables"]["achievements"]["Row"]
type UserAchievement = Database["public"]["Tables"]["user_achievements"]["Row"]

export async function getAchievements(): Promise<Achievement[]> {
  try {
    const { data, error } = await supabase.from("achievements").select("*").order("category").order("name")

    if (error) {
      console.error("Error fetching achievements:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error fetching achievements:", error)
    return []
  }
}

export async function getUserAchievements(userId: string): Promise<any[]> {
  try {
    // First get all achievements
    const { data: allAchievements, error: achievementsError } = await supabase
      .from("achievements")
      .select("*")
      .order("category")
      .order("name")

    if (achievementsError) {
      console.error("Error fetching achievements:", achievementsError)
      return []
    }

    // Then get user's progress on achievements
    const { data: userAchievements, error: userAchievementsError } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", userId)

    if (userAchievementsError) {
      console.error("Error fetching user achievements:", userAchievementsError)
      return []
    }

    // Combine the data
    const userAchievementsMap = new Map()
    userAchievements?.forEach((ua) => {
      userAchievementsMap.set(ua.achievement_id, ua)
    })

    // Return combined data with user progress
    return (
      allAchievements?.map((achievement) => {
        const userProgress = userAchievementsMap.get(achievement.id)
        return {
          ...achievement,
          user_progress: userProgress?.progress || 0,
          current_tier: userProgress?.current_tier || 0,
          completed: userProgress?.completed || false,
          completed_at: userProgress?.completed_at || null,
          next_threshold: getNextThreshold(achievement, userProgress?.current_tier || 0),
          next_reward: getNextReward(achievement, userProgress?.current_tier || 0),
          progress_percentage: calculateProgressPercentage(
            achievement,
            userProgress?.progress || 0,
            userProgress?.current_tier || 0,
          ),
        }
      }) || []
    )
  } catch (error) {
    console.error("Unexpected error fetching user achievements:", error)
    return []
  }
}

function getNextThreshold(achievement: Achievement, currentTier: number): number | null {
  if (currentTier >= achievement.max_tier) {
    return null
  }
  return achievement.tier_thresholds[currentTier]
}

function getNextReward(achievement: Achievement, currentTier: number): number | null {
  if (currentTier >= achievement.max_tier) {
    return null
  }
  return achievement.tier_rewards[currentTier]
}

function calculateProgressPercentage(achievement: Achievement, progress: number, currentTier: number): number {
  if (currentTier >= achievement.max_tier) {
    return 100
  }

  const nextThreshold = achievement.tier_thresholds[currentTier]
  const prevThreshold = currentTier > 0 ? achievement.tier_thresholds[currentTier - 1] : 0

  const tierProgress = progress - prevThreshold
  const tierTotal = nextThreshold - prevThreshold

  return Math.min(Math.floor((tierProgress / tierTotal) * 100), 100)
}

export async function updateAchievementProgress(
  userId: string,
  achievementId: string,
  progress: number,
): Promise<boolean> {
  try {
    // Get the achievement details
    const { data: achievement, error: achievementError } = await supabase
      .from("achievements")
      .select("*")
      .eq("id", achievementId)
      .single()

    if (achievementError) {
      console.error("Error fetching achievement details:", achievementError)
      return false
    }

    // Check if the user already has this achievement
    const { data: existingUserAchievement, error: checkError } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", userId)
      .eq("achievement_id", achievementId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "no rows returned"
      console.error("Error checking existing achievement:", checkError)
      return false
    }

    // Calculate the current tier based on progress
    let currentTier = 0
    let completed = false

    for (let i = 0; i < achievement.tier_thresholds.length; i++) {
      if (progress >= achievement.tier_thresholds[i]) {
        currentTier = i + 1
      }
    }

    completed = currentTier >= achievement.max_tier

    if (existingUserAchievement) {
      // Check if tier has increased
      const tierIncreased = currentTier > existingUserAchievement.current_tier

      // Update existing achievement
      const { error: updateError } = await supabase
        .from("user_achievements")
        .update({
          progress,
          current_tier: currentTier,
          completed,
          completed_at:
            completed && !existingUserAchievement.completed
              ? new Date().toISOString()
              : existingUserAchievement.completed_at,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingUserAchievement.id)

      if (updateError) {
        console.error("Error updating achievement progress:", updateError)
        return false
      }

      // If tier increased, award Bet-Coins for the new tier
      if (tierIncreased) {
        const tierReward = achievement.tier_rewards[existingUserAchievement.current_tier]
        if (tierReward > 0) {
          await awardBetCoins(userId, tierReward, `Achievement: ${achievement.name} - Tier ${currentTier}`)
        }
      }
    } else {
      // Create new achievement progress
      const { error: insertError } = await supabase.from("user_achievements").insert({
        user_id: userId,
        achievement_id: achievementId,
        current_tier: currentTier,
        progress,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      })

      if (insertError) {
        console.error("Error creating achievement progress:", insertError)
        return false
      }

      // If tier > 0 on creation, award Bet-Coins for the tier
      if (currentTier > 0) {
        // Award for each tier achieved
        for (let i = 0; i < currentTier; i++) {
          const tierReward = achievement.tier_rewards[i]
          if (tierReward > 0) {
            await awardBetCoins(userId, tierReward, `Achievement: ${achievement.name} - Tier ${i + 1}`)
          }
        }
      }
    }

    return true
  } catch (error) {
    console.error("Unexpected error updating achievement progress:", error)
    return false
  }
}

export async function awardBetCoins(userId: string, amount: number, description: string): Promise<boolean> {
  try {
    // Start a transaction
    const { error } = await supabase.rpc("award_bet_coins", {
      p_user_id: userId,
      p_amount: amount,
      p_description: description,
    })

    if (error) {
      console.error("Error awarding Bet-Coins:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Unexpected error awarding Bet-Coins:", error)
    return false
  }
}

export async function getUserBetCoins(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase.from("users").select("bet_coins").eq("id", userId).single()

    if (error) {
      console.error("Error fetching user Bet-Coins:", error)
      return 0
    }

    return data?.bet_coins || 0
  } catch (error) {
    console.error("Unexpected error fetching user Bet-Coins:", error)
    return 0
  }
}

export async function getBetCoinTransactions(userId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .not("bet_coins", "is", null)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching Bet-Coin transactions:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error fetching Bet-Coin transactions:", error)
    return []
  }
}
