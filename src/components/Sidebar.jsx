import { NavLink } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { NAV_ITEMS } from '../lib/nav'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

export default function Sidebar() {
  const { logout } = useAuth()
  const { settings } = useData()
  return (
    <aside className="hidden md:flex md:flex-col w-60 shrink-0 bg-navy text-white h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-white/10">
        <p className="font-semibold tracking-tight text-[15px] leading-tight">{settings.appName}</p>
      </div>
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition
              ${isActive ? 'bg-white/10 text-white font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white'}`
            }
          >
            <Icon size={17} strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={logout}
        className="flex items-center gap-2.5 px-5 py-4 text-sm text-white/60 hover:text-white border-t border-white/10"
      >
        <LogOut size={16} /> Sign out
      </button>
    </aside>
  )
}
