import Footer from '@/components/shared/footer'
import Navbar from '@/components/shared/nav/nav'
import React from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="border-grid flex flex-1 flex-col">
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}
