"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loading } from "@/components/loading"
import { X, ImageIcon } from "lucide-react"
import Image from "next/image"
import { UploadError } from "./upload-error"

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

export function ImageUpload({ value, onChange, label = "Product Image" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      setError(null)

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error uploading image")
      }

      onChange(data.imageUrl)
    } catch (err: any) {
      console.error("Upload error:", err)
      setError(err.message || "Error uploading image")
    } finally {
      setIsUploading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = () => {
    onChange("")
  }

  return (
    <div className="space-y-2">
      <div className="font-medium text-sm">{label}</div>

      {error && <UploadError message={error} />}

      {value ? (
        <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-md border">
          <Image src={value || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Card
          className={`relative flex aspect-square w-full max-w-[200px] cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed p-4 text-center transition-colors hover:bg-muted ${
            isUploading ? "pointer-events-none opacity-70" : ""
          }`}
          onClick={handleClick}
        >
          {isUploading ? (
            <Loading text="Uploading..." />
          ) : (
            <>
              <div className="flex flex-col items-center gap-1">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                <div className="text-xs font-medium">Click to upload</div>
                <div className="text-[10px] text-muted-foreground">PNG, JPG, WebP or GIF (max 5MB)</div>
              </div>
              <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileChange} />
            </>
          )}
        </Card>
      )}
    </div>
  )
}
