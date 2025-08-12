'use client'

import { useState } from 'react'
import { DollarSign, Calculator, MapPin, Phone, MessageCircle, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(100000)
  const [exchangeRate] = useState(36.5) // Ejemplo de tasa de cambio
  
  const convertToBolivares = (usd: number) => {
    return (usd * exchangeRate).toFixed(0)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-4">
        <Calculator className="h-6 w-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold">Calculadora de Precios</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio en USD
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="100,000"
            />
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600">Equivale aproximadamente a:</p>
            <p className="text-2xl font-bold text-blue-600">
              Bs. {Number(convertToBolivares(amount)).toLocaleString('es-VE')}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Tasa referencial: 1 USD = Bs. {exchangeRate}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function VenezuelanPaymentOptions() {
  const paymentMethods = [
    {
      name: 'Pago Móvil',
      description: 'Acepta transferencias por Pago Móvil',
      icon: Phone,
      popular: true
    },
    {
      name: 'Zelle',
      description: 'Transferencias internacionales rápidas',
      icon: DollarSign,
      popular: true
    },
    {
      name: 'Efectivo USD',
      description: 'Pago en efectivo en dólares',
      icon: DollarSign,
      popular: false
    },
    {
      name: 'Petro',
      description: 'Acepta pagos en Petro (PTR)',
      icon: Shield,
      popular: false
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Métodos de Pago Aceptados</h3>
      <div className="space-y-3">
        {paymentMethods.map((method, index) => (
          <div 
            key={index}
            className={`flex items-center p-3 rounded-lg border ${
              method.popular ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <method.icon className={`h-5 w-5 mr-3 ${
              method.popular ? 'text-green-600' : 'text-gray-600'
            }`} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{method.name}</span>
                {method.popular && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Popular
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{method.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function VenezuelanLocations() {
  const locations = [
    {
      city: 'Caracas',
      zones: ['Las Mercedes', 'El Rosal', 'Chacao', 'Altamira', 'La Castellana', 'Country Club'],
      highlight: 'Capital'
    },
    {
      city: 'Maracay',
      zones: ['Base Aragua', 'La Soledad', 'San Jacinto', 'El Castaño', 'Los Leones'],
      highlight: 'Ciudad Jardín'
    },
    {
      city: 'Valencia',
      zones: ['Naguanagua', 'San Diego', 'Los Guayos', 'Camoruco'],
      highlight: 'Capital Industrial'
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-4">
        <MapPin className="h-6 w-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold">Zonas Destacadas</h3>
      </div>
      
      <div className="space-y-4">
        {locations.map((location, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-gray-900">{location.city}</h4>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {location.highlight}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {location.zones.map((zone, zoneIndex) => (
                <span
                  key={zoneIndex}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {zone}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function WhatsAppContact() {
  const [message, setMessage] = useState('Hola, estoy interesado en sus propiedades')

  const sendWhatsApp = () => {
    const phoneNumber = '584141234567'
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
      <div className="flex items-center mb-4">
        <MessageCircle className="h-6 w-6 text-green-600 mr-2" />
        <h3 className="text-lg font-semibold text-green-800">Contacto WhatsApp</h3>
      </div>
      
      <p className="text-green-700 mb-4">
        ¿Tienes alguna pregunta? Escríbenos por WhatsApp y te responderemos de inmediato.
      </p>
      
      <div className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          rows={3}
          placeholder="Escribe tu mensaje..."
        />
        
        <Button
          onClick={sendWhatsApp}
          className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          Enviar por WhatsApp
        </Button>
      </div>
    </div>
  )
}

export function VenezuelanMarketInfo() {
  const marketStats = [
    {
      label: 'Crecimiento Anual',
      value: '+15%',
      description: 'Incremento en transacciones inmobiliarias'
    },
    {
      label: 'Tiempo Promedio',
      value: '45 días',
      description: 'Para cerrar una transacción'
    },
    {
      label: 'Ciudades Activas',
      value: '25+',
      description: 'Con inventario disponible'
    },
    {
      label: 'Satisfacción',
      value: '96%',
      description: 'De nuestros clientes'
    }
  ]

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-6 text-center">
        Mercado Inmobiliario Venezolano 2024
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {marketStats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-2xl font-bold text-yellow-300 mb-1">
              {stat.value}
            </div>
            <div className="font-medium mb-1">
              {stat.label}
            </div>
            <div className="text-blue-100 text-sm">
              {stat.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}