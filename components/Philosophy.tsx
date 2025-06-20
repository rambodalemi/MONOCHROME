import { Star } from 'lucide-react'
import React from 'react'

export default function Philosophy() {
    return (
        <section className="py-24 bg-muted">
            <div className="container max-w-4xl mx-auto text-center px-4">
                <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-8">Our Philosophy</h2>
                <p className="text-lg font-light leading-relaxed text-muted-foreground mb-12">
                    We believe in the power of simplicity. Each piece in our collection is thoughtfully designed to embody
                    timeless elegance, superior craftsmanship, and sustainable practices. Less is more, and more is
                    everything.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
                            <Star className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h3 className="text-xl font-light tracking-wide">Quality</h3>
                        <p className="text-muted-foreground font-light leading-relaxed">
                            Premium materials and meticulous attention to detail in every stitch
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-primary-foreground rounded-full" />
                        </div>
                        <h3 className="text-xl font-light tracking-wide">Sustainability</h3>
                        <p className="text-muted-foreground font-light leading-relaxed">
                            Ethically sourced materials and responsible manufacturing processes
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-primary-foreground" />
                        </div>
                        <h3 className="text-xl font-light tracking-wide">Minimalism</h3>
                        <p className="text-muted-foreground font-light leading-relaxed">
                            Clean lines and timeless designs that never go out of style
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
