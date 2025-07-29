'use client';
import React from 'react';

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  className?: string; // Añadir prop para clases adicionales
}

export default function FilterButton({ 
  label, 
  isActive, 
  onClick,
  className = '' 
}: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
        isActive
          ? 'bg-amber-600 text-white shadow-md'
          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
      } ${className}`}
    >
      {label}
    </button>
  );
}