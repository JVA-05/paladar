'use client';

import { FixedSizeList as List } from 'react-window';
import MenuListItem from './MenuListItem';
import { Plato } from '@/types';

interface VirtualizedMenuProps {
  platos: Plato[];
  itemSize?: number; // altura en px de cada item
}

export default function VirtualizedMenu({
  platos,
  itemSize = 120,
}: VirtualizedMenuProps) {
  // altura real que ocupa la lista completa
  const height = platos.length * itemSize;

  return (
    <List
      height={height}
      itemCount={platos.length}
      itemSize={itemSize}
      width="100%"
      style={{ overflow: 'visible' }}  // desactiva el scroll interno
    >
      {({ index, style }) => (
        <div style={style}>
          <MenuListItem plato={platos[index]} />
        </div>
      )}
    </List>
  );
}
