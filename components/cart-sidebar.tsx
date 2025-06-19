"use client"

import { Minus, Plus, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCart } from "@/contexts/cart-context"

export function CartSidebar() {
  const { items, currency, removeItem, updateQuantity, getTotalPrice, isOpen, setIsOpen } = useCart()

  const total = getTotalPrice()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg rounded-none p-5">
        <SheetHeader className="px-1">
          <SheetTitle className="text-left">Shopping Cart ({items.length})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center space-y-1">
            <div className="text-center">
              <h3 className="text-lg font-medium">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground">Add some items to get started</p>
            </div>
            <Button onClick={() => setIsOpen(false)} className="mt-4 rounded-none">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-1 flex-col gap-5 overflow-hidden">
              <div className="flex-1 overflow-auto px-1">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-20 w-16 overflow-hidden bg-muted">
                        <Image
                          src={item.product.image || "/banner.png"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-sm font-medium">{item.product.name}</h4>
                            {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-none"
                            onClick={() => removeItem(item.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 rounded-none"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 rounded-none"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm font-medium">
                            {currency.symbol}
                            {(item.product.price * item.quantity * currency.rate).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 px-1">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>
                    {currency.symbol}
                    {total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>
                    {currency.symbol}
                    {total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Button asChild className="w-full rounded-none">
                  <Link href="/checkout">Checkout</Link>
                </Button>
                <Button variant="outline" className="w-full rounded-none" onClick={() => setIsOpen(false)}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
