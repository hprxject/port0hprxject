'use client'

import Link from 'next/link'
import type { Route } from 'next'
import type { ProjectWithIndex } from '@/lib/content'

interface CatalogTableProps {
  projects: ProjectWithIndex[]
  /** If true, renders only 3 rows then a "Lihat semua" link */
  compact?: boolean
}

export function CatalogTable({ projects, compact = false }: CatalogTableProps) {
  const visible = compact ? projects.slice(0, 3) : projects

  return (
    <div className="catalog-container" style={{ position: 'relative' }}>
      {/* ── List of Archive Entries ── */}
      <div role="list" className="catalog-list">
        {visible.map((project) => (
          <CatalogEntry key={project.slug} project={project} />
        ))}
      </div>

      {/* ── Compact: "Lihat semua" link ── */}
      {compact && (
        <div className="catalog-compact-footer">
          <Link
            href={'/work' as Route}
            className="label catalog-view-all-link"
          >
            VIEW ALL ARCHIVES
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </div>
  )
}

/* ── Individual entry (Title -> Category -> Thumbnail without filter, no animation) ── */
interface CatalogEntryProps {
  project: ProjectWithIndex
}

function CatalogEntry({ project }: CatalogEntryProps) {
  const meta = [project.category, project.year, project.client]
    .filter(Boolean)
    .join(' / ')
    .toUpperCase()

  return (
    <article role="listitem" className="catalog-entry">
      <Link
        href={`/work/${project.slug}` as Route}
        className="catalog-link"
        aria-label={`${project.index} — ${project.title}, ${project.category}, ${project.year}`}
      >
        <div className="catalog-row-content">
          {/* 1. Paling Kiri: Nomor Indeks */}
          <span className="catalog-index label">
            {project.index}
          </span>

          {/* 2. Tengah: Thumbnail Kecil (tanpa filter, tanpa animasi) */}
          <div className="catalog-thumb-frame" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.cover}
              alt=""
              loading="lazy"
              className="catalog-thumb-img"
            />
          </div>

          {/* 3. Kanan: Tulisan (Judul di atas, Kategori/Meta di bawah) */}
          <div className="catalog-text-block">
            <h3 className="catalog-title">
              {project.title}
            </h3>
            <div className="catalog-meta label">
              {meta}
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
