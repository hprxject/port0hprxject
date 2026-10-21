'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import type { Route } from 'next'
import type { ProjectWithIndex } from '@/lib/content'

interface CatalogTableProps {
  projects: ProjectWithIndex[]
  /** If true, renders only 3 rows then a "Lihat semua" link */
  compact?: boolean
}

export function CatalogTable({ projects, compact = false }: CatalogTableProps) {
  const [hovered, setHovered] = useState<ProjectWithIndex | null>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const tableRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY })
  }, [])

  const visible = compact ? projects.slice(0, 3) : projects

  return (
    <div ref={tableRef} onMouseMove={handleMouseMove} style={{ position: 'relative' }}>

      {/* ── Cursor-following image preview (directly beside cursor) ── */}
      <div
        className="cursor-preview"
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: (typeof window !== 'undefined' && pos.x + 250 > window.innerWidth) ? pos.x - 236 : pos.x + 16,
          top: pos.y,
          transform: 'translateY(-50%)',
          width: 220,
          height: 165,
          pointerEvents: 'none',
          zIndex: 100,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 140ms ease',
          overflow: 'hidden',
          border: '1px solid var(--line)',
          backgroundColor: 'var(--bg)',
        }}
      >
        {hovered && (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hovered.cover}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'grayscale(1) contrast(1.15) brightness(0.85)',
                display: 'block',
              }}
            />
            {/* Duotone blue overlay */}
            <span
              className="duotone-blue"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'var(--ink)',
                opacity: 0.45,
                pointerEvents: 'none',
              }}
            />
          </div>
        )}
      </div>

      {/* ── Table rows ── */}
      <div role="list" className="catalog-list">
        {visible.map((project) => (
          <CatalogRow
            key={project.slug}
            project={project}
            onEnter={() => setHovered(project)}
            onLeave={() => setHovered(null)}
          />
        ))}
      </div>

      {/* ── Compact: "Lihat semua" link ── */}
      {compact && (
        <div
          style={{
            borderTop: '1px solid var(--line)',
            paddingTop: 'var(--space-6)',
            marginTop: 'var(--space-4)',
          }}
        >
          <Link
            href={'/work' as Route}
            className="label"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              fontSize: 'var(--text-sm)',
              letterSpacing: '0.16em',
              color: 'var(--ink)',
              transition: 'gap var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.gap = 'var(--space-6)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.gap = 'var(--space-3)'
            }}
          >
            VIEW ALL ARCHIVES
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </div>
  )
}

/* ── Individual row ──────────────────────────────────────────────── */
interface CatalogRowProps {
  project: ProjectWithIndex
  onEnter: () => void
  onLeave: () => void
}

function CatalogRow({ project, onEnter, onLeave }: CatalogRowProps) {
  const meta = [project.category, project.year, project.client]
    .filter(Boolean)
    .join(' / ')
    .toUpperCase()

  return (
    <Link
      href={`/work/${project.slug}` as Route}
      role="listitem"
      className="catalog-row"
      aria-label={`${project.index} — ${project.title}, ${project.category}, ${project.year}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Index */}
      <span className="catalog-index label">{project.index}</span>

      {/* Title + meta (stacked) */}
      <span className="catalog-body">
        <span className="catalog-title">{project.title}</span>
        <span className="catalog-meta label">{meta}</span>
      </span>

      {/* Thumbnail — visible on mobile, hidden on desktop */}
      <span className="catalog-thumb" aria-hidden="true">
        <span className="catalog-thumb-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.cover}
            alt=""
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(1) contrast(1.1)',
              display: 'block',
            }}
          />
          <span
            className="duotone-blue"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'var(--ink)',
              opacity: 0.4,
              pointerEvents: 'none',
            }}
          />
        </span>
      </span>

      {/* Arrow */}
      <span className="catalog-arrow" aria-hidden="true">→</span>
    </Link>
  )
}
