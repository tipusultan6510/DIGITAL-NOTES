import { Link } from 'react-router-dom'
import { FileText, Plane, FolderOpen, Star, Clock } from 'lucide-react'
import { useData } from '../context/DataContext'
import NoteCard from '../components/NoteCard'
import EmptyState from '../components/EmptyState'

function StatCard({ icon: Icon, label, value, to }) {
  const content = (
    <div className="rounded-xl border border-line bg-white p-3.5 hover:border-accent-400 transition h-full">
      <div className="flex items-center justify-between">
        <span className="text-xs text-ink-muted">{label}</span>
        <Icon size={15} className="text-accent-500" />
      </div>
      <p className="text-2xl font-semibold text-navy mt-1.5">{value}</p>
    </div>
  )
  return to ? <Link to={to}>{content}</Link> : content
}

export default function Dashboard() {
  const { notes, items, sections, getRecent, getFavorites } = useData()
  const activeNotes = notes.filter((n) => !n.isArchived)
  const totalAirlines = items.filter((i) => i.groupType === 'airlines').length
  const totalCategories = sections.length
  const favorites = getFavorites()
  const recent = getRecent(6)

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard icon={FileText} label="Total Notes" value={activeNotes.length} to="/recent" />
        <StatCard icon={Plane} label="Airlines" value={totalAirlines} to="/space/airlines" />
        <StatCard icon={FolderOpen} label="Categories" value={totalCategories} />
        <StatCard icon={Star} label="Favorites" value={favorites.length} to="/favorites" />
        <StatCard icon={Clock} label="Recently Updated" value={recent.length} to="/recent" />
      </div>

      <section className="mt-7">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-semibold text-ink">Recent notes</h2>
          <Link to="/recent" className="text-xs text-accent-600 font-medium">See all</Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState icon={FileText} title="No notes yet" description="Anything you save will show up here." />
        ) : (
          <div className="space-y-2">
            {recent.map((n) => <NoteCard key={n.id} note={n} />)}
          </div>
        )}
      </section>

      <section className="mt-7 mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-semibold text-ink">Favorites</h2>
          <Link to="/favorites" className="text-xs text-accent-600 font-medium">See all</Link>
        </div>
        {favorites.length === 0 ? (
          <EmptyState icon={Star} title="No favorites yet" description="Star a note to pin it here." />
        ) : (
          <div className="space-y-2">
            {favorites.slice(0, 4).map((n) => <NoteCard key={n.id} note={n} />)}
          </div>
        )}
      </section>
    </div>
  )
}
