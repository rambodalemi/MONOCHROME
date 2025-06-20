"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    loading: true,
    error: null as string | null,
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch products from API
        const productsResponse = await fetch("/api/products")
        if (!productsResponse.ok) throw new Error("Failed to fetch products")
        const products = await productsResponse.json()

        // Fetch orders from API
        const ordersResponse = await fetch("/api/admin/orders")
        if (!ordersResponse.ok) throw new Error("Failed to fetch orders")
        const orders = await ordersResponse.json()

        const totalRevenue = orders.reduce((sum: number, order: any) => sum + Number(order.subtotal), 0)

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue,
          loading: false,
          error: null,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }))
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Uncomment the line below to enable environment debugging */}
      {/* <EnvDebug /> */}

      {stats.error && (
        <Card className="mb-6 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{stats.error}</p>
          </CardContent>
        </Card>
      )}

      {stats.loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
