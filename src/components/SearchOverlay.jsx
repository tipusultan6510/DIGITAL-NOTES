import { useState } from 'react'
import { X, Search as SearchIcon } from 'lucide-react'
import { useData } from '../context/DataContext'
import { searchNotes, GROUP_LABEL } from '../lib/search'
import NoteCard from './NoteCard'

export default function SearchOverlay({ onClose }) {
  const { notes, items, sections } = useData()
  const [q, setQ] = useState('')
  const results = searchNotes({ notes, items, sections, query: q })

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col">
      <div className="flex items-center gap-2 px-4 h-14 border-b border-line bg-white">
        <SearchIcon size={18} className="text-ink-muted shrink-0" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search airlines, GDS, notes, tags…"
          className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-ink-muted"
        />
        <button onClick={onClose} className="text-ink-muted p-1"><X size={20} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-24">
        {q.trim() === '' && (
          <p className="text-sm text-ink-muted text-center pt-10">Start typing to search everything you've saved.</p>
        )}
        {q.trim() !== '' && results.length === 0 && (
          <p className="text-sm text-ink-muted text-center pt-10">No matches for "{q}".</p>
        )}
        {results.map(({ note, item, section }) => (
          <NoteCard
            key={note.id}
            note={note}
            subtitle={[note.groupType ? GROUP_LABEL[note.groupType] : null, item?.name, section?.name].filter(Boolean).join(' · ')}
          />
        ))}
      </div>
    </div>
  )
}
