"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useCart } from "@/contexts/cart-context"
import type { AdminProduct } from "@/lib/types"

export function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<AdminProduct[]>([])
  const [allProducts, setAllProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(false)
  const { currency } = useCart()

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        const response = await fetch("/api/products")
        if (response.ok) {
          const products = await response.json()
          setAllProducts(products)
          setResults(products.slice(0, 6))
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchProducts()
    }
  }, [isOpen])

  useEffect(() => {
    if (query.trim() === "") {
      setResults(allProducts.slice(0, 6))
    } else {
      const filtered = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.description?.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered.slice(0, 6))
    }
  }, [query, allProducts])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-sm font-light tracking-wide transition-colors hover:text-muted-foreground"
        >
          SEARCH
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-light tracking-wide">Search Products</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 font-light"
            />
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : results.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No products found</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex gap-3 p-3 rounded-md transition-colors hover:bg-muted"
                  >
                    <Image
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.name}
                      width={60}
                      height={80}
                      className="aspect-[3/4] object-cover rounded-md"
                    />
                    <div className="flex-1 space-y-1">
                      <h4 className="font-light text-sm text-foreground">{product.name}</h4>
                      <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
                      <p className="font-light text-sm text-primary">
                        {currency.symbol}
                        {(product.discounted_price * currency.rate).toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
