"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MultiImageUpload } from "@/components/multi-image-upload"
import type { AdminProduct } from "@/lib/types"
import { toast } from "sonner"

interface ProductFormProps {
  product?: AdminProduct
  onSubmit: (data: any) => Promise<void>
}

const categories = ["tops", "bottoms", "outerwear", "accessories"]
const availableColors = ["Black", "White", "Gray", "Navy", "Beige", "Brown", "Red", "Blue", "Green"]
const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"]

export function ProductForm({ product, onSubmit }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    category: product?.category || "",
    colors: product?.colors || [],
    sizes: product?.sizes || [],
    images: product?.images || [],
    discount_percentage: product?.discount_percentage || 0,
    in_stock: product?.in_stock ?? true,
  })

  const discountedPrice = formData.price - (formData.price * formData.discount_percentage) / 100

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.images.length === 0) {
      toast.error("Error", {
        description: "Please add at least one product image",
      })
      return
    }

    setLoading(true)

    try {
      await onSubmit(formData)
      toast.success("Success", {
        description: `Product ${product ? "updated" : "created"} successfully`,
      })
      router.push("/admin/products")
    } catch (error) {
      console.error("Error saving product:", error)
      toast.error("Error", {
        description: `Failed to ${product ? "update" : "create"} product`,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleColorChange = (color: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      colors: checked ? [...prev.colors, color] : prev.colors.filter((c) => c !== color),
    }))
  }

  const handleSizeChange = (size: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      sizes: checked ? [...prev.sizes, size] : prev.sizes.filter((s) => s !== size),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={formData.discount_percentage}
                onChange={(e) => setFormData((prev) => ({ ...prev, discount_percentage: Number(e.target.value) }))}
              />
            </div>
          </div>

          {formData.discount_percentage > 0 && (
            <div className="p-3 bg-green-50 rounded-md">
              <p className="text-sm text-green-800">
                Discounted Price: <span className="font-bold">${discountedPrice.toFixed(2)}</span>
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
        </CardHeader>
        <CardContent>
          <MultiImageUpload
            value={formData.images}
            onChange={(images) => setFormData((prev) => ({ ...prev, images }))}
            label="Upload product images (up to 5)"
            maxImages={5}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {availableColors.map((color) => (
              <div key={color} className="flex items-center space-x-2">
                <Checkbox
                  id={`color-${color}`}
                  checked={formData.colors.includes(color)}
                  onCheckedChange={(checked) => handleColorChange(color, checked as boolean)}
                />
                <Label htmlFor={`color-${color}`}>{color}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sizes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-3">
            {availableSizes.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={`size-${size}`}
                  checked={formData.sizes.includes(size)}
                  onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
                />
                <Label htmlFor={`size-${size}`}>{size}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in_stock"
              checked={formData.in_stock}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, in_stock: checked as boolean }))}
            />
            <Label htmlFor="in_stock">In Stock</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
