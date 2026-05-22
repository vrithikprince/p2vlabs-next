export default function EmptyState({ label, action, className = '' }) {
  return (
    <div className={`text-center py-24 border-t border-bone/10 ${className}`}>
      <p className="text-bone/30 text-sm tracking-wider">{label}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
