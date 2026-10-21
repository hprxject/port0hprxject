'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Glyphs pool for the risograph/archival deciphering effect.
 * Mix of uppercase letters, numbers, and mechanical symbols.
 */
const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#▪▫_/'

interface UseScrambleOptions {
  speed?: number
  threshold?: number
}

/**
 * Reusable hook that scrambles text upon entering viewport,
 * and resets when leaving viewport so scrolling back down replays the animation.
 */
export function useScrambleText(targetText: string, options: UseScrambleOptions = {}) {
  const { speed = 35, threshold = 0.15 } = options
  const [displayText, setDisplayText] = useState(targetText)
  const elementRef = useRef<any>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const hasAnimatedRef = useRef(false)

  const startScramble = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    let iteration = 0
    const totalFrames = targetText.length * 3 + 4

    timerRef.current = setInterval(() => {
      setDisplayText(() => {
        return targetText
          .split('')
          .map((char, index) => {
            if (char === ' ' || char === '@' || char === '.') return char
            // If iteration has progressed past this character's resolve point, lock in original char
            if (index < Math.floor(iteration / 3)) {
              return targetText[index]
            }
            // Otherwise, show a random glyph from the archival pool
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          })
          .join('')
      })

      if (iteration >= totalFrames) {
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
        setDisplayText(targetText)
      }

      iteration += 1
    }, speed)
  }, [targetText, speed])

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    // If browser doesn't support IntersectionObserver or prefers-reduced-motion is active
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDisplayText(targetText)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true
            startScramble()
            observer.unobserve(el)
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
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [targetText, threshold, startScramble])

  return { displayText, elementRef }
}

interface ScrambleTitleProps {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div'
  className?: string
  style?: React.CSSProperties
  speed?: number
}

export function ScrambleTitle({
  text,
  as: Component = 'h2',
  className = 'hero-name',
  style,
  speed = 35,
}: ScrambleTitleProps) {
  const { displayText, elementRef } = useScrambleText(text, { speed })

  return (
    <Component
      ref={elementRef}
      className={className}
      data-text={displayText}
      style={style}
    >
      {displayText}
    </Component>
  )
}
