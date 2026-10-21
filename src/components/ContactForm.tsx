'use client'

import { useState } from 'react'

interface ContactFormProps {
  email: string
}

export function ContactForm({ email }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    senderEmail: '',
    discipline: 'Brand Identity',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')

    try {
      // Free Web3Forms endpoint or mailto fallback
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: 'YOUR_ACCESS_KEY_HERE', // Free Web3Forms key placeholder
          name: formData.name,
          email: formData.senderEmail,
          subject: `[Portfolio Inquiry] ${formData.discipline} — from ${formData.name}`,
          message: formData.message,
          to_email: email,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setStatus('success')
        setFormData({ name: '', senderEmail: '', discipline: 'Brand Identity', message: '' })
      } else {
        // Fallback to mailto on key absence or API reject
        const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
          `[Portfolio Inquiry] ${formData.discipline} — ${formData.name}`
        )}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.senderEmail}\n\n${formData.message}`)}`
        window.location.href = mailtoUrl
        setStatus('success')
      }
    } catch {
      // Graceful fallback to client mailto
      const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
        `[Portfolio Inquiry] ${formData.discipline} — ${formData.name}`
      )}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.senderEmail}\n\n${formData.message}`)}`
      window.location.href = mailtoUrl
      setStatus('success')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Direct message form"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        {/* Name Field */}
        <div>
          <label
            htmlFor="contact-name"
            className="label"
            style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-xs)' }}
          >
            NAME // ENTITY *
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Studio Mono"
            style={{
              width: '100%',
              minHeight: 48,
              padding: 'var(--space-2) var(--space-3)',
              backgroundColor: 'transparent',
              border: '1px solid var(--line)',
              borderRadius: 0,
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              color: 'var(--fg)',
              outline: 'none',
            }}
          />
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="contact-email"
            className="label"
            style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-xs)' }}
          >
            RETURN EMAIL ADDRESS *
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={formData.senderEmail}
            onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
            placeholder="client@organization.com"
            style={{
              width: '100%',
              minHeight: 48,
              padding: 'var(--space-2) var(--space-3)',
              backgroundColor: 'transparent',
              border: '1px solid var(--line)',
              borderRadius: 0,
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              color: 'var(--fg)',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Discipline / Subject Field */}
      <div>
        <label
          htmlFor="contact-discipline"
          className="label"
          style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-xs)' }}
        >
          PROJECT DISCIPLINE
        </label>
        <select
          id="contact-discipline"
          value={formData.discipline}
          onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
          style={{
            width: '100%',
            minHeight: 48,
            padding: 'var(--space-2) var(--space-3)',
            backgroundColor: 'var(--bg)',
            border: '1px solid var(--line)',
            borderRadius: 0,
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
            color: 'var(--fg)',
            outline: 'none',
          }}
        >
          <option value="Brand Identity">Brand Identity & Visual System</option>
          <option value="Editorial & Print">Editorial Architecture & Books</option>
          <option value="Poster Series">Poster Typography & Exhibition</option>
          <option value="Packaging">Structural Packaging & Labeling</option>
          <option value="General Commission">General Design Commission</option>
        </select>
      </div>

      {/* Message Field */}
      <div>
        <label
          htmlFor="contact-message"
          className="label"
          style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-xs)' }}
        >
          DISPATCH BRIEF / MESSAGE *
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Briefly describe project scope, timeline, and deliverables..."
          style={{
            width: '100%',
            padding: 'var(--space-3)',
            backgroundColor: 'transparent',
            border: '1px solid var(--line)',
            borderRadius: 0,
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            color: 'var(--fg)',
            outline: 'none',
            resize: 'vertical',
          }}
        />
      </div>

      {/* Status & Submit Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}
      >
        <span
          className="label"
          aria-live="polite"
          style={{
            fontSize: 'var(--text-xs)',
            color: status === 'success' ? 'var(--ink)' : 'var(--fg)',
            opacity: status === 'idle' ? 0.4 : 1,
          }}
        >
          {status === 'submitting' && 'TRANSMITTING DISPATCH...'}
          {status === 'success' && '✓ DISPATCH INITIATED / TRANSMITTED'}
          {status === 'idle' && 'WEB3FORMS / DIRECT DISPATCH PROTOCOL'}
        </span>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="label"
          style={{
            minHeight: 48,
            minWidth: 160,
            padding: 'var(--space-3) var(--space-8)',
            backgroundColor: 'transparent',
            border: '1px solid var(--ink)',
            color: 'var(--ink)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.16em',
            cursor: status === 'submitting' ? 'wait' : 'pointer',
            transition: 'background-color var(--transition-fast), color var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--ink)'
            e.currentTarget.style.color = 'var(--bg)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'var(--ink)'
          }}
        >
          {status === 'submitting' ? 'TRANSMITTING...' : 'TRANSMIT MESSAGE →'}
        </button>
      </div>
    </form>
  )
}
