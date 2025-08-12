import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-11 w-full rounded-xl border border-slate-300/60 bg-white/90 backdrop-blur-sm px-4 py-2 text-sm placeholder:text-slate-500 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/20 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-400/20',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }