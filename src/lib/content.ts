import fs from 'fs'
import path from 'path'
import type { Project } from '@/types/project'
import type { SiteConfig } from '@/types/site'

export type ProjectWithIndex = Project & { index: string }

const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects')
const SITE_CONFIG_PATH = path.join(process.cwd(), 'content', 'site.json')

export function getAllProjects(): ProjectWithIndex[] {
  const files = fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith('.json'))

  const projects: Project[] = files.map((file) => {
    const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), 'utf-8')
    return JSON.parse(raw) as Project
  })

  // Sort ascending by order field
  projects.sort((a, b) => a.order - b.order)

  // Attach padded index: 001, 002, ...
  return projects.map((project, i) => ({
    ...project,
    index: String(i + 1).padStart(3, '0'),
  }))
}

export function getFeaturedProjects(): ProjectWithIndex[] {
  return getAllProjects().filter((p) => p.featured)
}

export function getProjectBySlug(slug: string): ProjectWithIndex | null {
  const all = getAllProjects()
  return all.find((p) => p.slug === slug) ?? null
}

export function getAdjacentProjects(slug: string): {
  prev: ProjectWithIndex | null
  next: ProjectWithIndex | null
} {
  const all = getAllProjects()
  const index = all.findIndex((p) => p.slug === slug)
  if (index === -1) {
    return { prev: null, next: null }
  }

  const prev = index > 0 ? all[index - 1] : null
  const next = index < all.length - 1 ? all[index + 1] : null

  return { prev, next }
}

export function getAllCategories(): string[] {
  const all = getAllProjects()
  const set = new Set<string>()
  for (const p of all) {
    if (p.category) set.add(p.category)
  }
  return Array.from(set)
}

export function getSiteConfig(): SiteConfig {
  const raw = fs.readFileSync(SITE_CONFIG_PATH, 'utf-8')
  return JSON.parse(raw) as SiteConfig
}
