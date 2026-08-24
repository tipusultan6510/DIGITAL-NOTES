import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { useRef, useState } from 'react'
import {
  Bold, Italic, List, ListOrdered, CheckSquare, Table as TableIcon,
  Link as LinkIcon, Image as ImageIcon, Paperclip, Heading1, Heading2, Loader2,
} from 'lucide-react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase'

function ToolbarButton({ onClick, active, children, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-lg transition
        ${active ? 'bg-navy text-white' : 'text-ink-muted hover:bg-gray-100'}`}
    >
      {children}
    </button>
  )
}

export default function NoteEditor({ content, onChange, editable = true, placeholder = 'Write your note…' }) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Link.configure({ openOnClick: true, autolink: true }),
      Image,
      Placeholder.configure({ placeholder }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow, TableHeader, TableCell,
    ],
    content: content || '',
    editable,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: {
      attributes: { class: 'note-prose focus:outline-none min-h-[160px]' },
    },
  })

  if (!editor) return null

  const addLink = () => {
    const url = window.prompt('Link URL')
    if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const uploadAndInsert = async (file, asImage) => {
    if (!file) return
    setUploading(true)
    try {
      const path = `attachments/${Date.now()}-${file.name}`
      const storageRef = ref(storage, path)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      if (asImage) {
        editor.chain().focus().setImage({ src: url, alt: file.name }).run()
      } else {
        editor.chain().focus().insertContent(
          `<a href="${url}" target="_blank" rel="noopener noreferrer" class="file-attachment">📎 ${file.name}</a>&nbsp;`
        ).run()
      }
    } catch (e) {
      console.error(e)
      window.alert('Upload failed. Check your Firebase Storage setup.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {editable && (
        <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar border-b border-line pb-2 mb-3 -mx-1 px-1">
          <ToolbarButton label="Heading 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 size={16} /></ToolbarButton>
          <ToolbarButton label="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={16} /></ToolbarButton>
          <ToolbarButton label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={16} /></ToolbarButton>
          <ToolbarButton label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={16} /></ToolbarButton>
          <ToolbarButton label="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={16} /></ToolbarButton>
          <ToolbarButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={16} /></ToolbarButton>
          <ToolbarButton label="Checklist" active={editor.isActive('taskList')} onClick={() => editor.chain().focus().toggleTaskList().run()}><CheckSquare size={16} /></ToolbarButton>
          <ToolbarButton label="Table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon size={16} /></ToolbarButton>
          <ToolbarButton label="Link" active={editor.isActive('link')} onClick={addLink}><LinkIcon size={16} /></ToolbarButton>
          <ToolbarButton label="Image" onClick={() => imageInputRef.current?.click()}>
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
          </ToolbarButton>
          <ToolbarButton label="Attach file" onClick={() => fileInputRef.current?.click()}><Paperclip size={16} /></ToolbarButton>
          <input ref={imageInputRef} type="file" accept="image/*" hidden onChange={(e) => uploadAndInsert(e.target.files?.[0], true)} />
          <input ref={fileInputRef} type="file" hidden onChange={(e) => uploadAndInsert(e.target.files?.[0], false)} />
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  )
}
