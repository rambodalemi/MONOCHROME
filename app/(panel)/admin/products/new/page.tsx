"use client"

import { ProductForm } from "@/components/forms/product-form"

export default function NewProductPage() {
  const handleSubmit = async (data: any) => {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to create product")
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  )
}
