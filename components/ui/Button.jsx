import { cn } from '../../utils/cn.js'

export default function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center font-medium tracking-[0.15em] uppercase text-xs px-5 py-3 transition-colors duration-200'
  const variants = {
    primary:   'bg-bone text-ink hover:bg-amber',
    secondary: 'border border-bone/20 text-bone hover:border-bone/50',
    ghost:     'text-bone/60 hover:text-amber',
  }
  return (
    <button type={type} className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  )
}
