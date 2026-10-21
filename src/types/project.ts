export interface ProjectImage {
  src: string
  alt: string
}

export interface Project {
  title: string
  slug: string
  category: string
  year: number
  client: string
  role: string
  tools: string[]
  cover: string
  images: ProjectImage[]
  description: string
  featured: boolean
  order: number
}
