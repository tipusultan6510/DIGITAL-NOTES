import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, MoreVertical, ArrowLeft } from 'lucide-react'
import { useData } from '../context/DataContext'
import TopBar from '../components/TopBar'
import NoteCard from '../components/NoteCard'
import EmptyState from '../components/EmptyState'
import ConfirmDialog from '../components/ConfirmDialog'
import SearchOverlay from '../components/SearchOverlay'
import QuickAddSheet from '../components/QuickAddSheet'

export default function ItemDetail() {
  const { groupType, itemId } = useParams()
  const navigate = useNavigate()
  const {
    getItem, getSectionsByItem, getNotesBySection,
    addSection, renameSection, deleteSection, addNote,
  } = useData()

  const item = getItem(itemId)
  const sections = getSectionsByItem(itemId)
  const [menuFor, setMenuFor] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [search, setSearch] = useState(false)
  const [quickAdd, setQuickAdd] = useState(false)

  if (!item) {
    return (
      <div>
        <TopBar title="Not found" />
        <EmptyState title="This item no longer exists" description="It may have been deleted." />
      </div>
    )
  }

  const addNewSection = async () => {
    const name = window.prompt('New section name (e.g. Baggage, Reissue, Group Booking…)')
    if (name?.trim()) await addSection(itemId, name.trim())
  }
  const rename = async (section) => {
    const name = window.prompt('Rename section', section.name)
    setMenuFor(null)
    if (name?.trim() && name.trim() !== section.name) await renameSection(section.id, name.trim())
  }
  const newNoteIn = async (sectionId) => {
    const ref = await addNote({ sectionId, itemId, groupType, title: '' })
    navigate(`/note/${ref.id}`)
  }

  return (
    <div>
      <TopBar
        title={item.name}
        onSearch={() => setSearch(true)}
        onQuickAdd={() => setQuickAdd(true)}
        right={
          <button onClick={() => navigate(-1)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-ink-muted">
            <ArrowLeft size={18} />
          </button>
        }
      />
      <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-5">
        <button
          onClick={addNewSection}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-accent-400 text-accent-600 py-3 text-sm font-medium hover:bg-accent-50"
        >
          <Plus size={16} /> Add section
        </button>

        {sections.length === 0 ? (
          <EmptyState title="No sections yet" description="Create your own sections like Baggage, Reissue, or Group Booking." />
        ) : (
          sections.map((section) => {
            const notes = getNotesBySection(section.id)
            return (
              <div key={section.id}>
                <div className="flex items-center justify-between mb-2 relative">
                  <h2 className="text-sm font-semibold text-ink">{section.name}</h2>
                  <div className="flex items-center gap-1">
                    <button onClick={() => newNoteIn(section.id)} className="text-xs text-accent-600 font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-accent-50">
                      <Plus size={13} /> Note
                    </button>
                    <button onClick={() => setMenuFor(menuFor === section.id ? null : section.id)} className="p-1.5 text-ink-muted hover:text-ink">
                      <MoreVertical size={15} />
                    </button>
                  </div>
                  {menuFor === section.id && (
                    <div className="absolute right-0 top-8 z-10 bg-white border border-line rounded-xl shadow-lg overflow-hidden w-32">
                      <button onClick={() => rename(section)} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Rename</button>
                      <button
                        onClick={() => { setConfirmDelete(section); setMenuFor(null) }}
                        className="w-full text-left px-3 py-2 text-sm text-danger hover:bg-gray-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                {notes.length === 0 ? (
                  <p className="text-sm text-ink-muted italic px-1">No notes in this section yet.</p>
                ) : (
                  <div className="space-y-2">
                    {notes.map((n) => <NoteCard key={n.id} note={n} />)}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      <ConfirmDialog
        open={!!confirmDelete}
        title={`Delete section "${confirmDelete?.name}"?`}
        description="Notes inside this section will be deleted too."
        onCancel={() => setConfirmDelete(null)}
        onConfirm={async () => { await deleteSection(confirmDelete.id); setConfirmDelete(null) }}
      />
      {search && <SearchOverlay onClose={() => setSearch(false)} />}
      {quickAdd && <QuickAddSheet onClose={() => setQuickAdd(false)} />}
    </div>
  )
}
