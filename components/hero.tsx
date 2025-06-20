import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

export default function Hero() {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
                <Image
                    src="/banner.png"
                    width={1920}
                    height={1080}
                    alt="Hero background"
                    className="w-full h-full object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-background/60 backdrop-brightness-[.4]" />
            </div>
            <div className="relative z-10 text-center text-foreground max-w-4xl mx-auto px-4">
                <h1 className="text-5xl md:text-7xl font-light tracking-[0.1em] mb-6 leading-tight">
                    TIMELESS
                    <br />
                    ELEGANCE
                </h1>
                <p className="text-lg md:text-xl font-light tracking-wide mb-8 max-w-2xl mx-auto leading-relaxed text-muted-foreground">
                    Discover our curated collection of minimalist designs that transcend seasons and trends
                </p>
                <Button
                    asChild
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-light tracking-wider px-8 py-3 text-sm"
                >
                    <Link href="/products">EXPLORE COLLECTION</Link>
                </Button>
            </div>
        </section>
    )
}
