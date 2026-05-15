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
    primary:   'bg-p2v text-cream hover:bg-charcoal',
    secondary: 'border border-charcoal/20 text-charcoal hover:border-charcoal/50',
    ghost:     'text-charcoal/60 hover:text-p2v',
  }
  return (
    <button type={type} className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  )
}
