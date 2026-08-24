import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Pin, Copy, Archive, Trash2, ArchiveRestore, FolderInput, X } from 'lucide-react'
import { useData } from '../context/DataContext'
import NoteEditor from '../components/NoteEditor'
import TagPill from '../components/TagPill'
import ConfirmDialog from '../components/ConfirmDialog'
import { GROUP_LABEL } from '../lib/search'

const GROUP_TYPES = ['airlines', 'gds_ndc', 'knowledge']

function OrganizePanel({ note, onClose }) {
  const { getItemsByGroup, getSectionsByItem, organizeNote, addItem, addSection } = useData()
  const [groupType, setGroupType] = useState(note.groupType || '')
  const [itemId, setItemId] = useState(note.itemId || '')
  const [sectionId, setSectionId] = useState(note.sectionId || '')

  const itemsForGroup = groupType ? getItemsByGroup(groupType) : []
  const sectionsForItem = itemId ? getSectionsByItem(itemId) : []

  const addNewItem = async () => {
    const name = window.prompt('New item name')
    if (!name?.trim()) return
    const ref = await addItem(groupType, name.trim())
    setItemId(ref.id)
    setSectionId('')
  }
  const addNewSection = async () => {
    const name = window.prompt('New section name')
    if (!name?.trim()) return
    const ref = await addSection(itemId, name.trim())
    setSectionId(ref.id)
  }

  const save = async () => {
    if (!groupType || !itemId || !sectionId) return
    await organizeNote(note.id, { groupType, itemId, sectionId })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center sm:justify-center" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-ink">Organize note</p>
          <button onClick={onClose} className="text-ink-muted"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <select
            value={groupType}
            onChange={(e) => { setGroupType(e.target.value); setItemId(''); setSectionId('') }}
            className="w-full rounded-xl border border-line px-3 py-2.5 text-sm"
          >
            <option value="">Choose a space…</option>
            {GROUP_TYPES.map((g) => <option key={g} value={g}>{GROUP_LABEL[g]}</option>)}
          </select>

          {groupType && (
            <div className="flex gap-2">
              <select value={itemId} onChange={(e) => { setItemId(e.target.value); setSectionId('') }} className="flex-1 rounded-xl border border-line px-3 py-2.5 text-sm">
                <option value="">Choose item…</option>
                {itemsForGroup.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
              <button onClick={addNewItem} className="px-3 rounded-xl border border-line text-sm text-accent-600">+ New</button>
            </div>
          )}

          {itemId && (
            <div className="flex gap-2">
              <select value={sectionId} onChange={(e) => setSectionId(e.target.value)} className="flex-1 rounded-xl border border-line px-3 py-2.5 text-sm">
                <option value="">Choose section…</option>
                {sectionsForItem.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <button onClick={addNewSection} className="px-3 rounded-xl border border-line text-sm text-accent-600">+ New</button>
            </div>
          )}
        </div>
        <button
          onClick={save}
          disabled={!groupType || !itemId || !sectionId}
          className="w-full mt-4 rounded-xl bg-navy text-white py-2.5 text-sm font-medium disabled:opacity-40"
        >
          Save location
        </button>
      </div>
    </div>
  )
}

export default function NoteView() {
  const { noteId } = useParams()
  const navigate = useNavigate()
  const {
    getNote, getItem, getSection, updateNote, deleteNote, duplicateNote,
    toggleFavorite, togglePin, toggleArchive,
  } = useData()

  const note = getNote(noteId)
  const [title, setTitle] = useState(note?.title || '')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState(note?.tags || [])
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [organizing, setOrganizing] = useState(false)
  const saveTimer = useRef(null)

  useEffect(() => {
    if (note) { setTitle(note.title || ''); setTags(note.tags || []) }
  }, [note?.id])

  if (!note) {
    return (
      <div className="p-6 text-center text-ink-muted">
        Note not found. <button onClick={() => navigate('/')} className="text-accent-600 font-medium">Go home</button>
      </div>
    )
  }

  const item = note.itemId ? getItem(note.itemId) : null
  const section = note.sectionId ? getSection(note.sectionId) : null
  const breadcrumb = [note.groupType ? GROUP_LABEL[note.groupType] : null, item?.name, section?.name].filter(Boolean).join(' · ')

  const debouncedSave = (patch) => {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => updateNote(note.id, patch), 500)
  }

  const onContentChange = (html) => debouncedSave({ content: html })
  const onTitleBlur = () => updateNote(note.id, { title })
  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, '')
    if (t && !tags.includes(t)) {
      const next = [...tags, t]
      setTags(next)
      updateNote(note.id, { tags: next })
    }
    setTagInput('')
  }
  const removeTag = (t) => {
    const next = tags.filter((x) => x !== t)
    setTags(next)
    updateNote(note.id, { tags: next })
  }

  return (
    <div>
      <header className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur border-b border-line">
        <div className="flex items-center justify-between h-14 px-4 md:px-6">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-lg text-ink-muted hover:bg-gray-100">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-1">
            <button onClick={() => toggleFavorite(note)} className={`w-9 h-9 flex items-center justify-center rounded-lg ${note.isFavorite ? 'text-warning' : 'text-ink-muted'} hover:bg-gray-100`}>
              <Star size={17} className={note.isFavorite ? 'fill-warning' : ''} />
            </button>
            <button onClick={() => togglePin(note)} className={`w-9 h-9 flex items-center justify-center rounded-lg ${note.isPinned ? 'text-accent-500' : 'text-ink-muted'} hover:bg-gray-100`}>
              <Pin size={17} className={note.isPinned ? 'fill-accent-500' : ''} />
            </button>
            <button onClick={async () => { const ref = await duplicateNote(note); navigate(`/note/${ref.id}`) }} className="w-9 h-9 flex items-center justify-center rounded-lg text-ink-muted hover:bg-gray-100">
              <Copy size={16} />
            </button>
            <button onClick={() => toggleArchive(note)} className="w-9 h-9 flex items-center justify-center rounded-lg text-ink-muted hover:bg-gray-100">
              {note.isArchived ? <ArchiveRestore size={17} /> : <Archive size={17} />}
            </button>
            <button onClick={() => setConfirmDelete(true)} className="w-9 h-9 flex items-center justify-center rounded-lg text-danger hover:bg-danger-50">
              <Trash2 size={17} />
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <button
          onClick={() => setOrganizing(true)}
          className="flex items-center gap-1.5 text-xs text-accent-600 font-medium mb-3"
        >
          <FolderInput size={13} />
          {breadcrumb || 'Unorganized · tap to file this note'}
        </button>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={onTitleBlur}
          placeholder="Note title"
          className="w-full text-xl font-semibold text-ink outline-none placeholder:text-ink-muted placeholder:font-normal mb-2 bg-transparent"
        />

        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {tags.map((t) => <TagPill key={t} tag={t} onRemove={() => removeTag(t)} />)}
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
            onBlur={addTag}
            placeholder="+ tag"
            className="text-xs text-ink-muted outline-none w-16 bg-transparent"
          />
        </div>

        <NoteEditor content={note.content} onChange={onContentChange} />
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this note?"
        description="This can't be undone."
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => { deleteNote(note.id); setConfirmDelete(false); navigate(-1) }}
      />
      {organizing && <OrganizePanel note={note} onClose={() => setOrganizing(false)} />}
    </div>
  )
}
