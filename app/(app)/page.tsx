"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CartSidebar } from "@/components/cart/cart-sidebar"
import Newsletter from "@/components/newsletter"
import Philosophy from "@/components/Philosophy"
import FeaturedProducts from "@/components/feutured-products"
import Hero from "@/components/hero"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Hero />
        <FeaturedProducts />
        <Philosophy />
        <Newsletter />
      </main>
      <CartSidebar />
    </div>
  )
}
