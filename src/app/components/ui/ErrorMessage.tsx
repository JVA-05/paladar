// src/app/components/ui/ErrorMessage.tsx
'use client';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
      ⚠️ {message}
    </div>
  );
}