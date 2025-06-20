"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, ShoppingBag, Heart, Share2, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import type { AdminProduct } from "@/lib/types"
import { toast } from "sonner"


export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const { currency, addItem } = useCart()
  const [product, setProduct] = useState<AdminProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/slug/${params}`)
        if (!response.ok) throw new Error("Failed to fetch product")
        const data = await response.json()
        setProduct(data)
        if (data?.colors?.length) setSelectedColor(data.colors[0])
        if (data?.sizes?.length) setSelectedSize(data.sizes[0])
      } catch (error) {
        console.error("Error fetching product:", error)
        toast.error("Error", {
          description: "Failed to load product",

        })
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params])

  const handleAddToCart = () => {
    if (!product) return

    const productForCart = {
      id: product.id!,
      name: product.name,
      slug: product.slug,
      price: product.discounted_price,
      image: product.images?.[0] || "/placeholder.svg",
      category: product.category,
      inStock: product.in_stock,
    }

    for (let i = 0; i < quantity; i++) {
      addItem(productForCart, selectedSize)
    }

    toast.success("Added to cart", {
      description: `${quantity} ${product.name} added to your cart`,
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-muted animate-pulse rounded-lg" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-20 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
            <div className="h-6 bg-muted animate-pulse rounded w-1/3" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-light mb-4">Product not found</h1>
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen container mx-auto">
      <div className="container py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-8 font-light">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="">
            <div className="">
              <Image
                src={product.images?.[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                width={700}
                height={600}
                className="w-auto h-auto max-w-full max-h-full"
              />
              {product.discount_percentage > 0 && (
                <div className="absolute top-6 left-6 bg-black text-white px-3 py-1 text-sm font-light tracking-wide">
                  -{product.discount_percentage}%
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 overflow-hidden border-2 transition-colors ${selectedImage === index
                      ? "border-foreground"
                      : "border-muted hover:border-muted-foreground"
                      }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="font-light tracking-wide">
                  {product.category.toUpperCase()}
                </Badge>
                {!product.in_stock && (
                  <Badge variant="destructive" className="font-light">
                    OUT OF STOCK
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl font-light tracking-wide leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4">
                {product.discount_percentage > 0 ? (
                  <>
                    <span className="text-3xl font-light">
                      {currency.symbol}
                      {(product.discounted_price * currency.rate).toFixed(2)}
                    </span>
                    <span className="text-xl text-muted-foreground line-through">

                      {currency.symbol}
                      {(product.price * currency.rate).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-light">
                    {currency.symbol}
                    {(product.price * currency.rate).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {product.description && (
              <div className="space-y-3">
                <h3 className="text-lg font-light tracking-wide">Description</h3>
                <p className="text-foreground font-light leading-relaxed">{product.description}</p>

              </div>
            )}

            <Separator />

            <div className="space-y-6">
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-light tracking-wide">Color</h3>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger className="w-full font-light">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {product.colors.map((color) => (
                        <SelectItem key={color} value={color} className="font-light">
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-light tracking-wide">Size</h3>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger className="w-full font-light">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {product.sizes.map((size) => (
                        <SelectItem key={size} value={size} className="font-light">
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-lg font-light tracking-wide">Quantity</h3>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-light">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= 10}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="w-full h-12 font-light tracking-wider text-sm"
                size="lg"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                {product.in_stock ? "ADD TO CART" : "OUT OF STOCK"}
              </Button>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 font-light tracking-wide">
                  <Heart className="w-4 h-4 mr-2" />
                  WISHLIST
                </Button>
                <Button variant="outline" className="flex-1 font-light tracking-wide">
                  <Share2 className="w-4 h-4 mr-2" />
                  SHARE
                </Button>
              </div>
            </div>

            <Separator />
            <div className="space-y-4 text-sm font-light text-muted-foreground">
              <div className="flex justify-between">
                <span>Free shipping</span>
                <span>On orders over $100</span>
              </div>
              <div className="flex justify-between">
                <span>Returns</span>
                <span>30-day return policy</span>
              </div>
              <div className="flex justify-between">
                <span>Support</span>
                <span>24/7 customer service</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
