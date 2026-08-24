import { useState } from 'react'
import { Zap } from 'lucide-react'
import { useData } from '../context/DataContext'
import TopBar from '../components/TopBar'
import NoteCard from '../components/NoteCard'
import EmptyState from '../components/EmptyState'
import SearchOverlay from '../components/SearchOverlay'
import QuickAddSheet from '../components/QuickAddSheet'

export default function QuickNotes() {
  const { getQuickNotes } = useData()
  const notes = getQuickNotes()
  const [search, setSearch] = useState(false)
  const [quickAdd, setQuickAdd] = useState(false)

  return (
    <div>
      <TopBar title="Quick Notes" onSearch={() => setSearch(true)} onQuickAdd={() => setQuickAdd(true)} />
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        {notes.length === 0 ? (
          <EmptyState icon={Zap} title="No quick notes" description="Capture something fast with the + button — organize it whenever you're ready." />
        ) : (
          <div className="space-y-2">
            {notes.map((n) => <NoteCard key={n.id} note={n} />)}
          </div>
        )}
      </div>
      {search && <SearchOverlay onClose={() => setSearch(false)} />}
      {quickAdd && <QuickAddSheet onClose={() => setQuickAdd(false)} />}
    </div>
  )
}
