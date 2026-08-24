import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import SearchOverlay from './components/SearchOverlay'
import QuickAddSheet from './components/QuickAddSheet'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import GroupList from './pages/GroupList'
import ItemDetail from './pages/ItemDetail'
import NoteView from './pages/NoteView'
import QuickNotes from './pages/QuickNotes'
import Favorites from './pages/Favorites'
import Recent from './pages/Recent'
import Settings from './pages/Settings'

function AppShell() {
  const [search, setSearch] = useState(false)
  const [quickAdd, setQuickAdd] = useState(false)

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen pb-20 md:pb-0">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/space/:groupType" element={<GroupList />} />
          <Route path="/space/:groupType/:itemId" element={<ItemDetail />} />
          <Route path="/note/:noteId" element={<NoteView />} />
          <Route path="/quick-notes" element={<QuickNotes />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/recent" element={<Recent />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav onSearch={() => setSearch(true)} onQuickAdd={() => setQuickAdd(true)} />
      {search && <SearchOverlay onClose={() => setSearch(false)} />}
      {quickAdd && <QuickAddSheet onClose={() => setQuickAdd(false)} />}
    </div>
  )
}

function Gate() {
  const { user } = useAuth()
  if (user === undefined) {
    return <div className="min-h-screen flex items-center justify-center text-ink-muted text-sm">Loading…</div>
  }
  if (!user) return <Login />
  return (
    <DataProvider>
      <AppShell />
    </DataProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  )
}
