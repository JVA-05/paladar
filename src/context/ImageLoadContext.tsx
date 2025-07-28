'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ImageLoadContextValue {
  isLoaded: (src: string) => boolean;
  markLoaded: (src: string) => void;
}

const ImageLoadContext = createContext<ImageLoadContextValue>({
  isLoaded: () => false,
  markLoaded: () => {},
});

export function ImageLoadProvider({ children }: { children: ReactNode }) {
  // guardamos en un Set para O(1) lookup
  const [loadedSet] = useState<Set<string>>(() => new Set());

  const isLoaded = (src: string) => loadedSet.has(src);
  const markLoaded = (src: string) => {
    loadedSet.add(src);
  };

  return (
    <ImageLoadContext.Provider value={{ isLoaded, markLoaded }}>
      {children}
    </ImageLoadContext.Provider>
  );
}

export function useImageLoad() {
  return useContext(ImageLoadContext);
}
