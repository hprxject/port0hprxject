import Link from 'next/link'
import { CropMark } from '@/components/CropMark'
import { SheetLabel } from '@/components/SheetLabel'

export default function NotFound() {
  return (
    <div
      className="container"
      style={{
        minHeight: '60dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        padding: 'var(--space-24) var(--gutter)',
      }}
    >
      <CropMark position="top-left" gap={16} />
      <CropMark position="top-right" gap={16} />

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <SheetLabel current={0} total={0} label="404 // SPECIMEN UNRECORDED" />
      </div>

      <h1
        className="hero-name"
        data-text="404"
        style={{
          fontSize: 'clamp(4rem, 15vw, 10rem)',
          lineHeight: 0.9,
          marginBottom: 'var(--space-6)',
        }}
      >
        404
      </h1>

      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-sm)',
          opacity: 0.7,
          marginBottom: 'var(--space-8)',
          maxWidth: '48ch',
          letterSpacing: '0.04em',
        }}
      >
        ERR: SPECIMEN NOT FOUND IN ARCHIVE REGISTRY. THE REQUESTED PLATE DOES NOT
        EXIST OR HAS BEEN RETRACTED.
      </p>

      <div>
        <Link
          href="/"
          className="btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            textDecoration: 'none',
          }}
        >
          ← RETURN TO ARCHIVE OVERVIEW
        </Link>
      </div>

      <CropMark position="bottom-left" gap={16} />
      <CropMark position="bottom-right" gap={16} />
    </div>
  )
}
