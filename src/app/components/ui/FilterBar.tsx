// src/app/components/ui/FilterBar.tsx
'use client'

import React, { ReactNode } from 'react'

interface FilterBarProps {
  top: string
  zIndex?: number
  className?: string
  children: ReactNode
}

export default function FilterBar({
  top,
  zIndex = 50,
  className = '',
  children,
}: FilterBarProps) {
  return (
    <div
      className={`
        fixed ${top} left-0 w-full
        bg-amber-50 border-b border-gray-200
        z-${zIndex}
        ${className}
      `}
    >
      <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center gap-3 overflow-x-auto whitespace-nowrap">
        {children}
      </div>
    </div>
  )
}
