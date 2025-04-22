"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { uploadImage } from "@/lib/supabase-storage"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  onImageRemoved?: () => void
  existingImageUrl?: string
  bucket: "profiles" | "bets" | "evidence"
  className?: string
  buttonText?: string
}

export function ImageUpload({
  onImageUploaded,
  onImageRemoved,
  existingImageUrl,
  bucket,
  className = "",
  buttonText = "Upload Image",
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(existingImageUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const url = await uploadImage(file, bucket)
      if (url) {
        setImageUrl(url)
        onImageUploaded(url)
      }
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setImageUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (onImageRemoved) {
      onImageRemoved()
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {imageUrl ? (
        <div className="relative">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
            <Image src={imageUrl || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover" />
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2 h-8 w-8 rounded-full"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove image</span>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border p-6">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">Drag and drop an image here</p>
            <p className="text-xs text-muted-foreground">PNG, JPG or GIF up to 10MB</p>
          </div>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              buttonText
            )}
          </Button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
      )}
    </div>
  )
}
