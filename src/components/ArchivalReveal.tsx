'use client'

import React, { useEffect, useRef, useState } from 'react'

interface ArchivalRevealProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'section' | 'div' | 'article'
  children: React.ReactNode
  className?: string
  threshold?: number
}

/**
 * ArchivalReveal — Triggers mechanical risograph registration
 * animation when the section scrolls into viewport.
 */
export function ArchivalReveal({
  as: Component = 'div',
  children,
  className = '',
  threshold = 0.12,
  ...props
}: ArchivalRevealProps) {
  const elementRef = useRef<HTMLElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    // If browser doesn't support IntersectionObserver, reveal immediately
    if (typeof IntersectionObserver === 'undefined') {
      setIsRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [threshold])

  const combinedClass = `archival-reveal ${isRevealed ? 'is-revealed' : ''} ${className}`.trim()

  return (
    <Component
      ref={elementRef as unknown as React.Ref<any>}
      className={combinedClass}
      {...props}
    >
      {children}
    </Component>
  )
}
