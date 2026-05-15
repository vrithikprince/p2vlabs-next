export default function EmptyState({ label, action, className = '' }) {
  return (
    <div className={`text-center py-24 border-t border-charcoal/10 ${className}`}>
      <p className="text-charcoal/30 text-sm tracking-wider">{label}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
