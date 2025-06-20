"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"
import type { AdminProduct } from "@/lib/types"
import { toast } from "sonner"

export default function ProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; product: AdminProduct | null }>({
    isOpen: false,
    product: null,
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (!response.ok) throw new Error("Failed to fetch products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Error", {
        description: "Failed to fetch products",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteModal.product) return

    try {
      const response = await fetch(`/api/products/${deleteModal.product.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete product")

      setProducts(products.filter((p) => p.id !== deleteModal.product!.id))
      toast.success("Success", {
        description: "Product deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Error", {
        description: "Failed to delete products",
      })
    } finally {
      setDeleteModal({ isOpen: false, product: null })
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="aspect-square bg-muted animate-pulse rounded-md mb-4" />
                <div className="h-6 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
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
              </div>
              <CardTitle className="text-lg text-foreground">{product.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{product.category}</Badge>
                {product.discount_percentage > 0 && (
                  <Badge variant="destructive">{product.discount_percentage}% OFF</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  {product.discount_percentage > 0 ? (
                    <div>
                      <span className="text-lg font-bold text-foreground">
                        ${product.discounted_price.toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-foreground">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
                <Badge variant={product.in_stock ? "default" : "secondary"}>
                  {product.in_stock ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button asChild size="sm" variant="outline" className="flex-1">
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setDeleteModal({ isOpen: true, product })}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first product.</p>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, product: null })}
        onConfirm={handleDelete}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteModal.product?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  )
}
