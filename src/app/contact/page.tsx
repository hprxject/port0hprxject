import type { Metadata } from 'next'
import { getSiteConfig } from '@/lib/content'
import { ContactEmailCopy } from '@/components/ContactEmailCopy'
import { CropMark } from '@/components/CropMark'
import { SheetLabel } from '@/components/SheetLabel'
import { ScrambleTitle } from '@/components/ScrambleTitle'

export const metadata: Metadata = {
  title: 'Contact — Hprxject',
  description: 'Inquiries, commissions, and direct correspondence with Hprxject graphic design practice.',
}

export default function ContactPage() {
  const site = getSiteConfig()
  const contact = site.contact

  const socialLinks = [
    {
      domain: 'Instagram.com',
      path: `/${contact.instagram.replace('@', '')}`,
      href: contact.instagramUrl || `https://instagram.com/${contact.instagram.replace('@', '')}`,
      note: 'PROCESS & RELEASES',
    },
    {
      domain: 'Behance.net',
      path: `/${contact.behance.replace(/^behance\.net\/?/i, '').replace('@', '')}`,
      href: contact.behanceUrl || `https://${contact.behance}`,
      note: 'FULL ARCHIVAL CASE STUDIES',
    },
    {
      domain: 'Discord.com',
      path: `/${contact.discord || 'hprxject'}`,
      href: contact.discordUrl || 'https://discord.com/users/645627691050991617',
      note: 'DIRECT CHAT CHANNEL',
    },
  ]

  return (
    <div style={{ position: 'relative' }}>
      <article
        className="container"
        style={{
          position: 'relative',
          paddingTop: 'var(--space-12)',
          paddingBottom: 'var(--space-24)',
        }}
      >
        {/* Archival Crop Marks */}
        <CropMark position="top-left" gap={12} />
        <CropMark position="top-right" gap={12} />

        {/* Archival Sheet Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-8)',
            paddingBottom: 'var(--space-3)',
            borderBottom: '1px solid var(--line)',
          }}
        >
          <SheetLabel current={3} total={3} label="CORRESPONDENCE // INQUIRY" />
          <span className="label" style={{ fontSize: 'var(--text-xs)', opacity: 0.4 }}>
            CHANNEL: OPEN
          </span>
        </div>

        {/* Page Title */}
        <header style={{ marginBottom: 'var(--space-12)' }}>
          <ScrambleTitle
            text="Contact"
            as="h1"
            style={{
              fontSize: 'clamp(2.75rem, 8vw, 6.5rem)',
              lineHeight: 0.95,
              marginBottom: 'var(--space-4)',
            }}
          />
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              maxWidth: '52ch',
              lineHeight: 1.45,
              opacity: 0.85,
            }}
          >
            For identity commissions, print direction, or publication collaborations,
            reach out directly via email or social communication networks.
          </p>
        </header>

        {/* ── 1. Large Clickable & Copyable Email ── */}
        <section aria-label="Alamat Email Utama" style={{ marginBottom: 'var(--space-16)' }}>
          <ContactEmailCopy email={contact.email} />
        </section>

        {/* ── 2. Social Links Thin-Line Archival Table ── */}
        <section aria-label="Saluran Komunikasi Sosial" style={{ marginBottom: 'var(--space-16)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 'var(--space-3)',
              marginBottom: 'var(--space-2)',
              borderBottom: '1px solid var(--line)',
            }}
          >
            <span className="label" style={{ fontSize: 'var(--text-xs)', opacity: 0.5 }}>
              COMMUNICATION CHANNELS // NETWORKS
            </span>
            <span className="label" style={{ fontSize: 'var(--text-xs)', color: 'var(--ink)' }}>
              VERIFIED
            </span>
          </div>

          <div role="list">
            {socialLinks.map((item) => (
              <a
                key={item.domain}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                role="listitem"
                className="catalog-row"
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-4) 0',
                  borderBottom: '1px solid var(--line)',
                  minHeight: 56,
                }}
              >
                {/* Handle & Note */}
                <span style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-base)',
                      color: 'var(--fg)',
                    }}
                  >
                    <span style={{ color: 'var(--ink)' }}>{item.domain}</span>
                    {item.path}
                  </span>
                  <span className="label" style={{ fontSize: 'var(--text-xs)', opacity: 0.4 }}>
                    {item.note}
                  </span>
                </span>

                {/* External Arrow */}
                <span
                  className="label"
                  style={{
                    fontSize: 'var(--text-sm)',
                    opacity: 0.5,
                    paddingRight: 'var(--space-2)',
                  }}
                  aria-hidden="true"
                >
                  ↗
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Bottom Colophon Strip */}
        <div
          style={{
            paddingTop: 'var(--space-4)',
            borderTop: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
          }}
        >
          <span className="label" style={{ opacity: 0.4, fontSize: 'var(--text-xs)' }}>
            REG-DISPATCH / {new Date().getFullYear()}
          </span>
          <span className="label" style={{ opacity: 0.4, fontSize: 'var(--text-xs)' }}>
            PGP/KEY: UNENCRYPTED PUBLIC INBOX
          </span>
        </div>

        {/* Bottom Crop Marks */}
        <CropMark position="bottom-left" gap={12} />
        <CropMark position="bottom-right" gap={12} />
      </article>
    </div>
  )
}
