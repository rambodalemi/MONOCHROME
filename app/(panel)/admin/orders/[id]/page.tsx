"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Order } from "@/lib/supabase"
import { toast } from "sonner"

const orderStatuses = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
]

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const router = useRouter()

    useEffect(() => {
        async function fetchOrder() {
            try {
                const response = await fetch(`/api/admin/orders/${params}`)
                if (!response.ok) throw new Error("Failed to fetch order")
                const data = await response.json()
                setOrder(data)
            } catch (error) {
                console.error("Error fetching order:", error)
                toast.error("Error", {
                    description: "Failed to fetch order details",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchOrder()
    }, [params])

    const handleStatusUpdate = async (newStatus: string) => {
        if (!order) return

        setUpdating(true)
        try {
            const response = await fetch(`/api/admin/orders/${params}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            })

            if (!response.ok) throw new Error("Failed to update order")

            setOrder({ ...order, status: newStatus })
            toast.success("Success", {

                description: "Order status updated successfully",
            })
        } catch (error) {
            console.error("Error updating order:", error)
            toast.error("Error", {

                description: "Failed to update order status",

            })
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="p-6">
                <div className="space-y-6">
                    <div className="h-8 bg-muted animate-pulse rounded w-1/4" />
                    <Card>
                        <CardHeader>
                            <div className="h-6 bg-muted animate-pulse rounded w-1/3" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="h-4 bg-muted animate-pulse rounded" />
                            <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-foreground mb-2">Order not found</h3>
                    <Button onClick={() => router.back()}>Go Back</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Orders
                </Button>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-foreground">Order {order.order_number}</h1>
                    <div className="flex items-center gap-4">
                        <Badge
                            variant={order.status === "completed" || order.status === "delivered" ? "default" : "secondary"}
                        >
                            {order.status}
                        </Badge>
                        <Select value={order.status} onValueChange={handleStatusUpdate} disabled={updating}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {orderStatuses.map((status) => (
                                    <SelectItem key={status.value} value={status.value}>
                                        {status.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-medium">Contact</h4>
                                <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                                <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                            </div>
                            <div>
                                <h4 className="font-medium">Shipping Address</h4>
                                <div className="text-sm text-muted-foreground">
                                    <p>{order.customer_address.firstName} {order.customer_address.lastName}</p>
                                    <p>{order.customer_address.address}</p>
                                    <p>{order.customer_address.city}, {order.customer_address.postalCode}</p>
                                    <p>{order.customer_address.country}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-medium">Payment</h4>
                                <p className="text-sm text-muted-foreground">Payment Intent: {order.payment_intent_id}</p>
                                <p className="text-sm text-muted-foreground">Currency: {order.currency}</p>
                            </div>
                            <div>
                                <h4 className="font-medium">Order Date</h4>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(order.created_at!).toLocaleDateString()} at{" "}
                                    {new Date(order.created_at!).toLocaleTimeString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Order Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center py-2 border-b last:border-b-0"
                                >
                                    <div>
                                        <h4 className="font-medium text-foreground">{item.name}</h4>
                                        {item.size && (
                                            <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                                        )}
                                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                                    </div>
                                </div>
                            ))}
                            <div className="pt-4 border-t">
                                <div className="flex justify-between items-center text-lg font-bold text-foreground">
                                    <span>Total</span>
                                    <span>
                                        {order.currency} {order.subtotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}