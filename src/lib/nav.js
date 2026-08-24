import { LayoutDashboard, Plane, Server, BookOpen, Zap, Star, Clock, Settings } from 'lucide-react'

export const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Airlines', icon: Plane, path: '/space/airlines' },
  { label: 'GDS / NDC', icon: Server, path: '/space/gds_ndc' },
  { label: 'Knowledge', icon: BookOpen, path: '/space/knowledge' },
  { label: 'Quick Notes', icon: Zap, path: '/quick-notes' },
  { label: 'Favorites', icon: Star, path: '/favorites' },
  { label: 'Recent', icon: Clock, path: '/recent' },
  { label: 'Settings', icon: Settings, path: '/settings' },
]
