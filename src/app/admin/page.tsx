'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { Route } from 'next'
import { CropMark } from '@/components/CropMark'
import { SheetLabel } from '@/components/SheetLabel'

interface ProjectImage {
  src: string
  alt: string
}

interface ProjectItem {
  index: string
  title: string
  slug: string
  category: string
  year: number
  client: string
  role?: string
  tools?: string[]
  description?: string
  featured: boolean
  cover: string
  images?: ProjectImage[]
}

interface PlateItem {
  id: string
  type: 'existing' | 'new'
  previewUrl: string
  file?: File
  alt?: string
}

export default function AdminPage() {
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('Brand Identity')
  const [year, setYear] = useState(new Date().getFullYear())
  const [client, setClient] = useState('')
  const [role, setRole] = useState('Designer, Art Director')
  const [tools, setTools] = useState('Illustrator, Figma')
  const [description, setDescription] = useState('')
  const [featured, setFeatured] = useState(true)

  // Multiple plates state
  const [plates, setPlates] = useState<PlateItem[]>([])

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successData, setSuccessData] = useState<{
    slug: string
    title: string
    action: 'created' | 'updated' | 'deleted'
    gitCommand: string
  } | null>(null)
  const [copiedGit, setCopiedGit] = useState(false)

  const [projectsList, setProjectsList] = useState<ProjectItem[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Auto-slugify when title changes in new project mode
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setTitle(val)
    if (!editingProject) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      setSlug(autoSlug)
    }
  }

  // Handle adding image files (supports multiple selection)
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      const newItems: PlateItem[] = files.map((file, idx) => ({
        id: `new-${Date.now()}-${idx}-${Math.random()}`,
        type: 'new',
        previewUrl: URL.createObjectURL(file),
        file,
        alt: `${title || 'Project'} visual plate`,
      }))
      setPlates((prev) => [...prev, ...newItems])
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Move plate position up or down
  const handleMovePlate = (index: number, direction: 'up' | 'down') => {
    setPlates((prev) => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1
      if (targetIndex < 0 || targetIndex >= prev.length) return prev
      const copy = [...prev]
      const temp = copy[index]
      copy[index] = copy[targetIndex]
      copy[targetIndex] = temp
      return copy
    })
  }

  // Remove a single plate
  const handleRemovePlate = (index: number) => {
    setPlates((prev) => prev.filter((_, i) => i !== index))
  }

  // Load existing projects list
  const loadProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects')
      const data = await res.json()
      if (data.success && data.projects) {
        setProjectsList(data.projects)
      }
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  // Start editing an existing project
  const handleStartEdit = (p: ProjectItem) => {
    setEditingProject(p)
    setTitle(p.title)
    setSlug(p.slug)
    setCategory(p.category)
    setYear(p.year || new Date().getFullYear())
    setClient(p.client || '')
    setRole(p.role || 'Designer, Art Director')
    setTools(p.tools ? p.tools.join(', ') : 'Illustrator, Figma')
    setDescription(p.description || '')
    setFeatured(Boolean(p.featured))

    const projectImages = p.images && p.images.length > 0
      ? p.images
      : p.cover
      ? [{ src: p.cover, alt: `${p.title} visual plate` }]
      : []

    setPlates(
      projectImages.map((img, i) => ({
        id: `existing-${i}-${img.src}`,
        type: 'existing',
        previewUrl: img.src,
        alt: img.alt,
      }))
    )

    setErrorMsg('')
    setSuccessData(null)

    // Scroll smoothly to form
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditingProject(null)
    setTitle('')
    setSlug('')
    setDescription('')
    setClient('')
    setRole('Designer, Art Director')
    setTools('Illustrator, Figma')
    setFeatured(true)
    setPlates([])
    if (fileInputRef.current) fileInputRef.current.value = ''
    setErrorMsg('')
  }

  // Submit project form (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessData(null)

    if (!title.trim()) {
      setErrorMsg('Judul proyek wajib diisi.')
      return
    }

    setLoading(true)

    try {
      const fd = new FormData()
      fd.append('title', title)
      fd.append('slug', slug)
      fd.append('category', category)
      fd.append('year', String(year))
      fd.append('client', client)
      fd.append('role', role)
      fd.append('tools', tools)
      fd.append('description', description)
      fd.append('featured', String(featured))

      // Append plates manifest and file payloads
      const manifest = plates.map((pl) => ({
        type: pl.type,
        src: pl.type === 'existing' ? pl.previewUrl : undefined,
        alt: pl.alt || '',
      }))
      fd.append('platesManifest', JSON.stringify(manifest))

      plates.forEach((pl) => {
        if (pl.type === 'new' && pl.file) {
          fd.append('images', pl.file)
        }
      })

      const isEdit = Boolean(editingProject)
      if (isEdit && editingProject) {
        fd.append('originalSlug', editingProject.slug)
      }

      const res = await fetch('/api/admin/projects', {
        method: isEdit ? 'PUT' : 'POST',
        body: fd,
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal menyimpan proyek.')
      }

      setSuccessData({
        slug: json.slug,
        title,
        action: isEdit ? 'updated' : 'created',
        gitCommand: json.gitCommand,
      })

      // Reset form
      handleCancelEdit()

      // Refresh list
      loadProjects()
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.')
    } finally {
      setLoading(false)
    }
  }

  // Delete project
  const handleDelete = async (p: ProjectItem) => {
    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus arsip projek "${p.title}"?`)
    if (!confirmed) return

    setLoading(true)
    setErrorMsg('')

    try {
      const res = await fetch(`/api/admin/projects?slug=${encodeURIComponent(p.slug)}`, {
        method: 'DELETE',
      })
      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal menghapus proyek.')
      }

      setSuccessData({
        slug: p.slug,
        title: p.title,
        action: 'deleted',
        gitCommand: json.gitCommand,
      })

      if (editingProject?.slug === p.slug) {
        handleCancelEdit()
      }

      loadProjects()
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menghapus proyek.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyGit = async () => {
    if (successData?.gitCommand) {
      await navigator.clipboard.writeText(successData.gitCommand)
      setCopiedGit(true)
      setTimeout(() => setCopiedGit(false), 2400)
    }
  }

  return (
    <div style={{ position: 'relative', backgroundColor: 'var(--bg)', minHeight: '100dvh' }}>
      <main
        className="container"
        style={{
          position: 'relative',
          paddingTop: 'var(--space-12)',
          paddingBottom: 'var(--space-24)',
        }}
      >
        {/* Archival Crop Marks */}
        <CropMark position="top-left" gap={12} />
        <CropMark position="top-right" gap={12} />

        {/* Top Sheet Header */}
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
          <SheetLabel current={0} total={projectsList.length} label="LOCAL ARCHIVE INTAKE & REVISION" />
          <Link
            href={'/' as Route}
            className="label"
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--ink)',
              letterSpacing: '0.14em',
              textDecoration: 'none',
            }}
          >
            ← VIEW ARCHIVE SITE
          </Link>
        </div>

        {/* Console Header */}
        <header style={{ marginBottom: 'var(--space-12)' }}>
          <h1
            className="hero-name"
            data-text="Intake"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              lineHeight: 0.95,
              marginBottom: 'var(--space-4)',
            }}
          >
            Intake
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              maxWidth: '58ch',
              lineHeight: 1.45,
              opacity: 0.85,
            }}
          >
            Local editorial terminal. Input new specimens or select an existing project below to
            revise its title, specs, description, or imagery.
          </p>
        </header>

        {/* Success Alert & Git Sync Box */}
        {successData && (
          <div
            style={{
              border: '1px solid var(--ink)',
              padding: 'var(--space-6)',
              marginBottom: 'var(--space-12)',
              backgroundColor: 'rgba(28, 129, 218, 0.08)',
            }}
          >
            <div
              className="label"
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--ink)',
                marginBottom: 'var(--space-2)',
                letterSpacing: '0.14em',
              }}
            >
              {successData.action === 'updated' && `✓ SPECIMEN REVISED & UPDATED`}
              {successData.action === 'created' && `✓ NEW SPECIMEN RECORDED`}
              {successData.action === 'deleted' && `✓ SPECIMEN REMOVED FROM ARCHIVE`}
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                margin: 0,
                marginBottom: 'var(--space-4)',
              }}
            >
              Proyek <strong>&ldquo;{successData.title}&rdquo;</strong>{' '}
              {successData.action === 'updated' ? 'berhasil diperbarui.' : successData.action === 'deleted' ? 'telah dihapus dari arsip lokal.' : 'berhasil dibuat.'}
            </p>

            {successData.action !== 'deleted' && (
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
                <Link
                  href={`/work/${successData.slug}` as Route}
                  target="_blank"
                  className="label"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: 'var(--space-2) var(--space-4)',
                    backgroundColor: 'var(--ink)',
                    color: 'var(--bg)',
                    textDecoration: 'none',
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.12em',
                  }}
                >
                  PREVIEW PROJECT PLATE ↗
                </Link>
                <Link
                  href={'/work' as Route}
                  target="_blank"
                  className="label"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: 'var(--space-2) var(--space-4)',
                    border: '1px solid var(--line)',
                    color: 'var(--fg)',
                    textDecoration: 'none',
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.12em',
                  }}
                >
                  OPEN WORK ARCHIVE ↗
                </Link>
              </div>
            )}

            {/* Quick Git Push Command */}
            <div
              style={{
                borderTop: '1px solid var(--line)',
                paddingTop: 'var(--space-3)',
                marginTop: 'var(--space-3)',
              }}
            >
              <span className="label" style={{ fontSize: '10px', opacity: 0.6, display: 'block', marginBottom: 4 }}>
                PERINTAH SYNC KE GITHUB & VERCEL:
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--line)',
                  padding: 'var(--space-2) var(--space-4)',
                  gap: 'var(--space-4)',
                }}
              >
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink)' }}>
                  {successData.gitCommand}
                </code>
                <button
                  type="button"
                  onClick={handleCopyGit}
                  className="label"
                  style={{
                    backgroundColor: copiedGit ? 'var(--ink)' : 'transparent',
                    color: copiedGit ? 'var(--bg)' : 'var(--fg)',
                    border: '1px solid var(--line)',
                    padding: '4px 10px',
                    fontSize: '10px',
                    cursor: 'pointer',
                    letterSpacing: '0.1em',
                  }}
                >
                  {copiedGit ? 'COPIED!' : 'COPY'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div
            style={{
              border: '1px solid #ff4d4f',
              padding: 'var(--space-4)',
              marginBottom: 'var(--space-8)',
              color: '#ff4d4f',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.08em',
            }}
          >
            ERROR // {errorMsg}
          </div>
        )}

        {/* ── Main Intake & Revision Form ── */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          style={{
            border: editingProject ? '1px solid var(--ink)' : '1px solid var(--line)',
            padding: 'var(--space-8)',
            marginBottom: 'var(--space-16)',
            backgroundColor: 'var(--bg)',
            transition: 'border-color var(--transition-fast)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-6)',
              paddingBottom: 'var(--space-3)',
              borderBottom: '1px solid var(--line)',
            }}
          >
            <div
              className="label"
              style={{
                fontSize: 'var(--text-xs)',
                color: editingProject ? 'var(--ink)' : 'var(--fg)',
                letterSpacing: '0.14em',
              }}
            >
              {editingProject
                ? `REVISI ARSIP // [${editingProject.index} — ${editingProject.title.toUpperCase()}]`
                : 'SPECIFICATION FIELDS // ENTRY FORM'}
            </div>

            {editingProject && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="label"
                style={{
                  fontSize: '10px',
                  color: 'var(--fg)',
                  opacity: 0.6,
                  border: '1px solid var(--line)',
                  padding: '4px 10px',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  letterSpacing: '0.1em',
                }}
              >
                [BATAL EDIT]
              </button>
            )}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-6)',
              marginBottom: 'var(--space-6)',
            }}
          >
            {/* Title */}
            <div>
              <label
                htmlFor="proj-title"
                className="label"
                style={{ display: 'block', fontSize: 'var(--text-xs)', opacity: 0.6, marginBottom: 'var(--space-2)' }}
              >
                PROJECT TITLE *
              </label>
              <input
                id="proj-title"
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Neon Roots"
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  border: '1px solid var(--line)',
                  backgroundColor: 'transparent',
                  color: 'var(--fg)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none',
                }}
              />
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="proj-slug"
                className="label"
                style={{ display: 'block', fontSize: 'var(--text-xs)', opacity: 0.6, marginBottom: 'var(--space-2)' }}
              >
                URL SLUG
              </label>
              <input
                id="proj-slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. neon-roots"
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  border: '1px solid var(--line)',
                  backgroundColor: 'transparent',
                  color: 'var(--fg)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none',
                }}
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="proj-cat"
                className="label"
                style={{ display: 'block', fontSize: 'var(--text-xs)', opacity: 0.6, marginBottom: 'var(--space-2)' }}
              >
                DISCIPLINE / CATEGORY
              </label>
              <select
                id="proj-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  border: '1px solid var(--line)',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--fg)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none',
                }}
              >
                <option value="Brand Identity">Brand Identity</option>
                <option value="Poster Systems">Poster Systems</option>
                <option value="Packaging">Packaging</option>
                <option value="Art Direction">Art Direction</option>
                <option value="Editorial Design">Editorial Design</option>
                <option value="Publication">Publication</option>
              </select>
            </div>

            {/* Year */}
            <div>
              <label
                htmlFor="proj-year"
                className="label"
                style={{ display: 'block', fontSize: 'var(--text-xs)', opacity: 0.6, marginBottom: 'var(--space-2)' }}
              >
                YEAR
              </label>
              <input
                id="proj-year"
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10))}
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  border: '1px solid var(--line)',
                  backgroundColor: 'transparent',
                  color: 'var(--fg)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none',
                }}
              />
            </div>

            {/* Client */}
            <div>
              <label
                htmlFor="proj-client"
                className="label"
                style={{ display: 'block', fontSize: 'var(--text-xs)', opacity: 0.6, marginBottom: 'var(--space-2)' }}
              >
                CLIENT
              </label>
              <input
                id="proj-client"
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="e.g. Studio Neon"
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  border: '1px solid var(--line)',
                  backgroundColor: 'transparent',
                  color: 'var(--fg)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none',
                }}
              />
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="proj-role"
                className="label"
                style={{ display: 'block', fontSize: 'var(--text-xs)', opacity: 0.6, marginBottom: 'var(--space-2)' }}
              >
                ROLE
              </label>
              <input
                id="proj-role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Lead Designer, Art Director"
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  border: '1px solid var(--line)',
                  backgroundColor: 'transparent',
                  color: 'var(--fg)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Tools */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <label
              htmlFor="proj-tools"
              className="label"
              style={{ display: 'block', fontSize: 'var(--text-xs)', opacity: 0.6, marginBottom: 'var(--space-2)' }}
            >
              TOOLS (PISAHKAN DENGAN KOMA)
            </label>
            <input
              id="proj-tools"
              type="text"
              value={tools}
              onChange={(e) => setTools(e.target.value)}
              placeholder="e.g. Illustrator, Figma, InDesign, Blender"
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                border: '1px solid var(--line)',
                backgroundColor: 'transparent',
                color: 'var(--fg)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
                outline: 'none',
              }}
            />
          </div>

          {/* Visual Plates (Multiple Images Vertical Continuous Stack) */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginBottom: 'var(--space-2)',
                flexWrap: 'wrap',
                gap: 'var(--space-2)',
              }}
            >
              <label
                htmlFor="proj-image"
                className="label"
                style={{ fontSize: 'var(--text-xs)', opacity: 0.6 }}
              >
                VISUAL PLATES (DISUSUN VERTIKAL TANPA GAP // CONTINUOUS SPREAD)
              </label>
              <span className="label" style={{ fontSize: '10px', color: 'var(--ink)' }}>
                {plates.length} {plates.length === 1 ? 'PLATE TERPILIH' : 'PLATES TERPILIH'}
              </span>
            </div>

            <input
              ref={fileInputRef}
              id="proj-image"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesSelected}
              style={{ display: 'none' }}
            />

            {/* If plates exist, display ordered plates manager */}
            {plates.length > 0 ? (
              <div
                style={{
                  border: '1px solid var(--line)',
                  padding: 'var(--space-4)',
                  backgroundColor: 'rgba(255, 255, 255, 0.01)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                  {plates.map((plate, idx) => (
                    <div
                      key={plate.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(70px, 90px) minmax(80px, 110px) 1fr auto',
                        alignItems: 'center',
                        gap: 'var(--space-4)',
                        padding: 'var(--space-2) var(--space-3)',
                        border: '1px solid var(--line)',
                        backgroundColor: idx === 0 ? 'rgba(28, 129, 218, 0.06)' : 'var(--bg)',
                      }}
                    >
                      {/* Plate Label */}
                      <span className="label" style={{ fontSize: '10px', color: idx === 0 ? 'var(--ink)' : 'var(--fg)', opacity: idx === 0 ? 1 : 0.7 }}>
                        {idx === 0 ? 'PLATE 01 (COVER)' : `PLATE ${String(idx + 1).padStart(2, '0')}`}
                      </span>

                      {/* Thumbnail Preview */}
                      <div
                        style={{
                          width: '100%',
                          height: 64,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid var(--line)',
                          backgroundColor: '#000',
                          overflow: 'hidden',
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={plate.previewUrl}
                          alt={`Plate ${idx + 1}`}
                          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                        />
                      </div>

                      {/* Tag info */}
                      <span className="label" style={{ fontSize: '10px', opacity: 0.5 }}>
                        {plate.type === 'existing' ? '[EXISTING PLATE]' : '[NEW UPLOAD]'}
                      </span>

                      {/* Reorder & Delete Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <button
                          type="button"
                          onClick={() => handleMovePlate(idx, 'up')}
                          disabled={idx === 0}
                          className="label"
                          style={{
                            padding: '4px 8px',
                            border: '1px solid var(--line)',
                            backgroundColor: 'transparent',
                            color: 'var(--fg)',
                            cursor: idx === 0 ? 'not-allowed' : 'pointer',
                            opacity: idx === 0 ? 0.3 : 1,
                            fontSize: '10px',
                          }}
                          title="Pindah ke atas"
                        >
                          ▲ NAIK
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMovePlate(idx, 'down')}
                          disabled={idx === plates.length - 1}
                          className="label"
                          style={{
                            padding: '4px 8px',
                            border: '1px solid var(--line)',
                            backgroundColor: 'transparent',
                            color: 'var(--fg)',
                            cursor: idx === plates.length - 1 ? 'not-allowed' : 'pointer',
                            opacity: idx === plates.length - 1 ? 0.3 : 1,
                            fontSize: '10px',
                          }}
                          title="Pindah ke bawah"
                        >
                          ▼ TURUN
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemovePlate(idx)}
                          className="label"
                          style={{
                            padding: '4px 8px',
                            border: '1px solid rgba(255, 77, 79, 0.4)',
                            backgroundColor: 'transparent',
                            color: '#ff4d4f',
                            cursor: 'pointer',
                            fontSize: '10px',
                          }}
                          title="Hapus gambar ini"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add more files button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="label"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-2) var(--space-4)',
                    border: '1px dashed var(--ink)',
                    backgroundColor: 'transparent',
                    color: 'var(--ink)',
                    fontSize: 'var(--text-xs)',
                    cursor: 'pointer',
                    letterSpacing: '0.12em',
                  }}
                >
                  + TAMBAH GAMBAR LAINNYA
                </button>
              </div>
            ) : (
              /* Dropzone button when no plates are selected yet */
              <div
                style={{
                  border: '1px dashed var(--line)',
                  padding: 'var(--space-8) var(--space-6)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.01)',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <span
                  className="label"
                  style={{
                    display: 'block',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--ink)',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  + PILIH GAMBAR DARI KOMPUTER (BISA PILIH BANYAK SEKALIGUS)
                </span>
                <span className="label" style={{ fontSize: '10px', opacity: 0.5 }}>
                  Mendukung JPG, PNG, WebP, SVG. Gambar akan disusun vertikal bersambung tanpa gap.
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <label
              htmlFor="proj-desc"
              className="label"
              style={{ display: 'block', fontSize: 'var(--text-xs)', opacity: 0.6, marginBottom: 'var(--space-2)' }}
            >
              PROJECT DESCRIPTION
            </label>
            <textarea
              id="proj-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat proyek dan pendekatan visual desain..."
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                border: '1px solid var(--line)',
                backgroundColor: 'transparent',
                color: 'var(--fg)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Featured Toggle */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: 'var(--ink)' }}
              />
              <span className="label" style={{ fontSize: 'var(--text-xs)', opacity: 0.85 }}>
                TAMPILKAN DI FEATURED CAROUSEL / OVERVIEW
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="submit"
              disabled={loading}
              className="label"
              style={{
                minHeight: 48,
                padding: 'var(--space-3) var(--space-8)',
                backgroundColor: 'var(--ink)',
                color: 'var(--bg)',
                border: 'none',
                cursor: loading ? 'wait' : 'pointer',
                fontSize: 'var(--text-sm)',
                letterSpacing: '0.16em',
                transition: 'opacity var(--transition-fast)',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? 'SAVING SPECIMEN...'
                : editingProject
                ? '[UPDATE PERUBAHAN ARSIP]'
                : '[SUBMIT SPECIMEN TO ARCHIVE]'}
            </button>

            {editingProject && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="label"
                style={{
                  minHeight: 48,
                  padding: 'var(--space-3) var(--space-6)',
                  border: '1px solid var(--line)',
                  backgroundColor: 'transparent',
                  color: 'var(--fg)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-xs)',
                  letterSpacing: '0.14em',
                }}
              >
                BATAL
              </button>
            )}
          </div>
        </form>

        {/* ── Registered Projects Table with Edit & Delete Controls ── */}
        <section aria-label="Existing Archive Records">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-4)',
              paddingBottom: 'var(--space-3)',
              borderBottom: '1px solid var(--line)',
            }}
          >
            <span className="label" style={{ fontSize: 'var(--text-xs)', opacity: 0.5 }}>
              EXISTING ARCHIVE RECORDS [{String(projectsList.length).padStart(2, '0')}]
            </span>
            <span className="label" style={{ fontSize: 'var(--text-xs)', color: 'var(--ink)' }}>
              CLICK [EDIT] TO REVISE
            </span>
          </div>

          <div style={{ border: '1px solid var(--line)' }}>
            {projectsList.map((p, idx) => (
              <div
                key={p.slug}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(40px, 56px) 1fr minmax(100px, 160px) minmax(50px, 70px) auto',
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                  padding: 'var(--space-3) var(--space-4)',
                  borderBottom: idx < projectsList.length - 1 ? '1px solid var(--line)' : 'none',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: editingProject?.slug === p.slug ? 'rgba(28, 129, 218, 0.08)' : 'transparent',
                }}
              >
                <span style={{ color: 'var(--ink)' }}>{p.index}</span>
                <span style={{ color: 'var(--fg)', fontWeight: 500 }}>
                  {p.title}
                  {p.featured && (
                    <span style={{ marginLeft: 8, fontSize: 9, color: 'var(--ink)', opacity: 0.8 }}>
                      [FEATURED]
                    </span>
                  )}
                </span>
                <span style={{ opacity: 0.6 }}>{p.category}</span>
                <span style={{ opacity: 0.6 }}>{p.year}</span>

                {/* Actions: Edit, Delete, View */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <button
                    type="button"
                    onClick={() => handleStartEdit(p)}
                    className="label"
                    style={{
                      border: '1px solid var(--line)',
                      padding: '4px 8px',
                      backgroundColor: editingProject?.slug === p.slug ? 'var(--ink)' : 'transparent',
                      color: editingProject?.slug === p.slug ? 'var(--bg)' : 'var(--fg)',
                      cursor: 'pointer',
                      fontSize: '10px',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {editingProject?.slug === p.slug ? 'EDITING...' : 'EDIT'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(p)}
                    className="label"
                    style={{
                      border: '1px solid rgba(255, 77, 79, 0.4)',
                      padding: '4px 8px',
                      backgroundColor: 'transparent',
                      color: '#ff4d4f',
                      cursor: 'pointer',
                      fontSize: '10px',
                      letterSpacing: '0.1em',
                    }}
                  >
                    DEL
                  </button>

                  <Link
                    href={`/work/${p.slug}` as Route}
                    target="_blank"
                    className="label"
                    style={{
                      color: 'var(--ink)',
                      textDecoration: 'none',
                      fontSize: '10px',
                      letterSpacing: '0.1em',
                      padding: '4px 4px',
                    }}
                  >
                    VIEW ↗
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Crop Marks */}
        <CropMark position="bottom-left" gap={12} />
        <CropMark position="bottom-right" gap={12} />
      </main>
    </div>
  )
}
