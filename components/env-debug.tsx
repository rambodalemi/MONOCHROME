"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function EnvDebug() {
  const [serverEnv, setServerEnv] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  const checkServerEnv = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug/env")
      const data = await response.json()
      setServerEnv(data)
    } catch (error) {
      console.error("Error checking server env:", error)
    } finally {
      setLoading(false)
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Environment Variables Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Client-side Variables:</h4>
          <div className="space-y-1 text-sm">
            <div>
              <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>{" "}
              <span className={supabaseUrl ? "text-green-600" : "text-red-600"}>
                {supabaseUrl ? "✅ Set" : "❌ Missing"}
              </span>
            </div>
            <div>
              <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>{" "}
              <span className={supabaseAnonKey ? "text-green-600" : "text-red-600"}>
                {supabaseAnonKey ? "✅ Set" : "❌ Missing"}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Server-side Variables:</h4>
          <Button variant="outline" size="sm" onClick={checkServerEnv} disabled={loading}>
            {loading ? "Checking..." : "Check Server Environment"}
          </Button>

          {serverEnv && (
            <div className="mt-3 p-3 bg-gray-50 rounded text-xs">
              <pre>{JSON.stringify(serverEnv, null, 2)}</pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
