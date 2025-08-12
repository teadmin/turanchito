export interface SiteConfig {
  id: string
  name: string
  domain: string
  logo: string
  color: string
  description: string
  favicon?: string
}

export const SITES: SiteConfig[] = [
  {
    id: 'turanchito',
    name: 'turanchito',
    domain: 'turanchito.com',
    logo: '🏠',
    color: '#E1F56E',
    description: 'tu hogar en venezuela',
    favicon: '/favicon-turanchito.ico'
  },
  {
    id: 'tuburra',
    name: 'tuburra',
    domain: 'tuburra.com',
    logo: '🌴',
    color: '#FF6B6B',
    description: 'propiedades de playa',
    favicon: '/favicon-tuburra.ico'
  }
  // Aquí puedes agregar más sitios fácilmente
]

export function getCurrentSite(): SiteConfig {
  // En el servidor, usar headers
  if (typeof window === 'undefined') {
    // Detectar desde headers o env variable
    const currentDomain = process.env.NEXT_PUBLIC_CURRENT_SITE || 'turanchito.com'
    return SITES.find(site => site.domain === currentDomain) || SITES[0]
  }
  
  // En el cliente, usar window.location
  const currentDomain = window.location.hostname
  return SITES.find(site => 
    site.domain === currentDomain || 
    currentDomain.includes(site.id)
  ) || SITES[0]
}

export function getOtherSites(): SiteConfig[] {
  const currentSite = getCurrentSite()
  return SITES.filter(site => site.id !== currentSite.id)
}

// Función para construir URLs entre sitios manteniendo la ruta actual
export function buildCrossSiteUrl(targetSiteId: string, currentPath?: string): string {
  const targetSite = SITES.find(site => site.id === targetSiteId)
  if (!targetSite) return '/'
  
  const protocol = process.env.NODE_ENV === 'production' ? 'https://' : 'http://'
  const path = currentPath || (typeof window !== 'undefined' ? window.location.pathname : '/')
  
  return `${protocol}${targetSite.domain}${path}`
}