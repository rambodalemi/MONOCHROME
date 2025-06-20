import { createClient } from "@supabase/supabase-js"
import type { AdminProduct } from "./types"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log("Environment check:", {
  supabaseUrl: supabaseUrl ? "Set" : "Missing",
  supabaseServiceKey: supabaseServiceKey ? "Set" : "Missing",
  nodeEnv: process.env.NODE_ENV,
})

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
}

if (!supabaseServiceKey) {
  console.error(
    "Available env vars:",
    Object.keys(process.env).filter((key) => key.includes("SUPABASE")),
  )
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable")
}

// Admin client with service role key for full access
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function getAllProducts(): Promise<AdminProduct[]> {
  const { data, error } = await supabaseAdmin.from("products").select("*").order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`)
  }

  return data || []
}

export async function getProductById(id: string): Promise<AdminProduct | null> {
  const { data, error } = await supabaseAdmin.from("products").select("*").eq("id", id).single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(`Failed to fetch product: ${error.message}`)
  }

  return data
}

export async function getProductBySlug(slug: string): Promise<AdminProduct | null> {
  const { data, error } = await supabaseAdmin.from("products").select("*").eq("slug", slug).single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(`Failed to fetch product: ${error.message}`)
  }

  return data
}

export async function createProduct(
  product: Omit<AdminProduct, "id" | "created_at" | "updated_at">,
): Promise<AdminProduct> {
  const { data, error } = await supabaseAdmin.from("products").insert([product]).select().single()

  if (error) {
    throw new Error(`Failed to create product: ${error.message}`)
  }

  return data
}

export async function updateProduct(id: string, product: Partial<AdminProduct>): Promise<AdminProduct> {
  const { data, error } = await supabaseAdmin.from("products").update(product).eq("id", id).select().single()

  if (error) {
    throw new Error(`Failed to update product: ${error.message}`)
  }

  return data
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id)

  if (error) {
    throw new Error(`Failed to delete product: ${error.message}`)
  }
}

export async function getAllOrders() {
  const { data, error } = await supabaseAdmin.from("orders").select("*").order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`)
  }

  return data || []
}
