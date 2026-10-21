import type { Metadata } from 'next'
import { getSiteConfig } from '@/lib/content'
import { CropMark } from '@/components/CropMark'
import { SheetLabel } from '@/components/SheetLabel'
import { ScrambleTitle } from '@/components/ScrambleTitle'

export const metadata: Metadata = {
  title: 'About — Hprxject',
  description: 'Profile, discipline, services, and archival experience of Hprxject graphic design practice.',
}

export default function AboutPage() {
  const site = getSiteConfig()

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
          <SheetLabel current={3} total={3} label="DOSSIER // PROFILE" />
          <span className="label" style={{ fontSize: 'var(--text-xs)', opacity: 0.4 }}>
            COLOPHON: {new Date().getFullYear()}
          </span>
        </div>

        {/* Page Title */}
        <header style={{ marginBottom: 'var(--space-12)' }}>
          <ScrambleTitle
            text="About"
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
            {site.bio}
          </p>
        </header>

        {/* ── Main Two-Column Asymmetrical Grid ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-12) var(--space-16)',
            alignItems: 'start',
            marginBottom: 'var(--space-16)',
          }}
        >
          {/* Left Column: Photo & CV Download */}
          <div>
            {/* Archival Photo Plate */}
            <figure
              style={{
                margin: 0,
                border: '1px solid var(--line)',
                position: 'relative',
                backgroundColor: 'var(--bg)',
              }}
            >
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={site.photo || '/avatar.png'}
                  alt={`Profile visual plate of ${site.name}`}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    aspectRatio: '4/5',
                    objectFit: 'cover',
                  }}
                />
                {/* Blue riso tint */}
                <span
                  className="duotone-blue"
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'var(--ink)',
                    opacity: 0.15,
                    pointerEvents: 'none',
                  }}
                />
              </div>

              <figcaption
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  borderTop: '1px solid var(--line)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span className="label" style={{ fontSize: 'var(--text-xs)', opacity: 0.5 }}>
                  SPECIMEN: {site.name.toUpperCase()}
                </span>
                <span className="label" style={{ fontSize: 'var(--text-xs)', color: 'var(--ink)' }}>
                  ARCHIVE ID // 01
                </span>
              </figcaption>
            </figure>
          </div>

          {/* Right Column: Detailed Bio, Services & Experience */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
            {/* Extended Bio */}
            {site.aboutBio && (
              <section aria-label="Biografi Lengkap">
                <div
                  className="label"
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--ink)',
                    marginBottom: 'var(--space-3)',
                    letterSpacing: '0.18em',
                  }}
                >
                  DISCIPLINE STATEMENT
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-base)',
                    lineHeight: 1.6,
                    opacity: 0.85,
                  }}
                >
                  {site.aboutBio}
                </p>
              </section>
            )}

            {/* Services List */}
            {site.services && site.services.length > 0 && (
              <section aria-label="Daftar Layanan">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: 'var(--space-2)',
                    marginBottom: 'var(--space-4)',
                    borderBottom: '1px solid var(--line)',
                  }}
                >
                  <span className="label" style={{ fontSize: 'var(--text-xs)', opacity: 0.5 }}>
                    SERVICES & CAPABILITIES
                  </span>
                  <span className="label" style={{ fontSize: 'var(--text-xs)', color: 'var(--ink)' }}>
                    [{site.services.length}]
                  </span>
                </div>

                <div role="list">
                  {site.services.map((svc) => (
                    <div
                      key={svc.index}
                      role="listitem"
                      style={{
                        padding: 'var(--space-4) 0',
                        borderBottom: '1px solid var(--line)',
                        display: 'grid',
                        gridTemplateColumns: '2.5rem 1fr',
                        gap: 'var(--space-4)',
                        alignItems: 'baseline',
                      }}
                    >
                      <span className="label" style={{ color: 'var(--ink)', fontSize: 'var(--text-xs)' }}>
                        {svc.index}
                      </span>
                      <div>
                        <h3
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'var(--text-lg)',
                            fontWeight: 300,
                            fontStyle: 'italic',
                            lineHeight: 1.2,
                            marginBottom: 'var(--space-1)',
                          }}
                        >
                          {svc.title}
                        </h3>
                        <p
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--text-sm)',
                            opacity: 0.7,
                            lineHeight: 1.45,
                          }}
                        >
                          {svc.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Experience Record Table */}
            {site.experience && site.experience.length > 0 && (
              <section aria-label="Riwayat Pengalaman">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: 'var(--space-2)',
                    marginBottom: 'var(--space-4)',
                    borderBottom: '1px solid var(--line)',
                  }}
                >
                  <span className="label" style={{ fontSize: 'var(--text-xs)', opacity: 0.5 }}>
                    CHRONOLOGY // EXPERIENCE
                  </span>
                  <span className="label" style={{ fontSize: 'var(--text-xs)', color: 'var(--ink)' }}>
                    ARCHIVE RECORD
                  </span>
                </div>

                <div role="list">
                  {site.experience.map((exp, idx) => (
                    <div
                      key={idx}
                      role="listitem"
                      style={{
                        padding: 'var(--space-4) 0',
                        borderBottom: '1px solid var(--line)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                          gap: 'var(--space-2) var(--space-4)',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 'var(--text-sm)',
                              color: 'var(--fg)',
                            }}
                          >
                            {exp.role}
                          </div>
                          <div
                            className="label"
                            style={{ fontSize: 'var(--text-xs)', opacity: 0.5, marginTop: 'var(--space-1)' }}
                          >
                            {exp.company}
                          </div>
                        </div>
                        <span className="label" style={{ color: 'var(--ink)', fontSize: 'var(--text-xs)' }}>
                          {exp.period}
                        </span>
                      </div>
                      {exp.description && (
                        <p
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--text-sm)',
                            opacity: 0.75,
                            lineHeight: 1.5,
                            marginTop: 'var(--space-2)',
                          }}
                        >
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Bottom Metadata Footnote */}
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
            DOSSIER REF: HPRX-BIO-{new Date().getFullYear()}
          </span>
          <span className="label" style={{ opacity: 0.4, fontSize: 'var(--text-xs)' }}>
            STATUS: ACTIVE PRACTICE
          </span>
        </div>

        {/* Bottom Crop Marks */}
        <CropMark position="bottom-left" gap={12} />
        <CropMark position="bottom-right" gap={12} />
      </article>
    </div>
  )
}
