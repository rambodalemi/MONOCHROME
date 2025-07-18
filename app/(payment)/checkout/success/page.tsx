"use client"

import { Suspense } from "react"
import { CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getOrderByNumber, type Order } from "@/lib/supabase"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

function CheckoutSuccessLoading() {
  return (
    <div className="container max-w-2xl py-16">
      <div className="text-center space-y-6">
        <div className="mx-auto h-16 w-16 bg-gray-200 animate-pulse rounded-full" />
        <div className="h-8 bg-gray-200 animate-pulse rounded w-1/2 mx-auto" />
        <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mx-auto" />
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<CheckoutSuccessLoading />}>
      <CheckoutSuccessContent />
    </Suspense>
  )
}

const CheckoutSuccessContentComponent = () => {
  const searchParams = useSearchParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const orderNumber = searchParams.get("order")
  const warning = searchParams.get("warning")
  const paymentId = searchParams.get("payment")

  useEffect(() => {
    if (orderNumber) {
      getOrderByNumber(orderNumber)
        .then(setOrder)
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [orderNumber])

  return (
    <div className="container max-w-2xl py-16">
      <div className="text-center space-y-6">
        <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
        <h1 className="text-3xl font-bold">Payment Successful!</h1>

        {warning === "order-save-failed" && (
          <Alert className="text-left">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your payment was processed successfully, but there was an issue saving your order details. Please contact
              support with payment ID: <strong>{paymentId}</strong>
            </AlertDescription>
          </Alert>
        )}

        {loading ? (
          <p>Loading order details...</p>
        ) : order ? (
          <div className="bg-muted p-6 rounded-none text-left">
            <h2 className="font-semibold mb-2">Order Details</h2>
            <p>
              <strong>Order Number:</strong> {order.order_number}
            </p>
            <p>
              <strong>Email:</strong> {order.customer_email}
            </p>
            <p>
              <strong>Total:</strong> {order.currency} {order.subtotal.toFixed(2)}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
          </div>
        ) : orderNumber ? (
          <div className="bg-muted p-6 rounded-none text-left">
            <h2 className="font-semibold mb-2">Order Confirmation</h2>
            <p>
              <strong>Order Number:</strong> {orderNumber}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Order details are being processed. You will receive an email confirmation shortly.
            </p>
          </div>
        ) : null}

        <p className="text-muted-foreground">
          Thank you for your purchase. You will receive an email confirmation shortly.
        </p>

        <div className="space-y-4">
          <p className="text-sm">Your order is being processed and will be shipped within 2-3 business days.</p>
          <Button asChild className="rounded-none">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

const CheckoutSuccessContent = CheckoutSuccessContentComponent
