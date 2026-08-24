/* Shared "nothing here" row. Carries font-plex itself rather than relying on
   whichever page mounts it - the base stylesheet is Inter, so an unstyled
   caller would render this label in the wrong face. */
export default function EmptyState({ label, action, className = '' }) {
  return (
    <div className={`font-plex text-center py-24 border-t border-amp-hairline ${className}`}>
      <p className="text-amp-caption text-sm">{label}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
