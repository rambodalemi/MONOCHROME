"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type CartItem, type Product, type Currency, currencies, countryCurrencyMap, detectCountry } from "@/lib/types"

interface CartContextType {
  items: CartItem[]
  currency: Currency
  addItem: (product: Product, size?: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [currency, setCurrency] = useState<Currency>(currencies.USD)
  const [isOpen, setIsOpen] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    const savedCurrency = localStorage.getItem("currency")

    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }

    if (savedCurrency) {
      setCurrency(JSON.parse(savedCurrency))
    } else {
      // Detect country and set currency
      detectCountry().then((countryCode) => {
        const currencyCode = countryCurrencyMap[countryCode] || "USD"
        const detectedCurrency = currencies[currencyCode]
        setCurrency(detectedCurrency)
        localStorage.setItem("currency", JSON.stringify(detectedCurrency))
      })
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addItem = (product: Product, size?: string) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.product.id === product.id && item.size === size)

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === existingItem.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      const newItem: CartItem = {
        id: `${product.id}-${size || "no-size"}-${Date.now()}`,
        product,
        quantity: 1,
        size,
      }

      return [...currentItems, newItem]
    })
  }

  const removeItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems((currentItems) => currentItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      return total + item.product.price * item.quantity * currency.rate
    }, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        currency,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
