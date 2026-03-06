import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  UploadCloud, 
  CreditCard, 
  TrendingUp, 
  BarChart2,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Zap,
  Bell,
  Settings
} from 'lucide-react'
import useStore from '../../store/useStore'

// Define our navigation structure
const NAV_ITEMS = [
  { id: 'upload',    label: 'Upload Data', icon: UploadCloud,     path: '/app/upload' },
  { id: 'dashboard', label: 'Dashboard',   icon: LayoutDashboard, path: '/app' },
  { id: 'forecast',  label: 'Forecast',    icon: BarChart2,      path: '/app/forecast' },
  { id: 'advisor',   label: 'Ask AI',      icon: MessageSquare,   path: '/app/advisor' },
  { id: 'smartcash', label: 'SmartCash',   icon: CreditCard,      path: '/app/smartcash' },
  { id: 'invest',    label: 'Invest',      icon: TrendingUp,      path: '/app/invest' },
  { id: 'profile',   label: 'Profile',     icon: Settings,        path: '/app/profile' },
]


export default function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  
  // Zustand store connections
  const user = useStore(s => s.user)
  const logout = useStore(s => s.logout)

  function handleLogout() {
    logout()
    navigate('/')
  }

  // 1. Helper to determine if a nav item is currently active based on the URL
  const isActive = (path) => {
    if (path === '/app' && location.pathname === '/app') return true
    if (path !== '/app' && location.pathname.startsWith(path)) return true
    return false
  }

  // 2. Sidebar content extracted so we can reuse it in both Desktop and Mobile views
  const NavContent = () => (
    <div className="flex flex-col h-full bg-[#020408] md:bg-transparent p-6">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 mb-10 pl-2">
        <Zap size={26} className="text-[#00f5a0]" />
        <span className="text-2xl font-extrabold bg-gradient-to-br from-[#00f5a0] to-[#00d4ff] bg-clip-text text-transparent">
          FinSight
        </span>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-2 flex-1">
        {NAV_ITEMS.map(item => {
          const active = isActive(item.path)
          return (
            <button key={item.id} 
              onClick={() => { navigate(item.path); setIsMobileOpen(false) }}
              // Notice how Tailwind makes hover states and active states easy!
              className={`flex items-center gap-4 px-4 py-3 rounded-xl border-none cursor-pointer font-syne text-sm transition-all duration-200 ${
                active 
                  ? 'bg-[#00f5a0]/10 text-[#00f5a0] font-bold' 
                  : 'bg-transparent text-white/40 hover:bg-white/5 hover:text-white/70 font-medium'
              }`}>
              <item.icon size={20} className={active ? 'text-[#00f5a0]' : 'text-white/40'} />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Bottom Profile / Logout section */}
      <div className="mt-auto border-t border-white/5 pt-6">
        <div className="flex items-center justify-between pl-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00f5a0] to-[#00d4ff] flex items-center justify-center text-black font-bold text-lg">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-[#e8eaf0]">{user?.name || 'Pro User'}</div>
              <div className="text-xs text-white/30 font-mono tracking-widest mt-0.5">PREMIUM</div>
            </div>
          </div>
          <button onClick={handleLogout} className="text-white/30 hover:text-[#ff3c64] transition-colors cursor-pointer bg-transparent border-none">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-[#020408] text-[#e8eaf0] font-syne selection:bg-[#00f5a0]/30 relative overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-[20%] left-[60%] w-[600px] h-[600px] bg-[#00d4ff]/[0.03] rounded-full blur-[120px] mix-blend-screen" />
      </div>

      {/* --- MOBILE NAV BAR (Hidden on md and up) --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#020408]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
           <Zap className="text-[#00f5a0]" size={20} />
           <span className="text-xl font-extrabold bg-gradient-to-br from-[#00f5a0] to-[#00d4ff] bg-clip-text text-transparent">FinSight</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMobileOpen(true)} className="text-white/80 bg-transparent border-none">
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* --- MOBILE SIDEBAR DRAWER --- */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Dark blur backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            {/* Sliding menu */}
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="md:hidden fixed top-0 left-0 bottom-0 w-72 bg-[#020408] border-r border-white/5 z-50">
              <button 
                onClick={() => setIsMobileOpen(false)} 
                className="absolute top-6 right-5 text-white/50 hover:text-white bg-transparent border-none cursor-pointer">
                <X size={24} />
              </button>
              <NavContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- DESKTOP SIDEBAR (Hidden on mobile) --- */}
      <aside className="hidden md:flex flex-col w-72 bg-white/[0.01] border-r border-white/5 relative z-10">
        <NavContent />
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col pt-16 md:pt-0 relative z-10 w-full h-screen overflow-y-auto">
        
        {/* Top Notifications Bar (Desktop only) */}
        <div className="hidden md:flex justify-end p-6 pb-0">
           <button className="relative p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
             <Bell size={20} />
             {/* Notification Dot */}
             <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#ff3c64]"></span>
           </button>
        </div>

        {/* 3. THE OUTLET: This is the React Router magic. */}
        <div className="flex-1 p-4 md:p-8 md:pt-4">
          <Outlet />
        </div>

      </main>

    </div>
  )
}
