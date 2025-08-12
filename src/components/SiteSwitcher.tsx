'use client'

import { useState } from 'react'
import { ChevronDown, ExternalLink } from 'lucide-react'
import { getCurrentSite, getOtherSites, buildCrossSiteUrl } from '@/lib/sites-config'

export function SiteSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const currentSite = getCurrentSite()
  const otherSites = getOtherSites()

  const handleSiteSwitch = (siteId: string) => {
    const url = buildCrossSiteUrl(siteId, window.location.pathname)
    window.open(url, '_blank')
    setIsOpen(false)
  }

  if (otherSites.length === 0) return null

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/60 hover:border-lime-300 transition-all shadow-sm hover:shadow-md text-sm font-medium text-slate-700 hover:text-slate-900"
      >
        <span className="text-base">{currentSite.logo}</span>
        <span className="hidden sm:inline">{currentSite.name}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-slate-200/60 py-2 z-50">
            <div className="px-4 py-2 border-b border-slate-200/60">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Cambiar de sitio
              </p>
            </div>
            
            {otherSites.map((site) => (
              <button
                key={site.id}
                onClick={() => handleSiteSwitch(site.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50/80 transition-colors text-left"
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
                  style={{ backgroundColor: site.color }}
                >
                  {site.logo}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-slate-900">{site.name}</h3>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-600">{site.description}</p>
                  <p className="text-xs text-slate-400">{site.domain}</p>
                </div>
              </button>
            ))}
            
            <div className="px-4 py-2 border-t border-slate-200/60 mt-1">
              <p className="text-xs text-slate-500">
                Usuario sincronizado en todos los sitios
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}