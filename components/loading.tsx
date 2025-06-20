"use client"

import { Loader2 } from "lucide-react"

interface LoadingProps {
  text?: string
  className?: string
}

export function Loading({ text = "Loading...", className = "" }: LoadingProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  )
}
