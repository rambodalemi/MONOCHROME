"use client"

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { useCart } from '@/contexts/cart-context'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { AdminProduct } from '@/lib/types'

export default function FeaturedProducts() {
    const { currency, addItem } = useCart()
    const [featuredProducts, setFeaturedProducts] = useState<AdminProduct[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch("/api/products")
                if (response.ok) {
                    const products = await response.json()
                    setFeaturedProducts(products.slice(0, 8))
                }
            } catch (error) {
                console.error("Error fetching products:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])
    return (
        <section className="py-24 flex justify-center">
            <div className="container space-y-16">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-light tracking-wide">Featured Collection</h2>
                    <p className="text-lg font-light text-muted-foreground max-w-2xl mx-auto">
                        Carefully selected pieces that define our aesthetic philosophy
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="space-y-4">
                                <div className="aspect-[3/4] bg-muted animate-pulse" />
                                <div className="space-y-2">
                                    <div className="h-4 bg-muted animate-pulse" />
                                    <div className="h-4 bg-muted animate-pulse w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {featuredProducts.map((product) => (
                            <Link key={product.id} href={`/products/${product.slug}`} className="group">
                                <div className="aspect-[3/4] overflow-hidden bg-muted relative">
                                    <div className="absolute inset-0 flex items-center p-4 justify-center">
                                        <Image
                                            src={product.images?.[0] || "/placeholder.svg"}
                                            width={300}
                                            height={400}
                                            alt={product.name}
                                            className="w-auto h-auto max-w-full max-h-full"
                                        />
                                        {product.discount_percentage > 0 && (
                                            <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-2 py-1 text-xs font-light tracking-wide">
                                                -{product.discount_percentage}%
                                            </div>
                                        )}
                                        <Button
                                            className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background text-foreground hover:bg-accent hover:text-accent-foreground font-light tracking-wide"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const productForCart = {
                                                    id: product.id!,
                                                    name: product.name,
                                                    slug: product.slug,
                                                    price: product.discounted_price,
                                                    image: product.images?.[0] || "/placeholder.svg",
                                                    category: product.category,
                                                    inStock: product.in_stock,
                                                };
                                                addItem(productForCart, product.sizes?.[0]);
                                            }}
                                        >
                                            ADD TO CART
                                        </Button>
                                    </div>
                                    <div className="space-y-2 text-center">
                                        <h3 className="font-light tracking-wide">{product.name}</h3>
                                        <div className="flex items-center justify-center gap-2">
                                            {product.discount_percentage > 0 ? (
                                                <>
                                                    <span className="font-light">
                                                        {currency.symbol}
                                                        {(product.discounted_price * currency.rate).toFixed(2)}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground line-through">
                                                        {currency.symbol}
                                                        {(product.price * currency.rate).toFixed(2)}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="font-light">
                                                    {currency.symbol}
                                                    {(product.price * currency.rate).toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="text-center">
                    <Button asChild variant="outline" className="font-light tracking-wider px-8">
                        <Link href="/products">
                            VIEW ALL PRODUCTS
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>

    )
}
