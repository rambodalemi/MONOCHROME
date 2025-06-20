export interface Product {
  id: string
  name: string
  slug: string
  price: number
  image: string
  images?: string[]
  category: string
  sizes?: string[]
  colors?: string[]
  description?: string
  inStock?: boolean
  discount_percentage?: number
  discounted_price?: number
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function calculateDiscountedPrice(price: number, discountPercentage: number): number {
  return price - (price * discountPercentage) / 100
}
