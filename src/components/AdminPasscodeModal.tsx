'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Route } from 'next'
import { CropMark } from './CropMark'

interface AdminPasscodeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AdminPasscodeModal({ isOpen, onClose }: AdminPasscodeModalProps) {
  const [passcode, setPasscode] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      setPasscode('')
      setErrorMsg('')
      // Focus input on open
      setTimeout(() => inputRef.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passcode.trim() === '345345') {
      setErrorMsg('')
      onClose()
      router.push('/admin' as Route)
    } else {
      setErrorMsg('ACCESS DENIED // KODE TIDAK VALID')
      setPasscode('')
      inputRef.current?.focus()
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-passcode-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(11, 11, 12, 0.88)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 440,
          backgroundColor: 'var(--bg)',
          border: '1px solid var(--line)',
          padding: 'var(--space-8) var(--space-6)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
        }}
      >
        {/* Archival Corner Marks */}
        <CropMark position="top-left" gap={8} />
        <CropMark position="top-right" gap={8} />
        <CropMark position="bottom-left" gap={8} />
        <CropMark position="bottom-right" gap={8} />

        {/* Header Tag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--line)',
            paddingBottom: 'var(--space-3)',
            marginBottom: 'var(--space-6)',
          }}
        >
          <span
            id="admin-passcode-title"
            className="label"
            style={{ fontSize: '10px', color: 'var(--ink)', letterSpacing: '0.16em' }}
          >
            SECURITY PROTOCOL // TERMINAL ACCESS
          </span>
          <button
            type="button"
            onClick={onClose}
            className="label"
            aria-label="Tutup prompt kode sandi"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--fg)',
              opacity: 0.6,
              cursor: 'pointer',
              fontSize: '11px',
              padding: '2px 4px',
            }}
          >
            [ESC / ✕]
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'var(--space-4)', textAlign: 'center' }}>
            <label
              htmlFor="terminal-passcode"
              className="label"
              style={{
                display: 'block',
                fontSize: '10px',
                opacity: 0.5,
                marginBottom: 'var(--space-2)',
                letterSpacing: '0.12em',
                textAlign: 'center',
              }}
            >
              AUTHENTICATION PASSCODE
            </label>
            <input
              ref={inputRef}
              id="terminal-passcode"
              type="password"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value)
                if (errorMsg) setErrorMsg('')
              }}
              placeholder="???"
              style={{
                width: '100%',
                padding: 'var(--space-3) var(--space-4)',
                border: errorMsg ? '1px solid #ff4d4f' : '1px solid var(--line)',
                backgroundColor: 'transparent',
                color: 'var(--fg)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-lg)',
                letterSpacing: '0.24em',
                textAlign: 'center',
                outline: 'none',
              }}
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: '#ff4d4f',
                letterSpacing: '0.08em',
                marginBottom: 'var(--space-4)',
                textAlign: 'center',
              }}
            >
              ⚠ {errorMsg}
            </div>
          )}

          {/* Action Button */}
          <div style={{ marginTop: 'var(--space-6)' }}>
            <button
              type="submit"
              className="label"
              style={{
                width: '100%',
                minHeight: 44,
                backgroundColor: 'var(--ink)',
                color: 'var(--bg)',
                border: 'none',
                cursor: 'pointer',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.14em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              VERIFY & ENTER →
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
