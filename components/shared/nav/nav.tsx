"use client"

import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/cart-context'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { MobileNav } from './mobile-nav'
import { SearchDialog } from '@/components/search-dialog'
import { ModeToggle } from '@/components/toggle-mode'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

export default function Navbar() {
    const { getTotalItems, setIsOpen } = useCart()

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border flex justify-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <header className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-6 md:gap-10">
                    <MobileNav />
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-light tracking-[0.2em] text-foreground">MONOCHROME</span>
                    </Link>
                    <nav className="hidden gap-8 md:flex">
                        <Link
                            href="/products"
                            className="text-sm font-light tracking-wide transition-colors hover:text-muted-foreground"
                        >
                            NEW IN
                        </Link>
                        <Link
                            href="/products?category=women"
                            className="text-sm font-light tracking-wide transition-colors hover:text-muted-foreground"
                        >
                            WOMEN
                        </Link>
                        <Link
                            href="/products?category=men"
                            className="text-sm font-light tracking-wide transition-colors hover:text-muted-foreground"
                        >
                            MEN
                        </Link>
                        <Link
                            href="/products?category=accessories"
                            className="text-sm font-light tracking-wide transition-colors hover:text-muted-foreground"
                        >
                            ACCESSORIES
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:block">
                        <SearchDialog />
                    </div>
                    <SignedOut>
                        <SignInButton />
                        <SignUpButton />
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                        <Link href="/admin">Admin Dashboard</Link>
                    </SignedIn>
                    <Button variant="ghost" size="icon" className="relative" onClick={() => setIsOpen(true)}>
                        <ShoppingBag className="h-5 w-5 text-foreground" />
                        {getTotalItems() > 0 && (
                            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                                {getTotalItems()}
                            </span>
                        )}
                        <span className="sr-only">Shopping cart</span>
                    </Button>
                    <ModeToggle />
                </div>
            </header>
        </nav>
    )
}
