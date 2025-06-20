"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

const navigationLinks = [
  { href: "/products", label: "NEW IN" },
  { href: "/products?category=women", label: "WOMEN" },
  { href: "/products?category=men", label: "MEN" },
  { href: "/products?category=accessories", label: "ACCESSORIES" },
  { href: "/products", label: "ALL PRODUCTS" },
]

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] rounded-none">
        <SheetHeader>
          <SheetTitle className="text-left">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <span className="text-xl font-bold uppercase tracking-wider">MONOCHROME</span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          <nav className="space-y-4">
            {navigationLinks.map((link, index) => (
              <Link
                key={index + 1}
                href={link.href}
                className="block text-lg font-medium transition-colors hover:text-foreground/80"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Separator />
          <div className="space-y-4">
            <Link
              href="/account"
              className="block text-lg font-medium transition-colors hover:text-foreground/80"
              onClick={() => setIsOpen(false)}
            >
              ACCOUNT
            </Link>
            <Link
              href="/help"
              className="block text-lg font-medium transition-colors hover:text-foreground/80"
              onClick={() => setIsOpen(false)}
            >
              HELP
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
