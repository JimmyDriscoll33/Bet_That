"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

// Sample profile images (these are placeholder URLs - replace with actual images)
const profileImages = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
]

// Sample bet images
const betImages = [
  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop", // Sports
  "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&h=600&fit=crop", // Food challenge
  "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&h=600&fit=crop", // Fitness
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop", // Tech
  "https://images.unsplash.com/photo-1605870445919-838d190e8e1b?w=800&h=600&fit=crop", // Gaming
]

// Sample evidence images
const evidenceImages = [
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=600&fit=crop",
]

// Sample user data
const sampleUsers = [
  {
    username: "johndoe",
    email: "john@example.com",
    full_name: "John Doe",
    bet_coins: 1000,
    balance: 500,
    win_rate: 0.65,
  },
  {
    username: "janedoe",
    email: "jane@example.com",
    full_name: "Jane Doe",
    bet_coins: 1500,
    balance: 750,
    win_rate: 0.72,
  },
  {
    username: "mikesmith",
    email: "mike@example.com",
    full_name: "Mike Smith",
    bet_coins: 800,
    balance: 300,
    win_rate: 0.45,
  },
  {
    username: "sarahlee",
    email: "sarah@example.com",
    full_name: "Sarah Lee",
    bet_coins: 1200,
    balance: 600,
    win_rate: 0.58,
  },
  {
    username: "alexwong",
    email: "alex@example.com",
    full_name: "Alex Wong",
    bet_coins: 2000,
    balance: 1000,
    win_rate: 0.8,
  },
]

// Sample bet titles and descriptions
const sampleBets = [
  {
    title: "Marathon Challenge",
    description: "I bet I can run a marathon in under 4 hours",
    amount: 50,
    bet_coins: true,
    category: "Fitness",
    status: "pending",
    is_public: true,
    third_party_verification: false,
  },
  {
    title: "Weight Loss Challenge",
    description: "I bet I can lose 10 pounds in 30 days",
    amount: 100,
    bet_coins: false,
    category: "Health",
    status: "active",
    is_public: true,
    third_party_verification: true,
  },
  {
    title: "Gaming Tournament",
    description: "I bet I'll rank higher than you in the next Fortnite tournament",
    amount: 75,
    bet_coins: true,
    category: "Gaming",
    status: "active",
    is_public: true,
    third_party_verification: false,
  },
  {
    title: "Coding Challenge",
    description: "I bet I can solve this algorithm problem faster than you",
    amount: 200,
    bet_coins: false,
    category: "Technology",
    status: "completed",
    is_public: false,
    third_party_verification: false,
  },
  {
    title: "Hot Pepper Challenge",
    description: "I bet I can eat 3 ghost peppers without drinking water for 5 minutes",
    amount: 150,
    bet_coins: true,
    category: "Food",
    status: "pending",
    is_public: true,
    third_party_verification: true,
  },
]

// Sample evidence texts
const sampleEvidenceTexts = [
  "Here's proof that I completed the challenge!",
  "Check out this evidence - I definitely won the bet.",
  "This should settle our bet once and for all.",
  "As you can see from this image, I've completed the task.",
  "Visual proof of my victory in our friendly wager.",
]

