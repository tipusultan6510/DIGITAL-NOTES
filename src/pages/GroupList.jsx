import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plane, Server, BookOpen, MoreVertical, Plus, ChevronRight } from 'lucide-react'
import { useData } from '../context/DataContext'
import TopBar from '../components/TopBar'
import EmptyState from '../components/EmptyState'
import ConfirmDialog from '../components/ConfirmDialog'
import SearchOverlay from '../components/SearchOverlay'
import QuickAddSheet from '../components/QuickAddSheet'

const META = {
  airlines: { title: 'Airlines', icon: Plane, noun: 'airline' },
  gds_ndc: { title: 'GDS / NDC', icon: Server, noun: 'system' },
  knowledge: { title: 'Knowledge', icon: BookOpen, noun: 'category' },
}

export default function GroupList() {
  const { groupType } = useParams()
  const meta = META[groupType] || META.airlines
  const { getItemsByGroup, addItem, renameItem, deleteItem, getSectionsByItem } = useData()
  const navigate = useNavigate()
  const items = getItemsByGroup(groupType)
  const [menuFor, setMenuFor] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [search, setSearch] = useState(false)
  const [quickAdd, setQuickAdd] = useState(false)

  const addNew = async () => {
    const name = window.prompt(`New ${meta.noun} name`)
    if (name?.trim()) await addItem(groupType, name.trim())
  }
  const rename = async (item) => {
    const name = window.prompt(`Rename ${meta.noun}`, item.name)
    setMenuFor(null)
    if (name?.trim() && name.trim() !== item.name) await renameItem(item.id, name.trim())
  }

  return (
    <div>
      <TopBar title={meta.title} onSearch={() => setSearch(true)} onQuickAdd={() => setQuickAdd(true)} />
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <button
          onClick={addNew}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-accent-400 text-accent-600 py-3 text-sm font-medium mb-4 hover:bg-accent-50"
        >
          <Plus size={16} /> Add {meta.noun}
        </button>

        {items.length === 0 ? (
          <EmptyState icon={meta.icon} title={`No ${meta.title.toLowerCase()} yet`} description={`Add your first ${meta.noun} to start taking notes.`} />
        ) : (
          <div className="space-y-2">
            {items.map((item) => {
              const sectionCount = getSectionsByItem(item.id).length
              return (
                <div key={item.id} className="relative rounded-xl border border-line bg-white">
                  <button
                    onClick={() => navigate(`/space/${groupType}/${item.id}`)}
                    className="w-full flex items-center justify-between p-3.5 text-left"
                  >
                    <div>
                      <p className="font-medium text-ink text-[15px]">{item.name}</p>
                      <p className="text-xs text-ink-muted mt-0.5">
                        {sectionCount} section{sectionCount !== 1 ? 's' : ''}
                        {item.isSample && ' · sample'}
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-ink-muted shrink-0" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setMenuFor(menuFor === item.id ? null : item.id) }}
                    className="absolute right-9 top-3 p-1.5 text-ink-muted hover:text-ink"
                  >
                    <MoreVertical size={16} />
                  </button>
                  {menuFor === item.id && (
                    <div className="absolute right-9 top-11 z-10 bg-white border border-line rounded-xl shadow-lg overflow-hidden w-32">
                      <button onClick={() => rename(item)} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Rename</button>
                      <button
                        onClick={() => { setConfirmDelete(item); setMenuFor(null) }}
                        className="w-full text-left px-3 py-2 text-sm text-danger hover:bg-danger-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!confirmDelete}
        title={`Delete "${confirmDelete?.name}"?`}
        description="This removes all its sections and notes too. This can't be undone."
        onCancel={() => setConfirmDelete(null)}
        onConfirm={async () => { await deleteItem(confirmDelete.id); setConfirmDelete(null) }}
      />
      {search && <SearchOverlay onClose={() => setSearch(false)} />}
      {quickAdd && <QuickAddSheet onClose={() => setQuickAdd(false)} />}
    </div>
  )
}
