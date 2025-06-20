import React from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

export default function Newsletter() {
    return (
        <section className="py-24 bg-background text-foreground">
            <div className="container max-w-2xl mx-auto text-center space-y-8">
                <h2 className="text-3xl md:text-4xl font-light tracking-wide">Stay Connected</h2>
                <p className="text-lg font-light text-muted-foreground">
                    Subscribe to receive updates on new collections, exclusive offers, and style inspiration
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <Input
                        type="email"
                        placeholder="Enter your email address"
                        className="bg-transparent border-border text-foreground placeholder:text-muted-foreground font-light"
                    />
                    <Button
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-light tracking-wider px-6"
                    >
                        SUBSCRIBE
                    </Button>
                </div>
            </div>
        </section>
    )
}