export function SeedData() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState("")
  const { toast } = useToast()

  const uploadImageToStorage = async (url: string, bucket: string, fileName: string) => {
    try {
      // Fetch the image from the URL
      const response = await fetch(url)
      const blob = await response.blob()

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage.from(bucket).upload(fileName, blob, {
        contentType: blob.type,
        upsert: true,
      })

      if (error) throw error

      // Get the public URL
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName)

      return publicUrlData.publicUrl
    } catch (error) {
      console.error(`Error uploading image to ${bucket}:`, error)
      return null
    }
  }

  const seedDatabase = async () => {
    setLoading(true)
    setProgress("Starting seed process...")

    try {
      // Check if users already exist
      const { count: userCount, error: countError } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })

      if (countError) throw countError

      if (userCount && userCount > 5) {
        toast({
          title: "Database already has users",
          description: "The database already has more than 5 users. Skipping user creation.",
        })
        setProgress("Users already exist, skipping...")
      } else {
        // Create storage buckets if they don't exist
        setProgress("Creating storage buckets...")

        // Note: In a real implementation, you would check if buckets exist first
        // but for simplicity, we'll just try to create them
        await supabase.storage.createBucket("profiles", { public: true })
        await supabase.storage.createBucket("bets", { public: true })
        await supabase.storage.createBucket("evidence", { public: true })

        // Create users with profile images
        setProgress("Creating users with profile images...")
        const createdUserIds = []

        for (let i = 0; i < sampleUsers.length; i++) {
          const user = sampleUsers[i]

          // Upload profile image
          const fileName = `profile_${i}_${Date.now()}.jpg`
          const imageUrl = await uploadImageToStorage(profileImages[i], "profiles", fileName)

          // Insert user with profile image
          const { data: userData, error: userError } = await supabase
            .from("users")
            .insert({
              ...user,
              avatar_url: imageUrl,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select("id")
            .single()

          if (userError) throw userError

          createdUserIds.push(userData.id)
          setProgress(`Created user ${i + 1} of ${sampleUsers.length}...`)
        }

        // Create friendships between users
        setProgress("Creating friendships between users...")
        for (let i = 0; i < createdUserIds.length; i++) {
          for (let j = i + 1; j < createdUserIds.length; j++) {
            await supabase.from("friendships").insert({
              user_id: createdUserIds[i],
              friend_id: createdUserIds[j],
              status: "accepted",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
          }
        }

        // Create bets with images
        setProgress("Creating bets with images...")
        const createdBetIds = []

        for (let i = 0; i < sampleBets.length; i++) {
          const bet = sampleBets[i]

          // Upload bet image
          const fileName = `bet_${i}_${Date.now()}.jpg`
          const imageUrl = await uploadImageToStorage(betImages[i], "bets", fileName)

          // Randomly assign creator and opponent
          const creatorIndex = Math.floor(Math.random() * createdUserIds.length)
          let opponentIndex
          do {
            opponentIndex = Math.floor(Math.random() * createdUserIds.length)
          } while (opponentIndex === creatorIndex)

          // Insert bet with image
          const { data: betData, error: betError } = await supabase
            .from("bets")
            .insert({
              ...bet,
              creator_id: createdUserIds[creatorIndex],
              opponent_id: createdUserIds[opponentIndex],
              image_url: imageUrl,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            })
            .select("id")
            .single()

          if (betError) throw betError

          createdBetIds.push(betData.id)
          setProgress(`Created bet ${i + 1} of ${sampleBets.length}...`)
        }

        // Create evidence with images
        setProgress("Creating evidence with images...")

        for (let i = 0; i < createdBetIds.length; i++) {
          // Only add evidence to completed bets
          if (sampleBets[i].status === "completed") {
            // Upload evidence image
            const fileName = `evidence_${i}_${Date.now()}.jpg`
            const imageUrl = await uploadImageToStorage(evidenceImages[i], "evidence", fileName)

            // Insert evidence with image
            const { error: evidenceError } = await supabase.from("evidence").insert({
              bet_id: createdBetIds[i],
              user_id: createdUserIds[i % createdUserIds.length], // Cycle through users
              text: sampleEvidenceTexts[i],
              image_url: imageUrl,
              created_at: new Date().toISOString(),
            })

            if (evidenceError) throw evidenceError

            setProgress(`Created evidence ${i + 1} for completed bets...`)
          }
        }
      }

      toast({
        title: "Database seeded successfully",
        description: "Sample data with images has been added to the database.",
      })
    } catch (error: any) {
      console.error("Error seeding database:", error)
      toast({
        title: "Error seeding database",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setProgress("")
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={seedDatabase} disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Seeding Database...
          </>
        ) : (
          "Seed Database with Sample Data"
        )}
      </Button>
      {progress && <p className="text-sm text-muted-foreground">{progress}</p>}
    </div>
  )
}
