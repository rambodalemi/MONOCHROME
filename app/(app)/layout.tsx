import React from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="border-grid flex flex-1 flex-col">
            {children}
        </div>
    )
}
