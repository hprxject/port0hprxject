'use client'

import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    // Read from localStorage or system preference
    const stored = localStorage.getItem('bia-theme') as Theme | null
    if (stored) {
      setTheme(stored)
      document.documentElement.setAttribute('data-theme', stored)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initial: Theme = prefersDark ? 'dark' : 'light'
      setTheme(initial)
      document.documentElement.setAttribute('data-theme', initial)
    }
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('bia-theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  return { theme, toggle }
}
