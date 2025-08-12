import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency: 'VES' | 'USD' = 'USD'): string {
  const formatter = new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: currency === 'USD' ? 'USD' : 'VES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  
  return formatter.format(price)
}

export function formatArea(area: number): string {
  return `${area.toLocaleString('es-VE')} m²`
}

export function generateSEOSlug(city: string, propertyType: string, transactionType: string): string {
  const actionMap = {
    sale: transactionType === 'sale' ? 'vender' : 'alquilar',
    rent: 'alquilar'
  }
  
  const typeMap = {
    house: 'casa',
    apartment: 'apartamento',
    commercial: 'local-comercial',
    land: 'terreno'
  }
  
  const action = actionMap[transactionType as keyof typeof actionMap] || 'vender'
  const type = typeMap[propertyType as keyof typeof typeMap] || 'propiedad'
  const citySlug = city.toLowerCase().replace(/\s+/g, '-')
  
  return `${action}-${type}-en-${citySlug}`
}

export function generateMetaTitle(city: string, propertyType: string, transactionType: string): string {
  const actionMap = {
    sale: 'Venta',
    rent: 'Alquiler'
  }
  
  const typeMap = {
    house: 'Casas',
    apartment: 'Apartamentos',
    commercial: 'Locales Comerciales',
    land: 'Terrenos'
  }
  
  const action = actionMap[transactionType as keyof typeof actionMap] || 'Venta'
  const type = typeMap[propertyType as keyof typeof typeMap] || 'Propiedades'
  
  return `${action} de ${type} en ${city} | InmobiliariaVenezuela.com`
}

export function generateMetaDescription(city: string, propertyType: string, transactionType: string): string {
  const actionMap = {
    sale: 'venta',
    rent: 'alquiler'
  }
  
  const typeMap = {
    house: 'casas',
    apartment: 'apartamentos', 
    commercial: 'locales comerciales',
    land: 'terrenos'
  }
  
  const action = actionMap[transactionType as keyof typeof actionMap] || 'venta'
  const type = typeMap[propertyType as keyof typeof typeMap] || 'propiedades'
  
  return `Encuentra las mejores ${type} en ${action} en ${city}. Propiedades verificadas, precios competitivos y atención personalizada. ¡Contacta ahora!`
}