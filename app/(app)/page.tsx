"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronRight, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { useCart } from "@/contexts/cart-context"
import { CartSidebar } from "@/components/cart-sidebar"

// Sample products data
const sampleProducts = [
  {
    id: "1",
    name: "Minimal Tee",
    price: 49,
    image: "/banner.png",
    category: "tops",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "2",
    name: "Structured Blazer",
    price: 189,
    image: "/banner.png",
    category: "outerwear",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "3",
    name: "Relaxed Trousers",
    price: 120,
    image: "/banner.png",
    category: "bottoms",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "4",
    name: "Essential Shirt",
    price: 79,
    image: "/banner.png",
    category: "tops",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
]

export default function Home() {
  const { getTotalItems, setIsOpen, currency, addItem } = useCart()

  return (
      <div className='container relative mx-auto'>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold uppercase tracking-wider">MONOCHROME</span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              <Link href="#" className="text-sm font-medium transition-colors hover:text-foreground/80">
                NEW IN
              </Link>
              <Link href="#" className="text-sm font-medium transition-colors hover:text-foreground/80">
                WOMEN
              </Link>
              <Link href="#" className="text-sm font-medium transition-colors hover:text-foreground/80">
                MEN
              </Link>
              <Link href="#" className="text-sm font-medium transition-colors hover:text-foreground/80">
                ACCESSORIES
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="hidden md:block text-sm font-medium transition-colors hover:text-foreground/80">
              SEARCH
            </Link>
            <Link href="#" className="hidden md:block text-sm font-medium transition-colors hover:text-foreground/80">
              ACCOUNT
            </Link>
            <Button variant="outline" size="icon" className="border-0 relative" onClick={() => setIsOpen(true)}>
              <ShoppingBag className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-black text-white text-xs flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
              <span className="sr-only">Shopping cart</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full">
          <div className="relative">
            <Image
              src="/banner.png?height=800&width=1600"
              width={1600}
              height={800}
              alt="Hero image"
              className="aspect-[2/1] w-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="container text-center text-white space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">AUTUMN COLLECTION 2025</h1>
                <p className="text-lg md:text-xl max-w-2xl mx-auto">
                  Minimalist designs with maximum impact. Explore our latest collection.
                </p>
                <Button className="bg-white text-black hover:bg-white/90 hover:text-black rounded-none px-8">
                  SHOP NOW
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="container py-16 space-y-8">
          <div className="flex flex-col items-center text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">SHOP BY CATEGORY</h2>
            <p className="text-muted-foreground max-w-[700px]">
              Explore our curated collections designed for the modern minimalist.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["WOMEN", "MEN", "ACCESSORIES"].map((category) => (
              <Link href="#" key={category} className="group relative block">
                <Image
                  src="/banner.png?height=600&width=400"
                  width={400}
                  height={600}
                  alt={`${category} category`}
                  className="aspect-[2/3] w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="text-white text-center">
                    <h3 className="text-2xl font-bold tracking-tight">{category}</h3>
                    <div className="mt-4 flex items-center justify-center">
                      <span className="text-sm">SHOP NOW</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-muted py-16">
          <div className="container space-y-8">
            <div className="flex flex-col items-center text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">FEATURED PRODUCTS</h2>
              <p className="text-muted-foreground max-w-[700px]">
                Our most popular pieces, defined by clean lines and timeless design.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {sampleProducts.map((product) => (
                <div key={product.id} className="group">
                  <div className="space-y-3">
                    <div className="overflow-hidden bg-white relative">
                      <Image
                        src={product.image || "/banner.png"}
                        width={300}
                        height={400}
                        alt={product.name}
                        className="aspect-[3/4] w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Button
                        className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-none"
                        onClick={() => addItem(product, "M")}
                      >
                        ADD TO CART
                      </Button>
                    </div>
                    <div className="space-y-1 text-sm">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="font-medium">
                        {currency.symbol}
                        {(product.price * currency.rate).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Button variant="outline" className="rounded-none border-black">
                VIEW ALL PRODUCTS
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="container py-16 space-y-8">
          <div className="flex flex-col items-center text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">NEW ARRIVALS</h2>
            <p className="text-muted-foreground max-w-[700px]">
              The latest additions to our collection, fresh off the design board.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
              <Image
                src="/banner.png?height=600&width=500"
                width={500}
                height={600}
                alt="New arrival - BB-Torso display"
                className="aspect-[5/6] w-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-white p-4">
                <h3 className="font-medium">Structured Overshirt</h3>
                <p className="font-medium mt-1">$129</p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/banner.png?height=600&width=500"
                width={500}
                height={600}
                alt="New arrival - BB-Torso display"
                className="aspect-[5/6] w-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-white p-4">
                <h3 className="font-medium">Minimal Coat</h3>
                <p className="font-medium mt-1">$249</p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-black text-white py-16">
          <div className="container">
            <div className="max-w-md mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">JOIN OUR NEWSLETTER</h2>
              <p>Subscribe to receive updates, access to exclusive deals, and more.</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="rounded-none bg-transparent border-white focus-visible:ring-white"
                />
                <Button className="rounded-none bg-white text-black hover:bg-white/90">SUBSCRIBE</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">SHOP</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#">New Arrivals</Link>
                </li>
                <li>
                  <Link href="#">Women</Link>
                </li>
                <li>
                  <Link href="#">Men</Link>
                </li>
                <li>
                  <Link href="#">Accessories</Link>
                </li>
                <li>
                  <Link href="#">Sale</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">INFORMATION</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#">About Us</Link>
                </li>
                <li>
                  <Link href="#">Sustainability</Link>
                </li>
                <li>
                  <Link href="#">Stores</Link>
                </li>
                <li>
                  <Link href="#">Careers</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">CUSTOMER SERVICE</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#">Contact Us</Link>
                </li>
                <li>
                  <Link href="#">Shipping & Returns</Link>
                </li>
                <li>
                  <Link href="#">Size Guide</Link>
                </li>
                <li>
                  <Link href="#">FAQ</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">FOLLOW US</h3>
              <p className="text-sm">Stay connected with us on social media for exclusive content and updates.</p>
              <div className="flex gap-4">
                <Link href="#" className="text-sm">
                  Instagram
                </Link>
                <Link href="#" className="text-sm">
                  Pinterest
                </Link>
                <Link href="#" className="text-sm">
                  Twitter
                </Link>
              </div>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">© 2025 MONOCHROME. All rights reserved.</p>
            <div className="flex gap-4 text-xs">
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms of Service</Link>
              <Link href="#">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
      <CartSidebar />
    </div>
  )
}
