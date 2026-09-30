import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from './AuthContext'
import { seedSampleData } from '../lib/sampleData'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const { user } = useAuth()
  const uid = user?.uid

  const [items, setItems] = useState([])
  const [sections, setSections] = useState([])
  const [notes, setNotes] = useState([])
  const [settings, setSettings] = useState({ appName: 'My Agency Knowledge' })
  const [loading, setLoading] = useState(true)
  const seedAttempted = useRef(false)

  useEffect(() => {
    if (!uid) {
      setItems([]); setSections([]); setNotes([]); setLoading(false)
      return
    }
    setLoading(true)
    seedAttempted.current = false

    const unsubItems = onSnapshot(collection(db, 'users', uid, 'items'), (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    const unsubSections = onSnapshot(collection(db, 'users', uid, 'sections'), (snap) => {
      setSections(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    const unsubNotes = onSnapshot(collection(db, 'users', uid, 'notes'), (snap) => {
      setNotes(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    const unsubSettings = onSnapshot(doc(db, 'users', uid, 'meta', 'settings'), (snap) => {
      if (snap.exists()) setSettings((s) => ({ ...s, ...snap.data() }))
    })

    return () => { unsubItems(); unsubSections(); unsubNotes(); unsubSettings() }
  }, [uid])

  useEffect(() => {
    if (!uid || loading || seedAttempted.current) return
    if (items.length === 0 && notes.length === 0) {
      seedAttempted.current = true
      seedSampleData(uid).catch((e) => console.error('seed failed', e))
    }
  }, [uid, loading, items.length, notes.length])

  const addItem = async (groupType, name) => {
    const order = items.filter((i) => i.groupType === groupType).length
    return addDoc(collection(db, 'users', uid, 'items'), {
      groupType, name, order, isSample: false,
      createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    })
  }
  const renameItem = (itemId, name) =>
    updateDoc(doc(db, 'users', uid, 'items', itemId), { name, updatedAt: serverTimestamp() })
  const deleteItem = async (itemId) => {
    const batch = writeBatch(db)
    const itsSections = sections.filter((s) => s.itemId === itemId)
    const sectionIds = new Set(itsSections.map((s) => s.id))
    notes.filter((n) => n.itemId === itemId || sectionIds.has(n.sectionId))
      .forEach((n) => batch.delete(doc(db, 'users', uid, 'notes', n.id)))
    itsSections.forEach((s) => batch.delete(doc(db, 'users', uid, 'sections', s.id)))
    batch.delete(doc(db, 'users', uid, 'items', itemId))
    await batch.commit()
  }

  const addSection = async (itemId, name) => {
    const order = sections.filter((s) => s.itemId === itemId).length
    return addDoc(collection(db, 'users', uid, 'sections'), {
      itemId, name, order, isSample: false,
      createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    })
  }
  const renameSection = (sectionId, name) =>
    updateDoc(doc(db, 'users', uid, 'sections', sectionId), { name, updatedAt: serverTimestamp() })
  const deleteSection = async (sectionId) => {
    const batch = writeBatch(db)
    notes.filter((n) => n.sectionId === sectionId)
      .forEach((n) => batch.delete(doc(db, 'users', uid, 'notes', n.id)))
    batch.delete(doc(db, 'users', uid, 'sections', sectionId))
    await batch.commit()
  }

  const addNote = (partial) =>
    addDoc(collection(db, 'users', uid, 'notes'), {
      sectionId: null, itemId: null, groupType: null,
      title: '', content: '', tags: [],
      isFavorite: false, isPinned: false, isArchived: false, isSample: false,
      createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      ...partial,
    })
  const updateNote = (noteId, patch) =>
    updateDoc(doc(db, 'users', uid, 'notes', noteId), { ...patch, updatedAt: serverTimestamp() })
  const deleteNote = (noteId) => deleteDoc(doc(db, 'users', uid, 'notes', noteId))
  const duplicateNote = (note) =>
    addNote({
      sectionId: note.sectionId, itemId: note.itemId, groupType: note.groupType,
      title: note.title ? `${note.title} (copy)` : '',
      content: note.content, tags: note.tags || [],
    })
  const toggleFavorite = (note) => updateNote(note.id, { isFavorite: !note.isFavorite })
  const togglePin = (note) => updateNote(note.id, { isPinned: !note.isPinned })
  const toggleArchive = (note) => updateNote(note.id, { isArchived: !note.isArchived })
  const organizeNote = (noteId, { groupType, itemId, sectionId }) =>
    updateNote(noteId, { groupType, itemId, sectionId })

  const updateSettings = (patch) =>
    setDoc(doc(db, 'users', uid, 'meta', 'settings'), patch, { merge: true })

  const clearSampleData = async () => {
    const batch = writeBatch(db)
    items.filter((i) => i.isSample).forEach((i) => batch.delete(doc(db, 'users', uid, 'items', i.id)))
    sections.filter((s) => s.isSample).forEach((s) => batch.delete(doc(db, 'users', uid, 'sections', s.id)))
    notes.filter((n) => n.isSample).forEach((n) => batch.delete(doc(db, 'users', uid, 'notes', n.id)))
    await batch.commit()
  }
  const deleteAllData = async () => {
    const batch = writeBatch(db)
    items.forEach((i) => batch.delete(doc(db, 'users', uid, 'items', i.id)))
    sections.forEach((s) => batch.delete(doc(db, 'users', uid, 'sections', s.id)))
    notes.forEach((n) => batch.delete(doc(db, 'users', uid, 'notes', n.id)))
    await batch.commit()
  }
  const exportData = () => JSON.stringify({ items, sections, notes }, null, 2)
  const importData = async (json) => {
    const parsed = JSON.parse(json)
    const batch = writeBatch(db)
    ;(parsed.items || []).forEach((i) => {
      const { id, ...rest } = i
      batch.set(doc(db, 'users', uid, 'items', id), rest)
    })
    ;(parsed.sections || []).forEach((s) => {
      const { id, ...rest } = s
      batch.set(doc(db, 'users', uid, 'sections', id), rest)
    })
    ;(parsed.notes || []).forEach((n) => {
      const { id, ...rest } = n
      batch.set(doc(db, 'users', uid, 'notes', id), rest)
    })
    await batch.commit()
  }

  const value = useMemo(() => ({
    items, sections, notes, loading, settings, updateSettings,
    addItem, renameItem, deleteItem,
    addSection, renameSection, deleteSection,
    addNote, updateNote, deleteNote, duplicateNote,
    toggleFavorite, togglePin, toggleArchive, organizeNote,
    clearSampleData, deleteAllData, exportData, importData,
    getItemsByGroup: (groupType) => items.filter((i) => i.groupType === groupType).sort((a, b) => (a.order || 0) - (b.order || 0)),
    getSectionsByItem: (itemId) => sections.filter((s) => s.itemId === itemId).sort((a, b) => (a.order || 0) - (b.order || 0)),
    getNotesBySection: (sectionId) => notes.filter((n) => n.sectionId === sectionId && !n.isArchived),
    getQuickNotes: () => notes.filter((n) => !n.sectionId && !n.isArchived),
    getFavorites: () => notes.filter((n) => n.isFavorite && !n.isArchived),
    getPinned: () => notes.filter((n) => n.isPinned && !n.isArchived),
    getRecent: (n = 20) => [...notes].filter((x) => !x.isArchived)
      .sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0)).slice(0, n),
    getArchived: () => notes.filter((n) => n.isArchived),
    getItem: (itemId) => items.find((i) => i.id === itemId),
    getSection: (sectionId) => sections.find((s) => s.id === sectionId),
    getNote: (noteId) => notes.find((n) => n.id === noteId),
    allTags: () => Array.from(new Set(notes.flatMap((n) => n.tags || []))).sort(),
  }), [items, sections, notes, loading, settings])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => useContext(DataContext)
