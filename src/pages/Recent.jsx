import { useState } from 'react'
import { Clock } from 'lucide-react'
import { useData } from '../context/DataContext'
import TopBar from '../components/TopBar'
import NoteCard from '../components/NoteCard'
import EmptyState from '../components/EmptyState'
import SearchOverlay from '../components/SearchOverlay'
import QuickAddSheet from '../components/QuickAddSheet'
import { GROUP_LABEL } from '../lib/search'

export default function Recent() {
  const { getRecent, getItem, getSection } = useData()
  const notes = getRecent(100)
  const [search, setSearch] = useState(false)
  const [quickAdd, setQuickAdd] = useState(false)

  return (
    <div>
      <TopBar title="Recently Updated" onSearch={() => setSearch(true)} onQuickAdd={() => setQuickAdd(true)} />
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        {notes.length === 0 ? (
          <EmptyState icon={Clock} title="Nothing here yet" description="Notes you add or edit will show up here, newest first." />
        ) : (
          <div className="space-y-2">
            {notes.map((n) => {
              const item = n.itemId ? getItem(n.itemId) : null
              const section = n.sectionId ? getSection(n.sectionId) : null
              const subtitle = [n.groupType ? GROUP_LABEL[n.groupType] : null, item?.name, section?.name].filter(Boolean).join(' · ')
              return <NoteCard key={n.id} note={n} subtitle={subtitle} />
            })}
          </div>
        )}
      </div>
      {search && <SearchOverlay onClose={() => setSearch(false)} />}
      {quickAdd && <QuickAddSheet onClose={() => setQuickAdd(false)} />}
    </div>
  )
}
