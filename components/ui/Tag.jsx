export default function Tag({ children, red = false }) {
  return (
    <span
      className={`text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 border ${
        red ? 'text-amber border-amber/40' : 'text-bone/50 border-bone/20'
      }`}
    >
      {children}
    </span>
  )
}
