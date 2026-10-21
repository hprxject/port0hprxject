import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getAllProjects } from '@/lib/content'

const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects')

export async function GET() {
  try {
    const projects = getAllProjects()
    return NextResponse.json({ success: true, projects })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const title = (formData.get('title') as string || '').trim()
    let slug = (formData.get('slug') as string || '').trim().toLowerCase()
    const category = (formData.get('category') as string || '').trim()
    const year = parseInt(formData.get('year') as string || `${new Date().getFullYear()}`, 10)
    const client = (formData.get('client') as string || '').trim()
    const role = (formData.get('role') as string || '').trim()
    const toolsRaw = (formData.get('tools') as string || '').trim()
    const description = (formData.get('description') as string || '').trim()
    const featured = formData.get('featured') === 'true'
    const imageFile = formData.get('image') as File | null

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Judul proyek wajib diisi.' },
        { status: 400 }
      )
    }

    // Auto-generate slug if not provided
    if (!slug) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    }

    if (!slug) {
      slug = `project-${Date.now()}`
    }

    const tools = toolsRaw
      ? toolsRaw.split(',').map((t) => t.trim()).filter(Boolean)
      : []

    // Process uploaded images & plates
    const publicProjectDir = path.join(process.cwd(), 'public', 'projects', slug)
    if (!fs.existsSync(publicProjectDir)) {
      fs.mkdirSync(publicProjectDir, { recursive: true })
    }

    const platesManifestRaw = formData.get('platesManifest') as string | null
    const uploadedFiles = formData.getAll('images') as File[]
    const singleFile = formData.get('image') as File | null
    if (singleFile && singleFile.size > 0 && uploadedFiles.length === 0) {
      uploadedFiles.push(singleFile)
    }

    const finalImages: Array<{ src: string; alt: string }> = []

    if (platesManifestRaw) {
      try {
        const manifest = JSON.parse(platesManifestRaw) as Array<{ type: 'existing' | 'new'; src?: string; alt?: string }>
        let newFileIndex = 0
        let plateCounter = 1

        for (const item of manifest) {
          if (item.type === 'new' && newFileIndex < uploadedFiles.length) {
            const file = uploadedFiles[newFileIndex++]
            if (file && file.size > 0) {
              const bytes = await file.arrayBuffer()
              const buffer = Buffer.from(bytes)
              const ext = path.extname(file.name) || '.jpg'
              const filename = `plate-${String(plateCounter).padStart(2, '0')}${ext}`
              const targetFilePath = path.join(publicProjectDir, filename)
              fs.writeFileSync(targetFilePath, buffer)
              finalImages.push({
                src: `/projects/${slug}/${filename}`,
                alt: `${title} visual plate ${plateCounter}`,
              })
              plateCounter++
            }
          }
        }
      } catch {
        // fallback below
      }
    }

    if (finalImages.length === 0 && uploadedFiles.length > 0) {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i]
        if (file && file.size > 0) {
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)
          const ext = path.extname(file.name) || '.jpg'
          const filename = `plate-${String(i + 1).padStart(2, '0')}${ext}`
          const targetFilePath = path.join(publicProjectDir, filename)
          fs.writeFileSync(targetFilePath, buffer)
          finalImages.push({
            src: `/projects/${slug}/${filename}`,
            alt: `${title} visual plate ${i + 1}`,
          })
        }
      }
    }

    if (finalImages.length === 0) {
      finalImages.push({
        src: '/projects/brand-identity/cover.svg',
        alt: `${title} visual plate`,
      })
    }

    const coverPath = finalImages[0]?.src || '/projects/brand-identity/cover.svg'

    // Determine order
    const existing = getAllProjects()
    const nextOrder = existing.length + 1
    const paddedOrder = String(nextOrder).padStart(3, '0')

    const projectData = {
      title,
      slug,
      category: category || 'Graphic Design',
      year: isNaN(year) ? new Date().getFullYear() : year,
      client: client || '',
      role: role || '',
      tools,
      cover: coverPath,
      images: finalImages,
      description: description || '',
      featured,
      order: nextOrder,
    }

    if (!fs.existsSync(PROJECTS_DIR)) {
      fs.mkdirSync(PROJECTS_DIR, { recursive: true })
    }

    const jsonFilename = `${paddedOrder}-${slug}.json`
    const jsonFilePath = path.join(PROJECTS_DIR, jsonFilename)

    fs.writeFileSync(jsonFilePath, JSON.stringify(projectData, null, 2), 'utf-8')

    return NextResponse.json({
      success: true,
      slug,
      filename: jsonFilename,
      project: projectData,
      gitCommand: `git add . && git commit -m "add project: ${title}" && git push`,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menyimpan proyek.' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData()
    const originalSlug = (formData.get('originalSlug') as string || '').trim()

    if (!originalSlug) {
      return NextResponse.json(
        { success: false, error: 'originalSlug diperlukan untuk merevisi proyek.' },
        { status: 400 }
      )
    }

    // Find existing json file
    const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith('.json'))
    let targetFileName = ''
    let existingData: any = null

    for (const f of files) {
      const fullPath = path.join(PROJECTS_DIR, f)
      const content = fs.readFileSync(fullPath, 'utf-8')
      const parsed = JSON.parse(content)
      if (parsed.slug === originalSlug) {
        targetFileName = f
        existingData = parsed
        break
      }
    }

    if (!targetFileName || !existingData) {
      return NextResponse.json(
        { success: false, error: `Proyek dengan slug "${originalSlug}" tidak ditemukan.` },
        { status: 404 }
      )
    }

    const title = (formData.get('title') as string || existingData.title).trim()
    let slug = (formData.get('slug') as string || existingData.slug).trim().toLowerCase()
    const category = (formData.get('category') as string || existingData.category).trim()
    const yearRaw = formData.get('year') as string
    const year = yearRaw ? parseInt(yearRaw, 10) : existingData.year
    const client = (formData.get('client') as string ?? existingData.client).trim()
    const role = (formData.get('role') as string ?? existingData.role).trim()
    const toolsRaw = formData.get('tools') as string | null
    const description = (formData.get('description') as string ?? existingData.description).trim()
    const featured = formData.has('featured') ? formData.get('featured') === 'true' : existingData.featured

    if (!slug) slug = existingData.slug

    const tools = toolsRaw !== null
      ? toolsRaw.split(',').map((t) => t.trim()).filter(Boolean)
      : existingData.tools

    // Process plates manifest & uploaded files
    const publicProjectDir = path.join(process.cwd(), 'public', 'projects', slug)
    if (!fs.existsSync(publicProjectDir)) {
      fs.mkdirSync(publicProjectDir, { recursive: true })
    }

    const platesManifestRaw = formData.get('platesManifest') as string | null
    const uploadedFiles = formData.getAll('images') as File[]
    const singleFile = formData.get('image') as File | null
    if (singleFile && singleFile.size > 0 && uploadedFiles.length === 0) {
      uploadedFiles.push(singleFile)
    }

    let finalImages: Array<{ src: string; alt: string }> = []

    if (platesManifestRaw) {
      try {
        const manifest = JSON.parse(platesManifestRaw) as Array<{ type: 'existing' | 'new'; src?: string; alt?: string }>
        let newFileIndex = 0
        let plateCounter = 1

        for (const item of manifest) {
          if (item.type === 'existing' && item.src) {
            finalImages.push({
              src: item.src,
              alt: item.alt || `${title} visual plate ${plateCounter}`,
            })
            plateCounter++
          } else if (item.type === 'new' && newFileIndex < uploadedFiles.length) {
            const file = uploadedFiles[newFileIndex++]
            if (file && file.size > 0) {
              const bytes = await file.arrayBuffer()
              const buffer = Buffer.from(bytes)
              const ext = path.extname(file.name) || '.jpg'
              const filename = `plate-${Date.now()}-${plateCounter}${ext}`
              const targetFilePath = path.join(publicProjectDir, filename)
              fs.writeFileSync(targetFilePath, buffer)
              finalImages.push({
                src: `/projects/${slug}/${filename}`,
                alt: `${title} visual plate ${plateCounter}`,
              })
              plateCounter++
            }
          }
        }
      } catch {
        // fallback below
      }
    }

    // Fallbacks if no manifest
    if (finalImages.length === 0) {
      if (uploadedFiles.length > 0 && uploadedFiles[0].size > 0) {
        for (let i = 0; i < uploadedFiles.length; i++) {
          const file = uploadedFiles[i]
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)
          const ext = path.extname(file.name) || '.jpg'
          const filename = `plate-${Date.now()}-${i + 1}${ext}`
          const targetFilePath = path.join(publicProjectDir, filename)
          fs.writeFileSync(targetFilePath, buffer)
          finalImages.push({
            src: `/projects/${slug}/${filename}`,
            alt: `${title} visual plate ${i + 1}`,
          })
        }
      } else if (existingData.images && existingData.images.length > 0) {
        finalImages = existingData.images
      } else {
        finalImages = [{ src: existingData.cover, alt: `${title} visual plate` }]
      }
    }

    const coverPath = finalImages[0]?.src || existingData.cover

    const updatedData = {
      ...existingData,
      title,
      slug,
      category,
      year: isNaN(year) ? existingData.year : year,
      client,
      role,
      tools,
      cover: coverPath,
      images: finalImages,
      description,
      featured,
    }

    // If slug changed, delete old file and create new filename
    const oldFilePath = path.join(PROJECTS_DIR, targetFileName)
    if (slug !== originalSlug) {
      fs.unlinkSync(oldFilePath)
      const paddedOrder = String(existingData.order).padStart(3, '0')
      const newFilePath = path.join(PROJECTS_DIR, `${paddedOrder}-${slug}.json`)
      fs.writeFileSync(newFilePath, JSON.stringify(updatedData, null, 2), 'utf-8')
    } else {
      fs.writeFileSync(oldFilePath, JSON.stringify(updatedData, null, 2), 'utf-8')
    }

    return NextResponse.json({
      success: true,
      slug,
      project: updatedData,
      gitCommand: `git add . && git commit -m "update project: ${title}" && git push`,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memperbarui proyek.' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug parameter is required.' },
        { status: 400 }
      )
    }

    const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith('.json'))
    let targetFileName = ''
    let projectTitle = ''

    for (const f of files) {
      const fullPath = path.join(PROJECTS_DIR, f)
      const content = fs.readFileSync(fullPath, 'utf-8')
      const parsed = JSON.parse(content)
      if (parsed.slug === slug) {
        targetFileName = f
        projectTitle = parsed.title
        break
      }
    }

    if (!targetFileName) {
      return NextResponse.json(
        { success: false, error: `Proyek "${slug}" tidak ditemukan.` },
        { status: 404 }
      )
    }

    fs.unlinkSync(path.join(PROJECTS_DIR, targetFileName))

    return NextResponse.json({
      success: true,
      slug,
      gitCommand: `git add . && git commit -m "delete project: ${projectTitle || slug}" && git push`,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menghapus proyek.' },
      { status: 500 }
    )
  }
}
