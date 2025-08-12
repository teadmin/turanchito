import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E1F574]/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
    
    const variants = {
      primary: 'bg-[#E1F574] text-slate-900 hover:bg-[#D4ED4A] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold border border-[#C8E635]/20',
      secondary: 'bg-[#4A90E2] text-white hover:bg-[#357ABD] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold',
      outline: 'border border-slate-300/60 bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-[#F0F9A3]/30 hover:border-[#E1F574]/60 hover:text-slate-800 shadow-sm hover:shadow-md',
      ghost: 'hover:bg-[#F0F9A3]/40 text-slate-700 hover:text-slate-800 transition-colors'
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