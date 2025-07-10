// src/app/components/ui/CategoryButton.tsx
'use client';

import React from 'react';

interface CategoryButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function CategoryButton({
  label,
  isActive,
  onClick,
}: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full text-sm font-medium transition
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isActive
          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
          : 'bg-white text-gray-700 hover:bg-indigo-50'}
      `}
    >
      {label}
    </button>
  );
}
