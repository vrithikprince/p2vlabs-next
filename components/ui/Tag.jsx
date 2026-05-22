export default function Tag({ children, red = false }) {
  return (
    <span
      className={`text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 border ${
        red ? 'text-p2v border-p2v/40' : 'text-charcoal/50 border-charcoal/20'
      }`}
    >
      {children}
    </span>
  )
}
