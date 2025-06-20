"use client"

import type React from "react"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { createOrder } from "@/lib/supabase"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { items, currency, getTotalPrice, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  })

  const total = getTotalPrice()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      setError("Payment system not ready. Please try again.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Validate form data
      if (!formData.email || !formData.firstName || !formData.lastName) {
        throw new Error("Please fill in all required fields")
      }

      // Create payment intent
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(total * 100), // Convert to cents
          currency: currency.code.toLowerCase(),
          items: items,
          customerInfo: formData,
        }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Failed to create payment intent: ${errorData}`)
      }

      const { clientSecret } = await response.json()

      if (!clientSecret) {
        throw new Error("No client secret received from payment processor")
      }

      // Confirm payment
      const cardElement = elements.getElement(CardElement)

      if (!cardElement) {
        throw new Error("Card element not found")
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            address: {
              line1: formData.address,
              city: formData.city,
              postal_code: formData.postalCode,
              country: formData.country,
            },
          },
        },
      })

      if (stripeError) {
        setError(stripeError.message || "Payment failed")
        return
      }

      if (paymentIntent?.status === "succeeded") {
        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

        // Create order in Supabase
        const orderData = {
          order_number: orderNumber,
          customer_email: formData.email.trim(),
          customer_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          customer_address: {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            address: formData.address.trim(),
            city: formData.city.trim(),
            postalCode: formData.postalCode.trim(),
            country: formData.country.trim(),
          },
          items: items.map((item) => ({
            id: item.product.id,
            name: item.product.name,
            price: Number(item.product.price),
            quantity: Number(item.quantity),
            size: item.size || undefined,
          })),
          subtotal: Number(total.toFixed(2)),
          currency: currency.code,
          payment_intent_id: paymentIntent.id,
          status: "completed",
        }

        try {
          await createOrder(orderData)
          clearCart()
          router.push(`/checkout/success?order=${orderNumber}`)
        } catch (orderError) {
          // Even if order saving fails, the payment succeeded, so we should still redirect
          clearCart()
          router.push(`/checkout/success?order=${orderNumber}&warning=order-save-failed&payment=${paymentIntent.id}`)
        }
      } else {
        setError("Payment was not completed successfully")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during checkout")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to store
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Order Summary */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Order Summary</h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{item.product.name}</h4>
                  {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">
                  {currency.symbol}
                  {(item.product.price * item.quantity * currency.rate).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                {currency.symbol}
                {total.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>
                {currency.symbol}
                {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Checkout</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-medium">Contact Information</h3>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="rounded-none"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Shipping Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    required
                    className="rounded-none"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    required
                    className="rounded-none"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  required
                  className="rounded-none"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    className="rounded-none"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    required
                    className="rounded-none"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  required
                  className="rounded-none"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Payment Information</h3>
              <div className="p-4 border rounded-none">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {error && <div className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded">{error}</div>}

            <Button type="submit" className="w-full rounded-none" disabled={!stripe || isLoading}>
              {isLoading ? "Processing..." : `Pay ${currency.symbol}${total.toFixed(2)}`}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}
