import { Button } from "@/components/ui/button"
import { ImageUpload } from "./image-upload"
import { X } from "lucide-react"
import Image from "next/image"

interface MultiImageUploadProps {
  value: string[]
  onChange: (value: string[]) => void
  label?: string
  maxImages?: number
}

export function MultiImageUpload({ value, onChange, label = "Product Images", maxImages = 5 }: MultiImageUploadProps) {

  const handleImageAdd = (imageUrl: string) => {
    if (value.length < maxImages) {
      onChange([...value, imageUrl])
    }
  }

  const handleImageRemove = (index: number) => {
    const newImages = value.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const handleImageReplace = (index: number, newImageUrl: string) => {
    const newImages = [...value]
    newImages[index] = newImageUrl
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="font-medium text-sm">{label}</div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Existing Images */}
        {value.map((imageUrl, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square relative overflow-hidden rounded-md border">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleImageRemove(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="mt-2">
              <ImageUpload
                value=""
                onChange={(newUrl) => handleImageReplace(index, newUrl)}
                label={`Replace Image ${index + 1}`}
              />
            </div>
          </div>
        ))}

        {/* Add New Image */}
        {value.length < maxImages && (
          <div className="aspect-square">
            <ImageUpload value="" onChange={handleImageAdd} label={`Add Image ${value.length + 1}`} />
          </div>
        )}
      </div>

      {value.length >= maxImages && <p className="text-sm text-muted-foreground">Maximum {maxImages} images allowed</p>}
    </div>
  )
}
