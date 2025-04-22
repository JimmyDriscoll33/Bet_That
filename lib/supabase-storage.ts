import { supabase } from "./supabase"

export async function initializeStorage() {
  try {
    // Create storage buckets if they don't exist
    const buckets = ["profiles", "bets", "evidence"]

    for (const bucket of buckets) {
      const { data: existingBucket } = await supabase.storage.getBucket(bucket)

      if (!existingBucket) {
        await supabase.storage.createBucket(bucket, {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        })
        console.log(`Created bucket: ${bucket}`)
      }
    }

    return true
  } catch (error) {
    console.error("Error initializing storage:", error)
    return false
  }
}

// Add the setupStorage function back to maintain backward compatibility
export function setupStorage() {
  if (typeof window !== "undefined") {
    // Only run on client side
    initializeStorage()
  }
}

export async function uploadImage(file: File, bucket: string): Promise<string | null> {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`

    const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) throw error

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)

    return data.publicUrl
  } catch (error) {
    console.error("Error uploading image:", error)
    return null
  }
}
