interface SheetLabelProps {
  current: number
  total: number
  /** Optional additional text, e.g. "ARSIP" or section title */
  label?: string
}

/**
 * SheetLabel — archival print label: "SHEET 01/05"
 * Renders as a mono label, typically placed in section headers.
 */
export function SheetLabel({ current, total, label }: SheetLabelProps) {
  const currentStr = String(current).padStart(2, '0')
  const totalStr = String(total).padStart(2, '0')

  return (
    <span
      className="label"
      aria-label={`Lembar ${current} dari ${total}${label ? ` — ${label}` : ''}`}
      style={{
        fontSize: 'var(--text-xs)',
        letterSpacing: '0.18em',
        opacity: 0.45,
        userSelect: 'none',
      }}
    >
      SHEET {currentStr}/{totalStr}
      {label && (
        <>
          {' '}
          <span style={{ opacity: 0.6 }}>/ {label}</span>
        </>
      )}
    </span>
  )
}
