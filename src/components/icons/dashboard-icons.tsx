import { cn } from '@/lib/utils'

const iconPaths: Record<string, (color: string) => React.ReactNode> = {
  LayoutDashboard: (c) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7" height="9" rx="1.5" fill={c} opacity="0.3"/>
      <rect x="14" y="3" width="7" height="5" rx="1.5" fill={c} opacity="0.3"/>
      <rect x="14" y="12" width="7" height="9" rx="1.5" fill={c} opacity="0.3"/>
      <rect x="3" y="16" width="7" height="5" rx="1.5" fill={c} opacity="0.3"/>
    </svg>
  ),
  Bell: (c) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill={c}/>
    </svg>
  ),
  BarChart3: (c) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="13" width="4" height="8" rx="1" fill={c} opacity="0.7"/>
      <rect x="10" y="9" width="4" height="12" rx="1" fill={c} opacity="0.9"/>
      <rect x="17" y="5" width="4" height="16" rx="1" fill={c}/>
    </svg>
  ),
  Car: (c) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.28 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01ZM6.5 16C5.67 16 5 15.33 5 14.5C5 13.67 5.67 13 6.5 13C7.33 13 8 13.67 8 14.5C8 15.33 7.33 16 6.5 16ZM17.5 16C16.67 16 16 15.33 16 14.5C16 13.67 16.67 13 17.5 13C18.33 13 19 13.67 19 14.5C19 15.33 18.33 16 17.5 16ZM5 11L6.5 6.5H17.5L19 11H5Z" fill={c}/>
    </svg>
  ),
  Users: (c) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="7" r="4" fill={c}/>
      <path d="M15 6.5C15 8.71 14.21 10.09 13.26 10.97C14.37 10.99 15.5 11.5 16.24 12.43C17.05 13.44 17.17 14.72 16.93 15.79C17.27 15.93 17.63 16 18 16C19.93 16 21.5 14.43 21.5 12.5C21.5 10.57 19.93 9 18 9C16.87 9 15.87 9.49 15.19 10.27C15.2 10.18 15.21 10.09 15.21 10C15.21 8.05 14.21 6.5 13 6.5C12.99 6.5 12.97 6.5 12.96 6.5C12.69 6.5 12.39 6.43 12.08 6.31C12.94 5.5 13.83 5 14.5 5C14.87 5 15.21 5.11 15.5 5.3C14.9 5.6 14.5 6.08 14.38 6.38C14.5 6.37 14.78 6.5 15 6.5Z" fill={c} opacity="0.7"/>
      <path d="M9 13C5.69 13 3 15.01 3 17.5C3 19.43 4.84 21 7 21C8.11 21 9.11 20.64 9.88 20.07C8.68 19.07 8 17.7 8 16.17C8 14.94 8.36 13.86 9 13Z" fill={c} opacity="0.7"/>
    </svg>
  ),
  ShoppingCart: (c) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.17 14.75l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25z" fill={c}/>
    </svg>
  ),
  ClipboardList: (c) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="2" width="14" height="20" rx="2" fill={c} opacity="0.3"/>
      <path d="M9 12H15M9 16H15M9 8H11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  FileSpreadsheet: (c) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="2" width="16" height="20" rx="2" fill={c} opacity="0.3"/>
      <rect x="7" y="8" width="10" height="2" rx="0.5" fill={c}/>
      <rect x="7" y="12" width="10" height="2" rx="0.5" fill={c}/>
      <rect x="7" y="16" width="6" height="2" rx="0.5" fill={c}/>
    </svg>
  ),
  CalendarCheck: (c) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="18" rx="2" fill={c} opacity="0.3"/>
      <path d="M16 2V6M8 2V6M3 10H21M16 15L12 19L8 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Receipt: (c) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 2V22L7 20L10 22L13 20L16 22L19 20L22 22V2L19 4L16 2L13 4L10 2L7 4L4 2Z" fill={c} opacity="0.3"/>
      <rect x="8" y="8" width="8" height="2" rx="0.5" fill={c}/>
      <rect x="8" y="12" width="6" height="2" rx="0.5" fill={c}/>
    </svg>
  ),
  Wallet: (c) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="16" rx="3" fill={c} opacity="0.3"/>
      <rect x="11" y="10" width="10" height="6" rx="1.5" fill={c}/>
      <circle cx="16" cy="13" r="1.5" fill="white"/>
    </svg>
  ),
  SearchCheck: (c) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7" fill={c} opacity="0.3"/>
      <path d="M16.5 16.5L21 21" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M8 11L10 13L14 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Truck: (c) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="5" width="14" height="11" rx="1.5" fill={c} opacity="0.3"/>
      <path d="M15 8H19L23 12V16H21" fill={c} opacity="0.3"/>
      <circle cx="6" cy="18" r="2.5" fill={c}/>
      <circle cx="19" cy="18" r="2.5" fill={c}/>
      <path d="M6 15.5C6 14.67 6.67 14 7.5 14H23V16H6V15.5Z" fill={c}/>
    </svg>
  ),
  Ship: (c) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L3 9H21L12 2Z" fill={c} opacity="0.5"/>
      <path d="M3 10H21V12H3V10Z" fill={c}/>
      <path d="M2 14L4 13H20L22 14V16H2V14Z" fill={c} opacity="0.7"/>
    </svg>
  ),
  Store: (c) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="2" fill={c} opacity="0.3"/>
      <rect x="6" y="6" width="5" height="4" rx="1" fill={c}/>
      <rect x="13" y="6" width="5" height="4" rx="1" fill={c}/>
      <rect x="6" y="12" width="5" height="8" rx="1" fill={c}/>
      <rect x="13" y="12" width="5" height="8" rx="1" fill={c}/>
    </svg>
  ),
  UsersRound: (c) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="8" cy="7" rx="4.5" ry="5" fill={c}/>
      <ellipse cx="17" cy="7" rx="4" ry="4" fill={c} opacity="0.7"/>
      <path d="M2 21C2 18.5 4.69 16 8 16C9.22 16 10.36 16.29 11.29 16.8C11.11 17.18 11 17.6 11 18.05C11 19.15 11.48 20.14 12.23 20.83C10.9 20.94 9.17 21 8 21C5.47 21 3.1 20.6 2 19.5V21Z" fill={c} opacity="0.7"/>
      <path d="M16 16C18.76 16 21 17.79 21 20V21H11V20C11 17.79 13.24 16 16 16Z" fill={c}/>
    </svg>
  ),
  Shield: (c) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L3 7V12C3 16.42 6.97 20.64 12 22C17.03 20.64 21 16.42 21 12V7L12 2Z" fill={c} opacity="0.3"/>
      <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Settings: (c) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" fill={c}/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" fill={c} opacity="0.3"/>
    </svg>
  ),
  TrendingUp: (c) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 6L21 10L16 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 10H14C11.79 10 10 11.79 10 14V17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 6C5.79 6 4 7.79 4 10V14C4 16.21 5.79 18 8 18H10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 18H5C7.21 18 9 16.21 9 14V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="3" y="3" width="18" height="18" rx="3" fill={c} opacity="0.2"/>
    </svg>
  ),
  Package: (c) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" fill={c} opacity="0.3"/>
      <rect x="7" y="7" width="4" height="4" rx="1" fill={c}/>
      <rect x="13" y="7" width="4" height="4" rx="1" fill={c}/>
      <rect x="7" y="13" width="4" height="4" rx="1" fill={c}/>
      <rect x="13" y="13" width="4" height="4" rx="1" fill={c}/>
    </svg>
  ),
  UserCheck: (c) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="7" r="4" fill={c}/>
      <path d="M9 13C5.69 13 3 15.01 3 17.5C3 19.43 4.84 21 7 21H11C11 19.05 12.23 17.38 14 16.59C13.69 15.84 13.5 15.02 13.5 14.17C13.5 13.9 13.52 13.63 13.56 13.37C12.28 13.13 10.74 13 9 13Z" fill={c} opacity="0.7"/>
      <path d="M17.5 14C15.01 14 13 16.01 13 18.5C13 20.99 15.01 23 17.5 23C19.99 23 22 20.99 22 18.5C22 16.01 19.99 14 17.5 14ZM16.5 20.5L15 19L16 18L16.5 19L19 16.5L20 17.5L16.5 20.5Z" fill={c}/>
    </svg>
  ),
  PlusCircle: (c) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" fill={c} opacity="0.3"/>
      <path d="M12 8V16M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  UserPlus: (c) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="8" r="4.5" fill={c}/>
      <path d="M10 14C6.69 14 4 16.01 4 18.5C4 20.43 5.84 22 8 22H12C12 20.05 13.23 18.38 15 17.59C14.69 16.84 14.5 16.02 14.5 15.17C14.5 14.9 14.52 14.63 14.56 14.37C13.28 14.13 11.74 14 10 14Z" fill={c} opacity="0.7"/>
      <circle cx="19" cy="17" r="4.5" fill={c} opacity="0.7"/>
      <path d="M18 14.5V19.5M15.5 17H20.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  FileText: (c) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="2" width="16" height="20" rx="2" fill={c} opacity="0.3"/>
      <rect x="7" y="7" width="10" height="2" rx="0.5" fill={c}/>
      <rect x="7" y="11" width="10" height="2" rx="0.5" fill={c}/>
      <rect x="7" y="15" width="7" height="2" rx="0.5" fill={c}/>
    </svg>
  ),
  Building2: (c) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="2" width="16" height="20" rx="2" fill={c} opacity="0.3"/>
      <rect x="7" y="6" width="3" height="3" rx="0.5" fill={c}/>
      <rect x="14" y="6" width="3" height="3" rx="0.5" fill={c}/>
      <rect x="7" y="11" width="3" height="3" rx="0.5" fill={c}/>
      <rect x="14" y="11" width="3" height="3" rx="0.5" fill={c}/>
      <rect x="7" y="16" width="10" height="4" rx="1" fill={c}/>
    </svg>
  ),
}

export function DashboardIcon({ name, color = '#3b82f6', className }: { name: string; color?: string; className?: string }) {
  const renderIcon = iconPaths[name]
  if (!renderIcon) return null
  return (
    <span className={cn('inline-flex items-center justify-center', className)}>
      {renderIcon(color)}
    </span>
  )
}

export function SidebarColoredIcon({ name, className }: { name: string; className?: string }) {
  const renderIcon = iconPaths[name]
  if (!renderIcon) return null
  return (
    <span className={cn('inline-flex items-center justify-center', className)}>
      {renderIcon('currentColor')}
    </span>
  )
}