'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { NavOverlay } from './NavOverlay'
import { AdminPasscodeModal } from './AdminPasscodeModal'

interface HeaderProps {
  siteName: string
  nameShort: string
}

export function Header({ siteName, nameShort }: HeaderProps) {
  const [navOpen, setNavOpen] = useState(false)
  const [passcodeOpen, setPasscodeOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuBtnRef = useRef<HTMLButtonElement>(null)

  // Close nav on Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && navOpen) {
        setNavOpen(false)
        menuBtnRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [navOpen])

  // Prevent body scroll when nav is open
  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [navOpen])

  // Scroll shadow
  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 4) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        id="site-header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'var(--bg)',
          borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
          transition: 'border-color var(--transition-base)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '4.5rem',
          }}
        >
          {/* Site logo (PNG) */}
          <Link
            href="/"
            aria-label={`${siteName} — home`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: 48,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt={siteName}
              style={{
                height: 'clamp(36px, 4.5vw, 44px)',
                width: 'auto',
                maxWidth: 220,
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </Link>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {/* Lock button for admin access */}
            <button
              type="button"
              onClick={() => setPasscodeOpen(true)}
              className="label header-menu-btn"
              aria-label="Admin Terminal Authentication"
              title="Admin Terminal"
              style={{
                minWidth: 44,
                minHeight: 44,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 var(--space-3)',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </button>

            {/* Menu button */}
            <button
              id="nav-toggle"
              ref={menuBtnRef}
              onClick={() => setNavOpen(true)}
              className="label header-menu-btn"
              aria-expanded={navOpen}
              aria-controls="nav-overlay"
              aria-label="Buka navigasi"
              style={{
                minWidth: 44,
                minHeight: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                letterSpacing: '0.12em',
              }}
            >
              MENU
            </button>
          </div>
        </div>
      </header>

      <NavOverlay
        isOpen={navOpen}
        onClose={() => {
          setNavOpen(false)
          menuBtnRef.current?.focus()
        }}
      />

      <AdminPasscodeModal
        isOpen={passcodeOpen}
        onClose={() => setPasscodeOpen(false)}
      />
    </>
  )
}
