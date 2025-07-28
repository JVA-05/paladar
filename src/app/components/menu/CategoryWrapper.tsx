'use client';

import React from 'react';
import { Categoria } from '@/types';
import MenuCategorySection from './MenuCategorySection';

interface WrapperProps {
  categoria: Categoria;
  isVisible: boolean;
}

const CategoryWrapper = React.memo(
  ({ categoria, isVisible }: WrapperProps) => {
    return (
      <div className={isVisible ? 'block' : 'hidden'}>
        <MenuCategorySection categoria={categoria} />
      </div>
    );
  },
  // Solo rerenderiza si cambia la visibilidad
  (prev, next) => prev.isVisible === next.isVisible
);

export default CategoryWrapper;
