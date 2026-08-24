export default function TagPill({ tag, onClick, active, onRemove }) {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border transition
        ${active ? 'bg-navy text-white border-navy' : 'bg-accent-50 text-accent-600 border-accent-100'}
        ${onClick ? 'cursor-pointer' : ''}`}
    >
      #{tag}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          className="ml-0.5 text-current/70 hover:text-current"
          aria-label={`Remove tag ${tag}`}
        >
          ×
        </button>
      )}
    </span>
  )
}
