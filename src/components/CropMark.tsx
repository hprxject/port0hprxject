interface CropMarkProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  size?: number   // px
  gap?: number    // px, distance from corner
  color?: string
}

/**
 * CropMark — decorative print registration mark at section corners.
 * Should be placed inside a position:relative parent.
 */
export function CropMark({
  position = 'top-left',
  size = 12,
  gap = 4,
  color = 'var(--line)',
}: CropMarkProps) {
  const isTop = position.includes('top')
  const isLeft = position.includes('left')

  const posStyle: React.CSSProperties = {
    position: 'absolute',
    [isTop ? 'top' : 'bottom']: gap,
    [isLeft ? 'left' : 'right']: gap,
    width: size,
    height: size,
    pointerEvents: 'none',
    flexShrink: 0,
  }

  // Horizontal line
  const hStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    [isLeft ? 'left' : 'right']: 0,
    width: '100%',
    height: 1,
    backgroundColor: color,
    transform: 'translateY(-50%)',
  }

  // Vertical line
  const vStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    [isTop ? 'top' : 'bottom']: 0,
    width: 1,
    height: '100%',
    backgroundColor: color,
    transform: 'translateX(-50%)',
  }

  return (
    <span
      aria-hidden="true"
      role="presentation"
      style={posStyle}
    >
      <span style={hStyle} />
      <span style={vStyle} />
    </span>
  )
}
