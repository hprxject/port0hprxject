'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface LightboxImage {
  src: string
  alt: string
}

interface ImageLightboxProps {
  images: LightboxImage[]
}

export function ImageLightbox({ images }: ImageLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [zoom, setZoom] = useState<number>(1.0)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const isDraggingRef = useRef(false)
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number }>({ x: 0, y: 0, panX: 0, panY: 0 })
  const hasMovedRef = useRef(false)
  const touchStartRef = useRef<{ x: number; y: number; panX: number; panY: number }>({ x: 0, y: 0, panX: 0, panY: 0 })
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  const activeImage = activeIndex !== null ? images[activeIndex] : null

  const handleZoomReset = useCallback(() => {
    setZoom(1.0)
    setPan({ x: 0, y: 0 })
  }, [])

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === null ? null : (prev - 1 + images.length) % images.length))
    handleZoomReset()
  }, [images.length, handleZoomReset])

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === null ? null : (prev + 1) % images.length))
    handleZoomReset()
  }, [images.length, handleZoomReset])

  // Zoom in by 50% (0.5), max 300% (3.0)
  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(3.0, +(z + 0.5).toFixed(1)))
  }, [])

  // Zoom out by 50% (0.5), min 100% (1.0)
  const handleZoomOut = useCallback(() => {
    setZoom((z) => {
      const next = Math.max(1.0, +(z - 0.5).toFixed(1))
      if (next <= 1.0) {
        setPan({ x: 0, y: 0 })
      }
      return next
    })
  }, [])

  // Drag & Pan handlers via window mouse events
  useEffect(() => {
    const onWindowMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return
      const dx = e.clientX - dragStartRef.current.x
      const dy = e.clientY - dragStartRef.current.y
      if (Math.hypot(dx, dy) > 4) {
        hasMovedRef.current = true
      }
      setPan({
        x: dragStartRef.current.panX + dx,
        y: dragStartRef.current.panY + dy,
      })
    }

    const onWindowMouseUp = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false
        setIsDragging(false)
        // Clean left click without dragging -> Zoom in by 10%
        if (e.button === 0 && !hasMovedRef.current) {
          handleZoomIn()
        }
      }
    }

    window.addEventListener('mousemove', onWindowMouseMove)
    window.addEventListener('mouseup', onWindowMouseUp)
    return () => {
      window.removeEventListener('mousemove', onWindowMouseMove)
      window.removeEventListener('mouseup', onWindowMouseUp)
    }
  }, [handleZoomIn])

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (activeIndex === null) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setActiveIndex(null)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault()
        handleZoomIn()
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault()
        handleZoomOut()
      } else if (e.key === '0') {
        e.preventDefault()
        handleZoomReset()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    closeBtnRef.current?.focus()

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeIndex, handlePrev, handleNext, handleZoomIn, handleZoomOut, handleZoomReset])

  return (
    <>
      {/* ── Single-Column Seamless Gallery (Vertical Stack with Zero Gap) ── */}
      <div
        className="project-gallery-column"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          width: '100%',
          border: '1px solid var(--line)',
          backgroundColor: 'var(--bg)',
          overflow: 'hidden',
        }}
      >
        {images.map((img, i) => (
          <figure
            key={i}
            className="project-plate-figure"
            onContextMenu={(e) => e.preventDefault()}
            style={{
              position: 'relative',
              margin: 0,
              padding: 0,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              lineHeight: 0,
              borderBottom: i < images.length - 1 ? 'none' : 'none',
              backgroundColor: 'var(--bg)',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
          >
            {/* Clickable / tappable image container */}
            <button
              type="button"
              className="project-plate-btn"
              onClick={() => {
                setActiveIndex(i)
                setZoom(1)
              }}
              onContextMenu={(e) => e.preventDefault()}
              aria-label={`Enlarge plate ${i + 1}: ${img.alt || 'Project visual'}`}
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                padding: 0,
                margin: 0,
                cursor: 'zoom-in',
                border: 'none',
                background: 'none',
                textAlign: 'center',
                overflow: 'hidden',
                lineHeight: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt || `Visual plate ${i + 1}`}
                loading={i === 0 ? 'eager' : 'lazy'}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="project-plate-img"
                style={{
                  display: 'block',
                  margin: '0 auto',
                  padding: 0,
                  verticalAlign: 'bottom',
                  backgroundColor: 'rgba(255,255,255,0.01)',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                }}
              />
            </button>
          </figure>
        ))}

        {/* Archival footer note for the seamless plate set */}
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderTop: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
            backgroundColor: 'var(--bg)',
          }}
        >
          <span className="label" style={{ fontSize: 'var(--text-xs)', opacity: 0.6 }}>
            CONTINUOUS VERTICAL SPREAD // {String(images.length).padStart(2, '0')} {images.length > 1 ? 'PLATES' : 'PLATE'}
          </span>
          <span
            className="label"
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--ink)',
              opacity: 0.8,
              userSelect: 'none',
            }}
          >
            [TAP ANY PLATE TO ENLARGE]
          </span>
        </div>
      </div>

      {/* ── Lightbox Modal (Enlarged with Navigation & Zoom) ── */}
      {activeImage && activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged image view"
          onClick={() => setActiveIndex(null)}
          onContextMenu={(e) => e.preventDefault()}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(11, 11, 12, 0.95)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 'var(--space-4)',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          {/* Top Control Bar with Plate Info, Center Helper Info, Zoom Controls & Close Button */}
          <div
            style={{
              position: 'fixed',
              top: 'max(12px, env(safe-area-inset-top))',
              left: 'max(12px, env(safe-area-inset-left))',
              right: 'max(12px, env(safe-area-inset-right))',
              zIndex: 1010,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-3)',
              flexWrap: 'wrap',
              pointerEvents: 'none',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Plate counter */}
            <div
              className="label"
              style={{
                pointerEvents: 'auto',
                backgroundColor: 'var(--bg)',
                color: 'var(--ink)',
                border: '1px solid var(--line)',
                padding: 'var(--space-2) var(--space-4)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.14em',
                flexShrink: 0,
              }}
            >
              PLATE {String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </div>

            {/* Center: Instruction / Helper note */}
            <div
              className="label"
              style={{
                pointerEvents: 'auto',
                backgroundColor: 'var(--bg)',
                color: 'var(--fg)',
                border: '1px solid var(--line)',
                padding: 'var(--space-2) var(--space-4)',
                fontSize: '11px',
                letterSpacing: '0.1em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                opacity: 0.9,
                flexShrink: 0,
              }}
            >
              <span>LEFT CLICK: ZOOM IN (+50%)</span>
              <span style={{ opacity: 0.35 }}>/</span>
              <span>RIGHT CLICK: ZOOM OUT (−50%)</span>
              <span style={{ opacity: 0.35 }}>/</span>
              <span style={{ color: 'var(--ink)' }}>HOLD & DRAG TO PAN</span>
            </div>

            {/* Right actions: Zoom In, Zoom Out, Indicator, Reset, Close */}
            <div
              style={{
                pointerEvents: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--line)',
                padding: '4px',
                flexShrink: 0,
              }}
            >
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoom <= 1.0}
                className="label"
                aria-label="Zoom out"
                style={{
                  minWidth: 36,
                  height: 36,
                  backgroundColor: 'transparent',
                  color: 'var(--fg)',
                  border: '1px solid var(--line)',
                  cursor: zoom <= 1.0 ? 'not-allowed' : 'pointer',
                  opacity: zoom <= 1.0 ? 0.35 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontFamily: 'var(--font-mono)',
                }}
                title="Zoom Out (-50%)"
              >
                −
              </button>

              <div
                className="label"
                style={{
                  minWidth: 54,
                  height: 36,
                  backgroundColor: 'transparent',
                  color: zoom > 1.0 ? 'var(--ink)' : 'var(--fg)',
                  border: '1px solid var(--line)',
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  padding: '0 8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  userSelect: 'none',
                }}
              >
                {Math.round(zoom * 100)}%
              </div>

              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoom >= 3.0}
                className="label"
                aria-label="Zoom in"
                style={{
                  minWidth: 36,
                  height: 36,
                  backgroundColor: 'transparent',
                  color: 'var(--fg)',
                  border: '1px solid var(--line)',
                  cursor: zoom >= 3.0 ? 'not-allowed' : 'pointer',
                  opacity: zoom >= 3.0 ? 0.35 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontFamily: 'var(--font-mono)',
                }}
                title="Zoom In (+50%)"
              >
                +
              </button>

              {/* Dedicated RESET Button placed right beside the ESC button */}
              <button
                type="button"
                onClick={handleZoomReset}
                disabled={zoom === 1.0 && pan.x === 0 && pan.y === 0}
                className="label"
                aria-label="Reset zoom and position"
                style={{
                  minWidth: 56,
                  height: 36,
                  backgroundColor: 'transparent',
                  color: zoom > 1.0 || pan.x !== 0 || pan.y !== 0 ? 'var(--ink)' : 'var(--fg)',
                  border: '1px solid var(--line)',
                  cursor: zoom === 1.0 && pan.x === 0 && pan.y === 0 ? 'default' : 'pointer',
                  opacity: zoom === 1.0 && pan.x === 0 && pan.y === 0 ? 0.4 : 1,
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  padding: '0 8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '2px',
                }}
                title="Reset Zoom & Pan (0)"
              >
                RESET
              </button>

              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => setActiveIndex(null)}
                className="label"
                aria-label="Close enlarged view"
                style={{
                  minWidth: 40,
                  height: 36,
                  padding: '0 12px',
                  backgroundColor: 'var(--ink)',
                  color: 'var(--bg)',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  marginLeft: '2px',
                }}
              >
                ✕ [ESC]
              </button>
            </div>
          </div>

          {/* Left Arrow Navigation Button (Previous Plate) */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handlePrev()
              }}
              className="label"
              aria-label="Previous plate (Left Arrow)"
              title="Previous Plate (←)"
              style={{
                position: 'fixed',
                left: 'max(12px, env(safe-area-inset-left))',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1020,
                minWidth: 44,
                minHeight: 48,
                backgroundColor: 'var(--bg)',
                color: 'var(--fg)',
                border: '1px solid var(--line)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                padding: '0 14px',
                transition: 'all var(--transition-fast)',
              }}
            >
              ←
            </button>
          )}

          {/* Right Arrow Navigation Button (Next Plate) */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              className="label"
              aria-label="Next plate (Right Arrow)"
              title="Next Plate (→)"
              style={{
                position: 'fixed',
                right: 'max(12px, env(safe-area-inset-right))',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1020,
                minWidth: 44,
                minHeight: 48,
                backgroundColor: 'var(--bg)',
                color: 'var(--fg)',
                border: '1px solid var(--line)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                padding: '0 14px',
                transition: 'all var(--transition-fast)',
              }}
            >
              →
            </button>
          )}

          {/* Modal Image Box with Zoom and Pan/Scroll Capability */}
          <div
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleZoomOut()
            }}
            style={{
              position: 'relative',
              maxWidth: '92vw',
              maxHeight: '82vh',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '1px solid var(--line)',
              backgroundColor: 'var(--bg)',
              overflow: 'hidden',
              marginTop: 'var(--space-12)',
            }}
          >
            <div
              onMouseDown={(e) => {
                if (e.button === 0) {
                  isDraggingRef.current = true
                  setIsDragging(true)
                  hasMovedRef.current = false
                  dragStartRef.current = {
                    x: e.clientX,
                    y: e.clientY,
                    panX: pan.x,
                    panY: pan.y,
                  }
                }
              }}
              onTouchStart={(e) => {
                if (e.touches.length === 1) {
                  const touch = e.touches[0]
                  touchStartRef.current = {
                    x: touch.clientX,
                    y: touch.clientY,
                    panX: pan.x,
                    panY: pan.y,
                  }
                }
              }}
              onTouchMove={(e) => {
                if (e.touches.length === 1 && zoom > 1.0) {
                  const touch = e.touches[0]
                  const dx = touch.clientX - touchStartRef.current.x
                  const dy = touch.clientY - touchStartRef.current.y
                  setPan({
                    x: touchStartRef.current.panX + dx,
                    y: touchStartRef.current.panY + dy,
                  })
                }
              }}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: 'calc(80vh - 48px)',
                cursor: isDragging ? 'grabbing' : (zoom > 1.0 ? 'grab' : 'zoom-in'),
                userSelect: 'none',
                WebkitUserSelect: 'none',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 120ms ease-out',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  willChange: 'transform',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeImage.src}
                  alt={activeImage.alt}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{
                    maxHeight: 'calc(76vh - 60px)',
                    maxWidth: '88vw',
                    width: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>

            {/* Bottom Caption */}
            {activeImage.alt && (
              <div
                style={{
                  width: '100%',
                  padding: 'var(--space-2) var(--space-4)',
                  borderTop: '1px solid var(--line)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--fg)',
                  opacity: 0.7,
                  letterSpacing: '0.08em',
                  textAlign: 'left',
                  backgroundColor: 'var(--bg)',
                  flexShrink: 0,
                  zIndex: 2,
                }}
              >
                {activeImage.alt}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

