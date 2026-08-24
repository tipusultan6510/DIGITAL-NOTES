import { Search, Plus } from 'lucide-react'

export default function TopBar({ title, onSearch, onQuickAdd, right }) {
  return (
    <header className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur border-b border-line">
      <div className="flex items-center justify-between h-14 px-4 md:px-6">
        <h1 className="font-semibold text-ink text-[17px] truncate">{title}</h1>
        <div className="flex items-center gap-1.5">
          {right}
          <button onClick={onSearch} className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg text-ink-muted hover:bg-gray-100">
            <Search size={18} />
          </button>
          <button onClick={onQuickAdd} className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg bg-navy text-white hover:bg-navy-600">
            <Plus size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
