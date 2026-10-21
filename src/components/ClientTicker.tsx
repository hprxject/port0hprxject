import React from 'react'
import type { SiteClient } from '@/types/site'

interface ClientTickerProps {
  clients?: Array<SiteClient | string>
  title?: string
}

export function ClientTicker({
  clients = [],
  title = 'REG-COLLAB // SELECTED BRANDS & COLLABORATIONS',
}: ClientTickerProps) {
  // Normalize items whether string path or object
  const normalized = (clients && clients.length > 0
    ? clients
    : [
        { name: 'Specimen Brand 01', logo: '/sponsorlogo1.png' },
        { name: 'Specimen Brand 02', logo: '/sponsorlogo1.png' },
        { name: 'Specimen Brand 03', logo: '/sponsorlogo1.png' },
        { name: 'Specimen Brand 04', logo: '/sponsorlogo1.png' },
        { name: 'Specimen Brand 05', logo: '/sponsorlogo1.png' },
      ]
  ).map((item, idx) => {
    if (typeof item === 'string') {
      return {
        name: `Brand ${String(idx + 1).padStart(2, '0')}`,
        logo: item,
      }
    }
    return item
  })

  // Ensure enough copies so marquee never runs out on wide screens
  // We duplicate normalized array into two identical halves [halfA, halfB]
  // Scrolling -50% perfectly loops seamlessly
  const repeatCount = Math.max(2, Math.ceil(12 / normalized.length))
  const trackItems: Array<{ name?: string; logo: string; key: string }> = []

  for (let r = 0; r < repeatCount; r++) {
    normalized.forEach((client, i) => {
      trackItems.push({
        ...client,
        key: `r${r}-${i}-${client.logo}`,
      })
    })
  }

  return (
    <section
      className="client-ticker-section"
      aria-label="Collaborative Brands and Partners"
    >
      {/* Full-width archival metadata header strip */}
      <div className="client-ticker-header-bar">
        <div className="client-ticker-header container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span
              style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                backgroundColor: 'var(--ink)',
              }}
              aria-hidden="true"
            />
            <span
              className="label"
              style={{ fontSize: 'var(--text-xs)', color: 'var(--ink)' }}
            >
              {title}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <span
              className="label"
              style={{ fontSize: 'var(--text-xs)', opacity: 0.4 }}
            >
              INDEX: [001—{String(normalized.length).padStart(3, '0')}]
            </span>
            <span
              className="label"
              style={{ fontSize: 'var(--text-xs)', opacity: 0.4 }}
            >
              RISO ARCHIVE
            </span>
          </div>
        </div>
      </div>

      {/* Ticker conveyor track with infinite right-to-left marquee */}
      <div className="client-ticker-viewport" aria-hidden="true">
        <div className="client-ticker-track">
          {/* First loop half */}
          <div className="client-ticker-set">
            {trackItems.map((client, idx) => (
              <div
                key={`a-${client.key}-${idx}`}
                className="client-ticker-item"
                title={client.name}
              >
                <span className="client-ticker-index">
                  {String((idx % normalized.length) + 1).padStart(2, '0')}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={client.logo}
                  alt={client.name || 'Brand logo'}
                  className="client-ticker-logo"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Exact duplicate loop half for continuous seamless scroll */}
          <div className="client-ticker-set">
            {trackItems.map((client, idx) => (
              <div
                key={`b-${client.key}-${idx}`}
                className="client-ticker-item"
                title={client.name}
              >
                <span className="client-ticker-index">
                  {String((idx % normalized.length) + 1).padStart(2, '0')}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={client.logo}
                  alt={client.name || 'Brand logo'}
                  className="client-ticker-logo"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
