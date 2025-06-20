import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getProductById, updateProduct, deleteProduct } from "@/lib/supabase-admin"
import { generateSlug } from "@/lib/products"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const product = await getProductById((await params).id)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, price, category, colors, sizes, images, discount_percentage, in_stock } = body

    const updateData: any = {}

    if (name) {
      updateData.name = name
      updateData.slug = generateSlug(name)
    }
    if (description !== undefined) updateData.description = description
    if (price) updateData.price = Number(price)
    if (category) updateData.category = category
    if (colors) updateData.colors = colors
    if (sizes) updateData.sizes = sizes
    if (images) updateData.images = images
    if (discount_percentage !== undefined) updateData.discount_percentage = Number(discount_percentage)
    if (in_stock !== undefined) updateData.in_stock = in_stock

    const product = await updateProduct((await params).id, updateData)
    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await deleteProduct((await params).id)
    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
