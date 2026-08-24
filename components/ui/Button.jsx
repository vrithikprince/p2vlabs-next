import { cn } from '../../utils/cn.js'

export default function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  /* Small/utility button - rounded-md, not the full pill. The tall
     rounded-full CTA is a separate, deliberate moment (hero, LeadForm
     submit) rather than the default for every button on the page. */
  const base =
    'inline-flex items-center justify-center font-medium tracking-[0.15em] uppercase text-xs px-5 py-3 rounded-md transition-colors duration-200'
  const variants = {
    primary:   'bg-amp-ink-pill text-white hover:bg-black',
    secondary: 'border border-amp-hairline text-black hover:border-black/40',
    ghost:     'text-amp-caption hover:text-amp-navy',
  }
  return (
    <button type={type} className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  )
}
