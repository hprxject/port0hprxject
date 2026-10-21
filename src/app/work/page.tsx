import type { Metadata } from 'next'
import { getAllProjects, getAllCategories } from '@/lib/content'
import { WorkCatalog } from '@/components/WorkCatalog'
import { CropMark } from '@/components/CropMark'
import { SheetLabel } from '@/components/SheetLabel'
import { ScrambleTitle } from '@/components/ScrambleTitle'

export const metadata: Metadata = {
  title: 'Work Archive — Hprxject',
  description: 'Complete archival index of graphic design projects, brand identities, and editorial print systems.',
}

export default function WorkPage() {
  const allProjects = getAllProjects()
  const categories = getAllCategories()

  return (
    <div style={{ position: 'relative' }}>
      <section
        className="container"
        aria-label="Archive Catalog"
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
          <SheetLabel current={2} total={3} label="COMPLETE ARCHIVE" />
          <span
            className="label"
            style={{ fontSize: 'var(--text-xs)', opacity: 0.4 }}
          >
            INDEX: 001—{String(allProjects.length).padStart(3, '0')}
          </span>
        </div>

        {/* Page Title with Subtle Misregistration */}
        <header style={{ marginBottom: 'var(--space-12)' }}>
          <ScrambleTitle
            text="Archive"
            as="h1"
            style={{
              fontSize: 'clamp(2.75rem, 8vw, 6.5rem)',
              marginBottom: 'var(--space-4)',
              lineHeight: 0.95,
            }}
          />
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
              opacity: 0.75,
              maxWidth: '46ch',
            }}
          >
            A chronological register of commissioned and exploratory graphic work,
            editorial publications, and visual identities.
          </p>
        </header>

        {/* Catalog Table with Mono Text Filter */}
        <WorkCatalog projects={allProjects} categories={categories} />

        {/* Bottom registration code */}
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
          <span className="label" style={{ opacity: 0.4, fontSize: 'var(--text-xs)' }}>
            REG-CATALOG / {new Date().getFullYear()}
          </span>
          <span className="label" style={{ opacity: 0.4, fontSize: 'var(--text-xs)' }}>
            TOTAL ENTRIES: {allProjects.length}
          </span>
        </div>

        {/* Bottom crop marks */}
        <CropMark position="bottom-left" gap={12} />
        <CropMark position="bottom-right" gap={12} />
      </section>
    </div>
  )
}
