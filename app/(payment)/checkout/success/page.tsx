import { CheckCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function CheckoutSuccessPage() {
  return (
    <div className="container max-w-2xl py-16">
      <div className="text-center space-y-6">
        <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
        <h1 className="text-3xl font-bold">Order Confirmed!</h1>
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
