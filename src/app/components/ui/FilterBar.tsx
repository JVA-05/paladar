'use client';
import React from 'react';

interface FilterBarProps {
  top?: string;
  zIndex: number;
  className?: string;
  children: React.ReactNode;
  isSticky?: boolean;
}

export default function FilterBar({ 
  top = '', 
  zIndex, 
  className = '', 
  children,
  isSticky = true
}: FilterBarProps) {
  const stickyClass = isSticky ? `sticky ${top}` : '';
  
  return (
    <div 
      className={`${stickyClass} ${className}`}
      style={{ zIndex }}
    >
      {children}
    </div>
  );
}