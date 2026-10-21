import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Route } from 'next'
import { getAllProjects, getProjectBySlug, getAdjacentProjects } from '@/lib/content'
import { ImageLightbox } from '@/components/ImageLightbox'
import { CropMark } from '@/components/CropMark'
import { SheetLabel } from '@/components/SheetLabel'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const projects = getAllProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    return { title: 'Project Not Found — Hprxject' }
  }

  return {
    title: `${project.index} — ${project.title} | Hprxject`,
    description: project.description,
    openGraph: {
      title: `${project.title} — ${project.category} (${project.year})`,
      description: project.description,
      images: [{ url: project.cover }],
    },
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const { prev, next } = getAdjacentProjects(slug)
  const totalProjects = getAllProjects().length

  // Construct images list (fallback to cover if images array is empty)
  const images = project.images && project.images.length > 0
    ? project.images
    : [{ src: project.cover, alt: project.title }]

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

        {/* Archival sheet header */}
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
          <SheetLabel
            current={Number(project.index) || 1}
            total={totalProjects}
            label="PROJECT FILE"
          />
          <Link
            href={'/work' as Route}
            className="label"
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--ink)',
              letterSpacing: '0.14em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
          >
            ← BACK TO ARCHIVE
          </Link>
        </div>

        {/* Project Header: Index + Title */}
        <header style={{ marginBottom: 'var(--space-12)' }}>
          <div
            className="label"
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--ink)',
              marginBottom: 'var(--space-2)',
              letterSpacing: '0.18em',
            }}
          >
            ITEM // {project.index}
          </div>
          <h1
            className="hero-name"
            data-text={project.title}
            style={{
              fontSize: 'clamp(2.75rem, 8vw, 6.5rem)',
              lineHeight: 0.95,
              marginBottom: 'var(--space-6)',
            }}
          >
            {project.title}
          </h1>

          {/* Description */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              lineHeight: 1.5,
              maxWidth: '56ch',
              color: 'var(--fg)',
              opacity: 0.9,
            }}
          >
            {project.description}
          </p>
        </header>

        {/* Metadata Archival Specification Block */}
        <section
          aria-label="Spesifikasi Proyek"
          style={{
            borderTop: '1px solid var(--line)',
            borderBottom: '1px solid var(--line)',
            padding: 'var(--space-6) 0',
            marginBottom: 'var(--space-12)',
          }}
        >
          <dl
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 'var(--space-6) var(--space-8)',
              margin: 0,
            }}
          >
            {/* Client */}
            <div>
              <dt className="label" style={{ opacity: 0.45, marginBottom: 'var(--space-1)', fontSize: 'var(--text-xs)' }}>
                CLIENT
              </dt>
              <dd style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--fg)' }}>
                {project.client || '—'}
              </dd>
            </div>

            {/* Year */}
            <div>
              <dt className="label" style={{ opacity: 0.45, marginBottom: 'var(--space-1)', fontSize: 'var(--text-xs)' }}>
                YEAR
              </dt>
              <dd style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--fg)' }}>
                {project.year || '—'}
              </dd>
            </div>

            {/* Category / Discipline */}
            <div>
              <dt className="label" style={{ opacity: 0.45, marginBottom: 'var(--space-1)', fontSize: 'var(--text-xs)' }}>
                DISCIPLINE
              </dt>
              <dd style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--fg)' }}>
                {project.category || '—'}
              </dd>
            </div>

            {/* Role */}
            <div>
              <dt className="label" style={{ opacity: 0.45, marginBottom: 'var(--space-1)', fontSize: 'var(--text-xs)' }}>
                ROLE
              </dt>
              <dd style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--fg)' }}>
                {project.role || '—'}
              </dd>
            </div>

            {/* Tools */}
            <div>
              <dt className="label" style={{ opacity: 0.45, marginBottom: 'var(--space-1)', fontSize: 'var(--text-xs)' }}>
                TOOLS
              </dt>
              <dd style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--fg)' }}>
                {project.tools && project.tools.length > 0 ? project.tools.join(', ') : '—'}
              </dd>
            </div>
          </dl>
        </section>

        {/* ── Single-Column Gallery with Tap to Enlarge Lightbox ── */}
        <section aria-label="Galeri Gambar Proyek" style={{ marginBottom: 'var(--space-16)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-6)',
            }}
          >
            <span className="label" style={{ opacity: 0.5, fontSize: 'var(--text-xs)' }}>
              VISUAL PLATES [{String(images.length).padStart(2, '0')}]
            </span>
            <span className="label" style={{ opacity: 0.5, fontSize: 'var(--text-xs)' }}>
              1-COLUMN ARCHIVAL DISPLAY
            </span>
          </div>

          <ImageLightbox images={images} />
        </section>

        {/* ── Sequential Navigation "← 002 / 004 →" ── */}
        <nav
          aria-label="Navigasi Proyek Sebelumnya dan Sesudahnya"
          style={{
            borderTop: '1px solid var(--line)',
            borderBottom: '1px solid var(--line)',
            padding: 'var(--space-6) 0',
            marginTop: 'var(--space-16)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
          }}
        >
          {/* Previous item */}
          {prev ? (
            <Link
              href={`/work/${prev.slug}` as Route}
              className="label"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                fontSize: 'var(--text-sm)',
                letterSpacing: '0.14em',
                minHeight: 44,
                color: 'var(--fg)',
                transition: 'color var(--transition-fast)',
              }}
            >
              <span aria-hidden="true" style={{ color: 'var(--ink)' }}>←</span>
              <span>{prev.index}</span>
              <span style={{ opacity: 0.45, display: 'none' }} className="nav-project-title">
                ({prev.title})
              </span>
            </Link>
          ) : (
            <span
              className="label"
              style={{
                opacity: 0.25,
                fontSize: 'var(--text-sm)',
                letterSpacing: '0.14em',
                minHeight: 44,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
              }}
            >
              <span>← END</span>
            </span>
          )}

          {/* Center separator indicator: "← 002 / 004 →" format */}
          <div
            className="label"
            style={{
              fontSize: 'var(--text-sm)',
              letterSpacing: '0.2em',
              color: 'var(--ink)',
            }}
          >
            {prev ? `← ${prev.index}` : '← ---'}
            <span style={{ opacity: 0.4, margin: '0 var(--space-3)', color: 'var(--fg)' }}>/</span>
            {next ? `${next.index} →` : '--- →'}
          </div>

          {/* Next item */}
          {next ? (
            <Link
              href={`/work/${next.slug}` as Route}
              className="label"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                fontSize: 'var(--text-sm)',
                letterSpacing: '0.14em',
                minHeight: 44,
                color: 'var(--fg)',
                transition: 'color var(--transition-fast)',
              }}
            >
              <span style={{ opacity: 0.45, display: 'none' }} className="nav-project-title">
                ({next.title})
              </span>
              <span>{next.index}</span>
              <span aria-hidden="true" style={{ color: 'var(--ink)' }}>→</span>
            </Link>
          ) : (
            <span
              className="label"
              style={{
                opacity: 0.25,
                fontSize: 'var(--text-sm)',
                letterSpacing: '0.14em',
                minHeight: 44,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
              }}
            >
              <span>END →</span>
            </span>
          )}
        </nav>

        {/* Bottom archival footnote */}
        <div
          style={{
            marginTop: 'var(--space-6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
          }}
        >
          <span className="label" style={{ opacity: 0.4, fontSize: 'var(--text-xs)' }}>
            RECORD ID: {project.slug.toUpperCase()}
          </span>
          <span className="label" style={{ opacity: 0.4, fontSize: 'var(--text-xs)' }}>
            PRINT RUN: {project.year} / COLOPHON
          </span>
        </div>

        {/* Bottom crop marks */}
        <CropMark position="bottom-left" gap={12} />
        <CropMark position="bottom-right" gap={12} />
      </article>
    </div>
  )
}
