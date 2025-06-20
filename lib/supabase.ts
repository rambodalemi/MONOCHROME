import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Order {
  id?: string
  order_number: string
  customer_email: string
  customer_name: string
  customer_address: {
    firstName: string
    lastName: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    size?: string
  }>
  subtotal: number
  currency: string
  payment_intent_id: string
  status: string
  created_at?: string
}

export async function createOrder(orderData: Omit<Order, "id" | "created_at">): Promise<Order | null> {
  try {
    // Validate required fields
    if (!orderData.order_number || !orderData.customer_email || !orderData.customer_name) {
      throw new Error("Missing required order fields")
    }

    // Ensure subtotal is a valid number
    const validatedOrderData = {
      ...orderData,
      subtotal: Number(orderData.subtotal.toFixed(2)),
    }

    const { data, error } = await supabase.from("orders").insert([validatedOrderData]).select().single()

    if (error) {
      throw new Error(`Database error: ${error.message || "Unknown database error"}`)
    }

    if (!data) {
      throw new Error("No data returned from database")
    }

    return data
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  try {
    if (!orderNumber) {
      throw new Error("Order number is required")
    }

    const { data, error } = await supabase.from("orders").select("*").eq("order_number", orderNumber).single()

    if (error) {
      console.error("Error fetching order:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching order:", error)
    return null
  }
}
