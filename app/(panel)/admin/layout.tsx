import type React from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const userId = auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-muted">
      <nav className="bg-background shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-xl font-bold text-foreground">
                Admin Panel
              </Link>
              <div className="flex space-x-4">
                <Link
                  href="/admin"
                  className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/products"
                  className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Products
                </Link>
                <Link
                  href="/admin/orders"
                  className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Orders
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                View Store
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
