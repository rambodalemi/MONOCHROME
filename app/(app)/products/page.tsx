"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Grid, List, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import type { AdminProduct } from "@/lib/types"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const { currency, addItem } = useCart()

  const [products, setProducts] = useState<AdminProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<AdminProduct[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [loading, setLoading] = useState(true)

  const categories = ["all", "tops", "bottoms", "outerwear", "accessories"]

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products")
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    const category = searchParams.get("category")
    if (category) {
      setSelectedCategory(category)
    }
  }, [searchParams])

  useEffect(() => {
    let filtered = [...products]

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query),
      )
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.discounted_price - b.discounted_price
        case "price-high":
          return b.discounted_price - a.discounted_price
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
  }, [selectedCategory, searchQuery, sortBy, products])

  if (loading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[3/4] bg-muted animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-muted animate-pulse" />
                <div className="h-4 bg-muted animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-light tracking-wide mb-2 text-foreground">ALL PRODUCTS</h1>
            <p className="text-muted-foreground font-light">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
            </p>

          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 font-light"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="capitalize">
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid/List */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-lg font-light mb-2">No products found</h3>
          <p className="text-gray-600 font-light">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "space-y-6"
          }
        >
          {filteredProducts.map((product) => (
            <div key={product.id} className={viewMode === "grid" ? "group" : "flex gap-4 p-4 border"}>
              {viewMode === "grid" ? (
                <Link href={`/products/${product.slug}`} className="space-y-4">
                  <div className="aspect-[3/4] overflow-hidden bg-muted relative">
                    <div className="absolute inset-0 flex items-center p-4 justify-center">
                      <Image
                        src={product.images?.[0] || "/placeholder.svg"}
                        width={300}
                        height={400}
                        alt={product.name}
                        className="w-auto h-auto max-w-full max-h-full"
                      />
                    </div>
                    {!product.in_stock && <Badge className="absolute top-2 left-2">Out of Stock</Badge>}
                    {product.discount_percentage > 0 && (
                      <Badge className="absolute top-2 right-2 bg-black">-{product.discount_percentage}%</Badge>
                    )}
                    <Button
                      className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-black hover:bg-gray-100 font-light tracking-wide"
                      onClick={(e) => {
                        e.preventDefault()
                        const productForCart = {
                          id: product.id!,
                          name: product.name,
                          slug: product.slug,
                          price: product.discounted_price,
                          image: product.images?.[0] || "/placeholder.svg",
                          category: product.category,
                          inStock: product.in_stock,
                        }
                        addItem(productForCart, product.sizes?.[0])
                      }}
                      disabled={!product.in_stock}
                    >
                      {product.in_stock ? "ADD TO CART" : "OUT OF STOCK"}
                    </Button>
                  </div>
                  <div className="space-y-2 text-center">
                    <h3 className="font-light">{product.name}</h3>
                    <span className="text-sm text-muted-foreground capitalize">{product.category}</span>
                    <div className="flex items-center justify-center gap-2">
                      {product.discount_percentage > 0 ? (
                        <>
                          <span className="font-light">
                            {currency.symbol}
                            {(product.discounted_price * currency.rate).toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {currency.symbol}
                            {(product.price * currency.rate).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="font-light">
                          {currency.symbol}
                          {(product.discounted_price * currency.rate).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ) : (
                <>
                  <Link href={`/products/${product.slug}`} className="relative">
                    <Image
                      src={product.images?.[0] || "/placeholder.svg"}
                      width={120}
                      height={160}
                      alt={product.name}
                      className="aspect-[3/4] object-cover"
                    />
                    {!product.in_stock && <Badge className="absolute top-2 left-2">Out of Stock</Badge>}
                  </Link>
                  <div className="flex-1 space-y-2">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-light text-lg hover:text-muted-foreground transition-colors">{product.name}</h3>
                      <p className="text-muted-foreground capitalize">{product.category}</p>
                      <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                    </Link>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {product.discount_percentage > 0 ? (
                          <>
                            <span className="font-light text-lg">
                              {currency.symbol}
                              {(product.discounted_price * currency.rate).toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {currency.symbol}
                              {(product.price * currency.rate).toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="font-light text-lg">
                            {currency.symbol}
                            {(product.discounted_price * currency.rate).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <Button
                        onClick={() => {
                          const productForCart = {
                            id: product.id!,
                            name: product.name,
                            slug: product.slug,
                            price: product.discounted_price,
                            image: product.images?.[0] || "/placeholder.svg",
                            category: product.category,
                            inStock: product.in_stock,
                          }
                          addItem(productForCart, product.sizes?.[0])
                        }}
                        disabled={!product.in_stock}
                        className="font-light tracking-wide"
                      >
                        {product.in_stock ? "ADD TO CART" : "OUT OF STOCK"}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
