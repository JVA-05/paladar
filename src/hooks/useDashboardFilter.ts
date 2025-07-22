// src/hooks/useDashboardFilters.ts
import { useLocalStorage } from './useLocalStorage'

export function useDashboardFilters() {
  // ejemplo: un array de “paneles” abiertos
  const [openPanels, setOpenPanels] = useLocalStorage<number[]>(
    'dashboardOpenPanels',
    []
  )
  return { openPanels, setOpenPanels }
}
