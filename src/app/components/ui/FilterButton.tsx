// src/app/components/ui/FilterButton.tsx
'use client';

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function FilterButton({
  label,
  isActive,
  onClick,
}: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-block px-4 py-2 rounded-full text-sm font-medium transition
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isActive
          ? 'bg-amber-500 text-white shadow-md'
          : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}
      `}
    >
      {label}
    </button>
  );
}
