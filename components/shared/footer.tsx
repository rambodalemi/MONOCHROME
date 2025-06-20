import Link from 'next/link'
import React from 'react'
import { Separator } from '../ui/separator'

export default function Footer() {  
    return (
        <footer className="border-t items-center flex justify-center">
            <div className="container py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="space-y-6">
                        <h3 className="text-lg font-light tracking-wide">SHOP</h3>
                        <ul className="space-y-3 text-sm font-light">
                            <li>
                                <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                                    New Arrivals
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=women" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Women
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=men" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Men
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/products?category=accessories"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Accessories
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-lg font-light tracking-wide">ABOUT</h3>
                        <ul className="space-y-3 text-sm font-light">
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Our Story
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Sustainability
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Press
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-lg font-light tracking-wide">SUPPORT</h3>
                        <ul className="space-y-3 text-sm font-light">
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Size Guide
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Shipping & Returns
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-lg font-light tracking-wide">CONNECT</h3>
                        <p className="text-sm font-light text-gray-600 leading-relaxed">
                            Follow us for style inspiration and behind-the-scenes content
                        </p>
                        <div className="flex gap-6">
                            <Link href="#" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">
                                Instagram
                            </Link>
                            <Link href="#" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">
                                Pinterest
                            </Link>
                            <Link href="#" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">
                                Twitter
                            </Link>
                        </div>
                    </div>
                </div>
                <Separator className="my-12" />
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs font-light text-muted-foreground">© 2025 MONOCHROME. All rights reserved.</p>
                    <div className="flex gap-6 text-xs font-light">
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
