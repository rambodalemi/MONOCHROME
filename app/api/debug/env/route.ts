import { NextResponse } from "next/server"

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 })
  }

  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Missing",
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? "Set" : "Missing",
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "Set" : "Missing",
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "Set" : "Missing",
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? "Set" : "Missing",
  }

  // Show first few characters of keys for debugging
  const partialKeys = {
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10) + "...",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  }

  return NextResponse.json({
    envVars,
    partialKeys,
    allEnvKeys: Object.keys(process.env).filter(
      (key) => key.includes("SUPABASE") || key.includes("STRIPE") || key.includes("CLERK"),
    ),
  })
}
