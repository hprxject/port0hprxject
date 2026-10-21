import { getFeaturedProjects, getSiteConfig } from '@/lib/content'
import { CatalogTable } from '@/components/CatalogTable'
import { ContactEmailCopy } from '@/components/ContactEmailCopy'
import { ClientTicker } from '@/components/ClientTicker'
import { HeroProjectCards } from '@/components/HeroProjectCards'
import { CropMark } from '@/components/CropMark'
import { SheetLabel } from '@/components/SheetLabel'
import { ArchivalReveal } from '@/components/ArchivalReveal'
import { ScrambleTitle } from '@/components/ScrambleTitle'

export default function Home() {
  const site = getSiteConfig()
  const featuredProjects = getFeaturedProjects()
  const contact = site.contact

  const socialLinks = [
    {
      platform: 'INSTAGRAM',
      handle: contact.instagram,
      href: contact.instagramUrl || `https://instagram.com/${contact.instagram.replace('@', '')}`,
      note: 'PROCESS & RELEASES',
    },
    {
      platform: 'BEHANCE',
      handle: contact.behance,
      href: contact.behanceUrl || `https://${contact.behance}`,
      note: 'FULL ARCHIVAL CASE STUDIES',
    },
    {
      platform: 'DISCORD',
      handle: contact.discord || 'hprxject',
      href: contact.discordUrl || 'https://discord.com',
      note: 'DIRECT CHAT CHANNEL',
    },
  ]

  return (
    <div style={{ position: 'relative' }}>
      {/* ── 1. Hero / Overview Section ───────────────────────────── */}
      <section
        className="container"
        aria-label="Archive Overview"
        style={{
          position: 'relative',
          paddingTop: 'var(--space-12)',
          paddingBottom: 'var(--space-24)',
          backgroundColor: 'var(--bg)',
        }}
      >
        {/* Archival Crop Marks (Aksen +) */}
        <CropMark position="top-left" gap={12} />
        <CropMark position="top-right" gap={12} />

        {/* Archival Sheet Header & Garis Pemisah */}
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
          <SheetLabel current={1} total={4} label="OVERVIEW" />
          <span
            className="label"
            style={{ fontSize: 'var(--text-xs)', opacity: 0.4 }}
          >
            DISCIPLINE: GRAPHIC DESIGN
          </span>
        </div>

        {/* Visually hidden H1 for semantic hierarchy & SEO */}
        <h1 className="sr-only">Hprxject — Graphic Design Archive</h1>

        {/* Content Object: Rotating Project Cards Showcase with HPRXJECT overlay */}
        <HeroProjectCards projects={featuredProjects} />

        {/* Bottom Registration Strip & Garis Pemisah */}
        <div
          style={{
            marginTop: 'var(--space-16)',
            paddingTop: 'var(--space-4)',
            borderTop: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
          }}
        >
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
            <span className="label" style={{ fontSize: 'var(--text-xs)', opacity: 0.75 }}>
              MONO BLUE RISOGRAPH
            </span>
          </div>

          <span
            className="label"
            style={{ fontSize: 'var(--text-xs)', opacity: 0.35 }}
          >
            /
          </span>

          <span className="label" style={{ fontSize: 'var(--text-xs)', opacity: 0.75 }}>
            SWISS ARCHIVAL SYSTEM
          </span>

          <span
            className="label"
            style={{ fontSize: 'var(--text-xs)', opacity: 0.35 }}
          >
            /
          </span>

          <span className="label" style={{ fontSize: 'var(--text-xs)', opacity: 0.75 }}>
            EDITION {new Date().getFullYear()}
          </span>
        </div>

        {/* Bottom Crop Marks (Aksen +) */}
        <CropMark position="bottom-left" gap={12} />
        <CropMark position="bottom-right" gap={12} />
      </section>

      {/* ── 2. Catalog Section (Featured Projects) ─────────────────── */}
      <ArchivalReveal
        as="section"
        className="catalog-section container"
        aria-label="Featured Works Catalog"
        style={{ position: 'relative' }}
      >
        {/* Crop Marks */}
        <CropMark position="top-left" gap={12} />
        <CropMark position="top-right" gap={12} />

        {/* Section title & Sheet label */}
        <div className="catalog-section-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <span className="catalog-section-title">
              INDEX OF SELECTED WORKS [001—{String(featuredProjects.length).padStart(3, '0')}]
            </span>
          </div>
          <SheetLabel current={2} total={4} label="CATALOG" />
        </div>

        {/* Archive heading */}
        <ScrambleTitle
          text="Archive"
          as="h2"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            lineHeight: 1,
            marginBottom: 'var(--space-6)',
          }}
        />

        {/* Thin-line archival catalog table */}
        <CatalogTable projects={featuredProjects} compact={true} />

        {/* Bottom Crop Marks */}
        <CropMark position="bottom-left" gap={12} />
        <CropMark position="bottom-right" gap={12} />
      </ArchivalReveal>

      {/* ── 3. About Section (Dossier / Profile) ───────────────────── */}
      <ArchivalReveal
        as="section"
        className="container"
        aria-label="About and Dossier"
        style={{
          position: 'relative',
          paddingTop: 0,
          paddingBottom: 'var(--space-24)',
        }}
      >
        {/* Crop Marks */}
        <CropMark position="top-left" gap={12} />
        <CropMark position="top-right" gap={12} />

        {/* Sheet Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
            paddingTop: 'var(--space-6)',
            marginBottom: 'var(--space-8)',
            paddingBottom: 'var(--space-3)',
            borderBottom: '1px solid var(--line)',
          }}
        >
          <SheetLabel current={3} total={4} label="DOSSIER // PROFILE" />
          <span className="label" style={{ fontSize: 'var(--text-xs)', opacity: 0.4 }}>
            COLOPHON: {new Date().getFullYear()}
          </span>
        </div>

        {/* Section Header */}
        <header style={{ marginBottom: 'var(--space-12)' }}>
          <ScrambleTitle
            text="About"
            as="h2"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              lineHeight: 1,
              marginBottom: 'var(--space-6)',
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

        {/* Two-Column Grid: Photo/CV on Left, Services/Experience on Right */}
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

          {/* Right Column: Bio, Services & Experience */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
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
                            fontSize: 'var(--text-base)',
                            fontWeight: 500,
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
                        padding: 'var(--space-3) 0',
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

        {/* Bottom Crop Marks */}
        <CropMark position="bottom-left" gap={12} />
        <CropMark position="bottom-right" gap={12} />
      </ArchivalReveal>

      {/* ── 4. Contact Section (Correspondence / Channels) ─────────── */}
      <ArchivalReveal
        as="section"
        className="container"
        aria-label="Contact and Channels"
        style={{
          position: 'relative',
          paddingTop: 0,
          paddingBottom: 'var(--space-24)',
        }}
      >
        {/* Crop Marks */}
        <CropMark position="top-left" gap={12} />
        <CropMark position="top-right" gap={12} />

        {/* Sheet Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
            paddingTop: 'var(--space-6)',
            marginBottom: 'var(--space-8)',
            paddingBottom: 'var(--space-3)',
            borderBottom: '1px solid var(--line)',
          }}
        >
          <SheetLabel current={4} total={4} label="CORRESPONDENCE // INQUIRY" />
          <span className="label" style={{ fontSize: 'var(--text-xs)', opacity: 0.4 }}>
            CHANNEL: OPEN
          </span>
        </div>

        {/* Section Header */}
        <header style={{ marginBottom: 'var(--space-12)' }}>
          <ScrambleTitle
            text="Contact"
            as="h2"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              lineHeight: 1,
              marginBottom: 'var(--space-6)',
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

        {/* Large Clickable & Copyable Email */}
        <div style={{ marginBottom: 'var(--space-16)' }}>
          <ContactEmailCopy email={contact.email} />
        </div>

        {/* Social Links Thin-Line Table */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
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
                key={item.platform}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                role="listitem"
                className="catalog-row"
                style={{
                  textDecoration: 'none',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(120px, 180px) 1fr auto',
                  alignItems: 'center',
                  padding: 'var(--space-4) 0',
                  borderBottom: '1px solid var(--line)',
                  minHeight: 56,
                }}
              >
                <span className="label" style={{ color: 'var(--ink)', fontSize: 'var(--text-xs)' }}>
                  {item.platform}
                </span>

                <span style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                  <span
                    className="channel-handle-text"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-base)',
                      color: 'var(--fg)',
                    }}
                  >
                    {item.handle}
                  </span>
                  <span className="label" style={{ fontSize: 'var(--text-xs)', opacity: 0.4 }}>
                    {item.note}
                  </span>
                </span>

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
        </div>

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
      </ArchivalReveal>

      {/* ── 5. Brands / Collaborations Infinite Ticker ─────────────── */}
      <ClientTicker clients={site.clients} />
    </div>
  )
}
