import { useState } from 'react'
import { X, Plane, Server, BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'

export default function QuickAddSheet({ onClose }) {
  const { addNote, addItem } = useData()
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const saveQuickNote = async () => {
    if (!text.trim()) return
    setSaving(true)
    await addNote({ content: `<p>${text.trim()}</p>` })
    setSaving(false)
    setText('')
    onClose()
  }

  const addNew = async (groupType) => {
    const name = window.prompt(
      groupType === 'airlines' ? 'New airline name' : groupType === 'gds_ndc' ? 'New GDS / NDC system name' : 'New knowledge category name'
    )
    if (!name?.trim()) return
    await addItem(groupType, name.trim())
    onClose()
    navigate(`/space/${groupType}`)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={onClose}>
      <div
        className="bg-white w-full rounded-t-2xl p-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-ink">Quick add</p>
          <button onClick={onClose} className="text-ink-muted"><X size={20} /></button>
        </div>

        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write something quickly… you can organize it later"
          rows={3}
          className="w-full rounded-xl border border-line p-3 text-[15px] outline-none focus:border-accent-400 resize-none"
        />
        <button
          onClick={saveQuickNote}
          disabled={!text.trim() || saving}
          className="w-full mt-2 rounded-xl bg-navy text-white py-2.5 text-sm font-medium disabled:opacity-40"
        >
          {saving ? 'Saving…' : 'Save quick note'}
        </button>

        <p className="text-xs text-ink-muted mt-4 mb-2">Or start something new</p>
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => addNew('airlines')} className="flex flex-col items-center gap-1.5 rounded-xl border border-line py-3 text-xs text-ink hover:bg-gray-50">
            <Plane size={18} className="text-navy" strokeWidth={1.75} /> Airline
          </button>
          <button onClick={() => addNew('gds_ndc')} className="flex flex-col items-center gap-1.5 rounded-xl border border-line py-3 text-xs text-ink hover:bg-gray-50">
            <Server size={18} className="text-navy" strokeWidth={1.75} /> GDS / NDC
          </button>
          <button onClick={() => addNew('knowledge')} className="flex flex-col items-center gap-1.5 rounded-xl border border-line py-3 text-xs text-ink hover:bg-gray-50">
            <BookOpen size={18} className="text-navy" strokeWidth={1.75} /> Knowledge
          </button>
        </div>
      </div>
    </div>
  )
}
