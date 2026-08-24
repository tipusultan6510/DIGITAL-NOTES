import { Link } from 'react-router-dom'
import { Pin, Star } from 'lucide-react'
import TagPill from './TagPill'

function stripHtml(html) {
  return (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function timeAgo(ts) {
  if (!ts?.seconds) return ''
  const diff = Date.now() / 1000 - ts.seconds
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`
  return new Date(ts.seconds * 1000).toLocaleDateString()
}

export default function NoteCard({ note, subtitle }) {
  const preview = stripHtml(note.content).slice(0, 110)
  return (
    <Link
      to={`/note/${note.id}`}
      className="block rounded-xl border border-line bg-white p-3.5 hover:border-accent-400 transition"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-ink text-[15px] line-clamp-1">
          {note.title || <span className="text-ink-muted font-normal italic">Untitled note</span>}
        </p>
        <div className="flex items-center gap-1.5 shrink-0 text-ink-muted">
          {note.isPinned && <Pin size={14} className="text-accent-500 fill-accent-500" />}
          {note.isFavorite && <Star size={14} className="text-warning fill-warning" />}
        </div>
      </div>
      {preview && <p className="text-sm text-ink-muted mt-1 line-clamp-2">{preview}</p>}
      <div className="flex items-center justify-between mt-2.5">
        <div className="flex gap-1.5 flex-wrap">
          {(note.tags || []).slice(0, 3).map((t) => (
            <TagPill key={t} tag={t} />
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {subtitle && <span className="text-xs text-ink-muted">{subtitle}</span>}
          <span className="text-xs text-ink-muted">{timeAgo(note.updatedAt)}</span>
        </div>
      </div>
    </Link>
  )
}
