'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import type { Route } from 'next'

const NAV_LINKS: { href: Route; label: string }[] = [
  { href: '/' as Route, label: 'Overview' },
  { href: '/work' as Route, label: 'Archive' },
  { href: '/about' as Route, label: 'About' },
  { href: '/contact' as Route, label: 'Contact' },
]

interface NavOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function NavOverlay({ isOpen, onClose }: NavOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  // Trap focus inside overlay when open
  useEffect(() => {
    if (!isOpen) return
    firstLinkRef.current?.focus()

    const overlay = overlayRef.current
    if (!overlay) return

    const focusable = overlay.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    function onTab(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', onTab)
    return () => window.removeEventListener('keydown', onTab)
  }, [isOpen])

  return (
    <div
      id="nav-overlay"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Main navigation"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        backgroundColor: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--gutter)',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      aria-hidden={!isOpen}
    >
      {/* Close button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-12)' }}>
        <button
          id="nav-close"
          onClick={onClose}
          className="label"
          aria-label="Close navigation"
          style={{ minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', letterSpacing: '0.12em' }}
          tabIndex={isOpen ? 0 : -1}
        >
          CLOSE
        </button>
      </div>

      {/* Nav links */}
      <nav aria-label="Menu utama">
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {NAV_LINKS.map((link, i) => (
            <li key={link.href}>
              <Link
                href={link.href}
                ref={i === 0 ? firstLinkRef : undefined}
                onClick={onClose}
                tabIndex={isOpen ? 0 : -1}
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  lineHeight: 1.1,
                  color: 'var(--fg)',
                  padding: 'var(--space-3) 0',
                  borderBottom: '1px solid var(--line)',
                  transition: 'color var(--transition-fast)',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg)')}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom registration code */}
      <div
        className="label"
        style={{
          marginTop: 'auto',
          opacity: 0.35,
          fontSize: 'var(--text-xs)',
        }}
      >
        BIA-NAV / REG-{new Date().getFullYear()}
      </div>
    </div>
  )
}
