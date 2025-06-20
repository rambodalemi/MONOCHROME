import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET() {
  try {
    // Test the connection
    const { data, error } = await supabaseAdmin.from("products").select("count", { count: "exact", head: true })

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: error,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Connection successful",
      productCount: data,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
