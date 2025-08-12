import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50'
    
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 shadow-lg',
      outline: 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 shadow-sm',
      ghost: 'hover:bg-gray-100 text-gray-900'
    }
    
    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-11 px-8 text-base',
      lg: 'h-12 px-10 text-lg'
    }
    
    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }