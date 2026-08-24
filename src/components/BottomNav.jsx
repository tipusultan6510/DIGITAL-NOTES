import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Search, Plus, Menu, X, LogOut } from 'lucide-react'
import { NAV_ITEMS } from '../lib/nav'
import { useAuth } from '../context/AuthContext'

export default function BottomNav({ onSearch, onQuickAdd }) {
  const [moreOpen, setMoreOpen] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()
  const rest = NAV_ITEMS.filter((n) => n.path !== '/')

  return (
    <>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-line pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-4 h-16">
          <NavLink to="/" end className={({ isActive }) => `flex flex-col items-center justify-center gap-0.5 text-xs ${isActive ? 'text-navy' : 'text-ink-muted'}`}>
            <LayoutDashboard size={20} strokeWidth={1.75} />
            Home
          </NavLink>
          <button onClick={onSearch} className="flex flex-col items-center justify-center gap-0.5 text-xs text-ink-muted">
            <Search size={20} strokeWidth={1.75} />
            Search
          </button>
          <button onClick={onQuickAdd} className="flex flex-col items-center justify-center gap-0.5 text-xs text-ink-muted">
            <span className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center -mt-4 shadow-lg shadow-navy/30">
              <Plus size={18} />
            </span>
            <span className="mt-0.5">Add</span>
          </button>
          <button onClick={() => setMoreOpen(true)} className="flex flex-col items-center justify-center gap-0.5 text-xs text-ink-muted">
            <Menu size={20} strokeWidth={1.75} />
            More
          </button>
        </div>
      </nav>

      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40 flex items-end" onClick={() => setMoreOpen(false)}>
          <div className="bg-white w-full rounded-t-2xl p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-ink">Menu</p>
              <button onClick={() => setMoreOpen(false)} className="text-ink-muted"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {rest.map(({ label, icon: Icon, path }) => (
                <button
                  key={path}
                  onClick={() => { navigate(path); setMoreOpen(false) }}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-line py-3 text-xs text-ink hover:bg-gray-50"
                >
                  <Icon size={19} className="text-navy" strokeWidth={1.75} />
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 mt-4 text-sm text-ink-muted py-2"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      )}
    </>
  )
}
