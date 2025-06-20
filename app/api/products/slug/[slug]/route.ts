import { type NextRequest, NextResponse } from "next/server"
import { getProductBySlug } from "@/lib/supabase-admin"

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const product = await getProductBySlug((await params).slug)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
