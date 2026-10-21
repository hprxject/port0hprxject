'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function PageWipe() {
  const pathname = usePathname()
  const [animating, setAnimating] = useState(false)
  const isFirstMount = useRef(true)

  useEffect(() => {
    // Avoid wipe animation on initial page load
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }

    setAnimating(true)
    const timer = setTimeout(() => {
      setAnimating(false)
    }, 280)

    return () => clearTimeout(timer)
  }, [pathname])

  if (!animating) return null

  return (
    <div
      className="page-wipe-curtain"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--ink)',
        zIndex: 9998,
        pointerEvents: 'none',
      }}
    />
  )
}
