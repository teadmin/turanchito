'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-hot-toast'
import { Send } from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { supabase } from '@/lib/supabase'

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  propertyInterest: z.string().min(1, 'Especifica qué tipo de propiedad buscas')
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactFormProps {
  propertyId?: string
  propertyTitle?: string
  className?: string
}

export function ContactForm({ propertyId, propertyTitle, className = '' }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      propertyInterest: propertyTitle || ''
    }
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    try {
      const { error } = await supabase
        .from('leads')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          property_id: propertyId,
          property_interest: data.propertyInterest
        })

      if (error) throw error

      toast.success('¡Mensaje enviado correctamente! Te contactaremos pronto.')
      reset()
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Error al enviar el mensaje. Inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          ¿Interesado en esta propiedad?
        </h3>
        <p className="text-gray-600">
          Completa el formulario y te contactaremos en menos de 24 horas
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('name')}
          label="Nombre completo"
          placeholder="Tu nombre completo"
          error={errors.name?.message}
        />

        <Input
          {...register('email')}
          type="email"
          label="Correo electrónico"
          placeholder="tu@email.com"
          error={errors.email?.message}
        />

        <Input
          {...register('phone')}
          type="tel"
          label="Teléfono"
          placeholder="+58 414-123-4567"
          error={errors.phone?.message}
        />

        <Input
          {...register('propertyInterest')}
          label="¿Qué tipo de propiedad buscas?"
          placeholder="Casa en Caracas, Apartamento en Maracay, etc."
          error={errors.propertyInterest?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mensaje
          </label>
          <textarea
            {...register('message')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Cuéntanos más sobre lo que buscas: presupuesto, zona preferida, características especiales..."
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Enviando...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Enviar Mensaje
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 mb-2">
          También puedes contactarnos directamente:
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
          <a href="tel:+584141234567" className="text-blue-600 hover:text-blue-800">
            📞 +58 414-123-4567
          </a>
          <a href="mailto:info@inmobiliariave.com" className="text-blue-600 hover:text-blue-800">
            📧 info@inmobiliariave.com
          </a>
          <a href="https://wa.me/584141234567" className="text-green-600 hover:text-green-800" target="_blank" rel="noopener noreferrer">
            💬 WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}