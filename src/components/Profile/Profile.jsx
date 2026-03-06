import { useState } from 'react'
import { User, Lock, Globe, ShieldAlert, FileText } from 'lucide-react'
import AccountInfo from './AccountInfo'
import ChangePassword from './ChangePassword'
import CurrencyPreference from './CurrencyPreference'
import DangerZone from './DangerZone'
import StatementHistory from './StatementHistory'

export default function Profile() {
  const [activeTab, setActiveTab] = useState('account')

  const tabs = [
    { id: 'account', label: 'Account Info', icon: User },
    { id: 'history', label: 'Statement History', icon: FileText },
    { id: 'currency', label: 'Currency & Region', icon: Globe },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'danger', label: 'Danger Zone', icon: ShieldAlert },
  ]

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <div className="text-[10px] font-mono text-[#00f5a0] tracking-[3px] mb-2 uppercase">ACCOUNT SETTINGS</div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Profile Management
        </h1>
        <p className="text-white/40 mt-2 text-sm">
          Update your personal details, regional preferences, and view past uploads.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-2">
          {tabs.map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-mono text-sm ${
                  active 
                    ? tab.id === 'danger' 
                      ? 'bg-[#ff3c64]/10 text-[#ff3c64] border border-[#ff3c64]/30' 
                      : 'bg-[#00f5a0]/10 text-[#00f5a0] border border-[#00f5a0]/30'
                    : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10 hover:text-white/80'
                }`}
              >
                <Icon size={18} className={active ? '' : 'opacity-70'} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 min-h-[400px]">
          {activeTab === 'account'  && <AccountInfo />}
          {activeTab === 'history'  && <StatementHistory />}
          {activeTab === 'currency' && <CurrencyPreference />}
          {activeTab === 'security' && <ChangePassword />}
          {activeTab === 'danger'   && <DangerZone />}
        </div>
      </div>
    </div>
  )
}
