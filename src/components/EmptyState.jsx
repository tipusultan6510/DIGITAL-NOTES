export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center text-center py-14 px-6">
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-navy-50 flex items-center justify-center mb-3">
          <Icon size={22} className="text-navy" strokeWidth={1.75} />
        </div>
      )}
      <p className="font-medium text-ink">{title}</p>
      {description && <p className="text-sm text-ink-muted mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
