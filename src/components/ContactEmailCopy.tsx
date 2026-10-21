'use client'

import { useState } from 'react'
import { useScrambleText } from './ScrambleTitle'

interface ContactEmailCopyProps {
  email: string
}

export function ContactEmailCopy({ email }: ContactEmailCopyProps) {
  const [copied, setCopied] = useState(false)
  const { displayText: scrambleEmail, elementRef: emailRef } = useScrambleText(email, { speed: 32 })

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2400)
    } catch {
      // Fallback
      setCopied(false)
    }
  }

  return (
    <div
      style={{
        border: '1px solid var(--line)',
        padding: 'var(--space-8) var(--space-6)',
        position: 'relative',
        backgroundColor: 'var(--bg)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-6)',
          borderBottom: '1px solid var(--line)',
          paddingBottom: 'var(--space-3)',
        }}
      >
        <span className="label" style={{ opacity: 0.5, fontSize: 'var(--text-xs)' }}>
          DIRECT DISPATCH // PRIMARY INQUIRIES
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="label"
          aria-live="polite"
          style={{
            minHeight: 44,
            padding: 'var(--space-2) var(--space-4)',
            border: '1px solid var(--line)',
            color: copied ? 'var(--bg)' : 'var(--fg)',
            backgroundColor: copied ? 'var(--ink)' : 'transparent',
            letterSpacing: '0.14em',
            fontSize: 'var(--text-xs)',
            cursor: 'pointer',
            transition: 'background-color var(--transition-fast), color var(--transition-fast)',
          }}
        >
          {copied ? '✓ COPIED TO CLIPBOARD' : '[COPY ADDRESS]'}
        </button>
      </div>

      {/* Large Clickable Email */}
      <a
        ref={emailRef}
        href={`mailto:${email}`}
        aria-label={`Send email to ${email}`}
        style={{
          display: 'inline-block',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.75rem, 5.5vw, 4.25rem)',
          fontWeight: 300,
          fontStyle: 'italic',
          lineHeight: 1.1,
          color: 'var(--ink)',
          wordBreak: 'break-all',
          textDecoration: 'none',
          transition: 'opacity var(--transition-fast)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.75'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1'
        }}
      >
        {scrambleEmail}
      </a>

      <div
        style={{
          marginTop: 'var(--space-4)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          opacity: 0.5,
          letterSpacing: '0.1em',
        }}
      >
        RESPONSE WINDOW: 24—48 BUSINESS HOURS
      </div>
    </div>
  )
}
