'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import type { ProjectWithIndex } from '@/lib/content'
import { useScrambleText } from './ScrambleTitle'

interface HeroProjectCardsProps {
  projects: ProjectWithIndex[]
}

export function HeroProjectCards({ projects }: HeroProjectCardsProps) {
  const items = projects.slice(0, 5)
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)
  const { displayText: scrambleBrand, elementRef: brandRef } = useScrambleText('HPRXJECT', { speed: 38 })

  // Duplicate items enough for seamless loop (need at least 3x for smooth visual)
  const loopItems = [...items, ...items, ...items]

  if (!items || items.length === 0) return null

  return (
    <div
      className="hero-stage"
      aria-label="Archive Projects Showcase"
    >
      {/* Top archival metadata strip */}
      <div className="hero-cards-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span
            style={{ display: 'inline-block', width: 6, height: 6, backgroundColor: 'var(--ink)' }}
            aria-hidden="true"
          />
          <span className="label" style={{ fontSize: 'var(--text-xs)', color: 'var(--ink)', letterSpacing: '0.14em' }}>
            ARCHIVE SHOWCASE // RECENT PLATES
          </span>
        </div>
        <span className="label" style={{ fontSize: 'var(--text-xs)', opacity: 0.45, letterSpacing: '0.12em' }}>
          {`${String(items.length).padStart(2, '0')} SPECIMENS`}
        </span>
      </div>

      {/* Continuous scrolling cards track */}
      <div className="hero-scroll-viewport">
        {/* HPRXJECT overlay — centered inside cards track, fades when card is hovered */}
        <div
          ref={brandRef}
          className={`hero-stage-brand-overlay${hoveredSlug ? ' is-faded' : ''}`}
          aria-hidden="true"
        >
          {scrambleBrand.split('').map((char, i) => (
            <span key={i} className="hero-overlay-char">{char}</span>
          ))}
        </div>

        <div className={`hero-scroll-track${hoveredSlug ? ' is-hovered' : ''}`}>
          {loopItems.map((project, idx) => {
            const isThisHovered = hoveredSlug === project.slug + '-' + idx

            return (
              <Link
                key={`${project.slug}-${idx}`}
                href={`/work/${project.slug}`}
                className={`hero-scroll-card${isThisHovered ? ' is-highlighted' : hoveredSlug ? ' is-dimmed' : ''}`}
                onMouseEnter={() => setHoveredSlug(project.slug + '-' + idx)}
                onMouseLeave={() => setHoveredSlug(null)}
                aria-label={`View project: ${project.title}`}
              >
                {/* Card image */}
                <div className="hero-scroll-card-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.cover}
                    alt={project.title}
                    className="hero-scroll-card-img"
                    loading="lazy"
                  />
                  <div className="hero-scroll-card-tint" aria-hidden="true" />
                </div>

                {/* Index tag */}
                <div className="hero-card-tag label">
                  <span>{project.index}</span>
                  <span>{`/ ${project.category.toUpperCase()}`}</span>
                </div>

                {/* Hover popup */}
                <div className="hero-scroll-card-popup" aria-hidden="true">
                  <span className="label" style={{ fontSize: 9, color: 'var(--ink)', letterSpacing: '0.15em', display: 'block', marginBottom: 4 }}>
                    {`SPECIMEN ${project.index} // ${project.year}`}
                  </span>
                  <h3 className="hero-card-popup-title">{project.title}</h3>
                  <div className="hero-card-popup-cta label">
                    VIEW SPECIMEN ↗
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
