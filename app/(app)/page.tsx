"use client"
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
    </div>
  )
}
