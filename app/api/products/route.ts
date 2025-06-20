import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getAllProducts, createProduct } from "@/lib/supabase-admin"
import { generateSlug } from "@/lib/products"

export async function GET() {
  try {
    const products = await getAllProducts()
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error}, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId  = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, price, category, colors, sizes, images, discount_percentage } = body

    if (!name || !price || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const slug = generateSlug(name)
    const discounted_price = price - (price * (discount_percentage || 0)) / 100

    const product = await createProduct({
      name,
      slug,
      description: description || "",
      price: Number(price),
      category,
      colors: colors || [],
      sizes: sizes || [],
      images: images || [],
      discount_percentage: Number(discount_percentage || 0),
      discounted_price,
      in_stock: true,
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
