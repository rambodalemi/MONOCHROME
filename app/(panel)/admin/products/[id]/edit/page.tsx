"use client"

import { useEffect, useState } from "react"
import { ProductForm } from "@/components/forms/product-form"
import type { AdminProduct } from "@/lib/types"

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<AdminProduct | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch product")
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleSubmit = async (data: any) => {
    const response = await fetch(`/api/products/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to update product")
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (!product) {
    return <div className="p-6">Product not found</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      <ProductForm product={product} onSubmit={handleSubmit} />
    </div>
  )
}
