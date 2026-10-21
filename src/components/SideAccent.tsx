'use client'

/**
 * SideAccent — Futuristic archive pattern bars on left & right edges.
 * Contains repeating archival glyphs, registration codes, tick marks,
 * and micro-text that scroll continuously from bottom → top (looping).
 * z-index 10000 places them above header, footer, grain, everything.
 */
export function SideAccent() {
  // Archival pattern items — repeated vertically in the strip
  const glyphs = [
    '▪', '┃', '◆', '─', '▪', '┃', '▫', '─',
    '◇', '┃', '▪', '─', '◆', '┃', '▫', '─',
  ]

  const codes = [
    'BIA', '001', 'REG', '▪▪', 'ARC', '002',
    'INK', '▪▫', 'SYS', '003', 'MOD', '▪▪',
    'IDX', '004', 'RIS', '▫▪', 'GRD', '005',
    'TYP', '▪▪', 'PRN', '006', 'CAT', '▫▫',
  ]

  // Build a single "strip" of pattern content
  // We render it twice inside the scrolling container for seamless loop
  const stripContent = (
    <div className="side-accent__strip">
      {codes.map((code, i) => (
        <div key={i} className="side-accent__cell">
          <span className="side-accent__glyph">{glyphs[i % glyphs.length]}</span>
          <span className="side-accent__code">{code}</span>
          <span className="side-accent__tick">{'│'}</span>
        </div>
      ))}
    </div>
  )

  return (
    <>
      {/* Left accent */}
      <div className="side-accent side-accent--left" aria-hidden="true">
        <div className="side-accent__scroll">
          {stripContent}
          {stripContent}
        </div>
      </div>

      {/* Right accent */}
      <div className="side-accent side-accent--right" aria-hidden="true">
        <div className="side-accent__scroll">
          {stripContent}
          {stripContent}
        </div>
      </div>
    </>
  )
}
