'use client'

import { useState } from 'react'
import type { ProjectWithIndex } from '@/lib/content'
import { CatalogTable } from './CatalogTable'

interface WorkCatalogProps {
  projects: ProjectWithIndex[]
  categories: string[]
}

export function WorkCatalog({ projects, categories }: WorkCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')

  const filteredProjects =
    selectedCategory === 'ALL'
      ? projects
      : projects.filter(
          (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
        )

  return (
    <div className="work-catalog-container">
      {/* ── Category Filter (Raw Mono Text, No Pills) ── */}
      <nav
        aria-label="Filter kategori arsip"
        className="work-filter-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-2) var(--space-4)',
          paddingBottom: 'var(--space-6)',
          marginBottom: 'var(--space-6)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <span
          className="label"
          style={{
            fontSize: 'var(--text-xs)',
            opacity: 0.4,
            marginRight: 'var(--space-2)',
          }}
        >
          FILTER /
        </span>

        {/* 'ALL' option */}
        <button
          type="button"
          onClick={() => setSelectedCategory('ALL')}
          className="work-filter-btn label"
          style={{
            minHeight: 44,
            padding: 'var(--space-2) 0',
            color: selectedCategory === 'ALL' ? 'var(--ink)' : 'var(--fg)',
            opacity: selectedCategory === 'ALL' ? 1 : 0.6,
            textDecoration: selectedCategory === 'ALL' ? 'underline' : 'none',
            textUnderlineOffset: '6px',
            textDecorationThickness: '1px',
            letterSpacing: '0.16em',
            transition: 'opacity var(--transition-fast), color var(--transition-fast)',
            cursor: 'pointer',
          }}
          aria-pressed={selectedCategory === 'ALL'}
        >
          [ALL ({projects.length})]
        </button>

        {/* Individual categories */}
        {categories.map((cat) => {
          const count = projects.filter(
            (p) => p.category.toLowerCase() === cat.toLowerCase()
          ).length
          const isSelected = selectedCategory === cat

          return (
            <span
              key={cat}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)' }}
            >
              <span
                className="label"
                aria-hidden="true"
                style={{ opacity: 0.25, userSelect: 'none' }}
              >
                /
              </span>
              <button
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className="work-filter-btn label"
                style={{
                  minHeight: 44,
                  padding: 'var(--space-2) 0',
                  color: isSelected ? 'var(--ink)' : 'var(--fg)',
                  opacity: isSelected ? 1 : 0.6,
                  textDecoration: isSelected ? 'underline' : 'none',
                  textUnderlineOffset: '6px',
                  textDecorationThickness: '1px',
                  letterSpacing: '0.16em',
                  transition: 'opacity var(--transition-fast), color var(--transition-fast)',
                  cursor: 'pointer',
                }}
                aria-pressed={isSelected}
              >
                {cat.toUpperCase()} ({count})
              </button>
            </span>
          )
        })}
      </nav>

      {/* ── Table Results ── */}
      {filteredProjects.length > 0 ? (
        <CatalogTable projects={filteredProjects} compact={false} />
      ) : (
        <div
          style={{
            padding: 'var(--space-16) 0',
            textAlign: 'center',
            borderBottom: '1px solid var(--line)',
          }}
        >
          <p className="label" style={{ opacity: 0.5 }}>
            NO ARCHIVE ENTRIES FOUND IN THIS CATEGORY.
          </p>
        </div>
      )}
    </div>
  )
}
