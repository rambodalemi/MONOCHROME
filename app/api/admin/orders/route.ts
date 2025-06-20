import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getAllOrders } from "@/lib/supabase-admin"

export async function GET() {
  try {
    const userId = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orders = await getAllOrders()
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
