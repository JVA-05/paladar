// src/hooks/useScrollRestoration.ts
import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

interface ScrollPos { x: number; y: number }

export function useScrollRestoration(key = 'scrollPos') {
  // 1) Lee posición guardada (o {0,0})
  const [pos, setPos] = useLocalStorage<ScrollPos>(key, { x: 0, y: 0 })

  useEffect(() => {
    // 2) Al montar, restauramos scroll
    window.scrollTo(pos.x, pos.y)

    // 3) Cada vez que haga scroll, guardamos la nueva posición
    const handle = () => {
      setPos({ x: window.scrollX, y: window.scrollY })
    }
    window.addEventListener('scroll', handle, { passive: true })

    return () => {
      window.removeEventListener('scroll', handle)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
