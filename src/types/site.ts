export interface SiteContact {
  email: string
  instagram: string
  instagramUrl?: string
  behance: string
  behanceUrl?: string
  discord?: string
  discordUrl?: string
}

export interface SiteService {
  index: string
  title: string
  description: string
}

export interface SiteExperience {
  period: string
  role: string
  company: string
  description?: string
}

export interface SiteOpenGraph {
  title: string
  description: string
  image: string
}

export interface SiteClient {
  name?: string
  logo: string
  href?: string
}

export interface SiteConfig {
  name: string
  nameShort: string
  bio: string
  aboutBio?: string
  photo?: string
  cv?: string
  specialization: string[]
  services?: SiteService[]
  experience?: SiteExperience[]
  contact: SiteContact
  clients?: Array<SiteClient | string>
  heroText: string
  ink: string
  locale: string
  openGraph: SiteOpenGraph
}

