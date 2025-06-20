"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Order } from "@/lib/supabase"
import { toast } from "sonner"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("/api/admin/orders")
        if (!response.ok) throw new Error("Failed to fetch orders")
        const data = await response.json()
        setOrders(data)
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast.error("Error", {
          description: "Failed to fetch orders",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-muted animate-pulse rounded w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-foreground">{order.order_number}</CardTitle>
                  <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div>
                    <Badge
                      variant={order.status === "completed" || order.status === "delivered" ? "default" : "secondary"}
                    >
                      {order.status}
                    </Badge>
                    <p className="text-lg font-bold mt-2 text-foreground">
                      {order.currency} {order.subtotal.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at!).toLocaleDateString()}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Items ({order.items.length}):</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {order.items.slice(0, 4).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm text-muted-foreground">
                      <span>
                        {item.name} {item.size && `(${item.size})`} x {item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <p className="text-sm text-muted-foreground">+{order.items.length - 4} more items</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground mb-2">No orders found</h3>
          <p className="text-muted-foreground">Orders will appear here once customers start purchasing.</p>
        </div>
      )}
    </div>
  )
}
