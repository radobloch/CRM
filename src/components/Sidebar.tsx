import React from 'react';
import { 
  Kanban, 
  Users, 
  Building2, 
  CheckSquare, 
  Settings, 
  Zap, 
  TrendingUp, 
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { NavigationTab, UserProfile } from '../types/crm';

interface SidebarProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  activeProfile: UserProfile;
  totalDealsCount: number;
  totalContactsCount: number;
  totalCompaniesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  activeProfile,
  totalDealsCount,
  totalContactsCount,
  totalCompaniesCount,
}) => {
  const navItems: { id: NavigationTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'pipeline', label: 'Deal-Pipeline', icon: Kanban, badge: totalDealsCount },
    { id: 'contacts', label: 'Kontakty', icon: Users, badge: totalContactsCount },
    { id: 'companies', label: 'Firmen', icon: Building2, badge: totalCompaniesCount },
    { id: 'activities', label: 'Aktivitäten', icon: CheckSquare },
    { id: 'settings', label: 'Einstellungen', icon: Settings },
  ];

  const quotaPercentage = Math.min(100, Math.round((activeProfile.revenueGenerated / activeProfile.quotaMonthly) * 100));

  return (
    <aside 
      id="main-sidebar" 
      className="w-64 border-r border-white/10 bg-white/5 backdrop-blur-xl flex flex-col flex-shrink-0 select-none z-20"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white">Matchpoint</span>
              <span className="px-1.5 py-0.2 text-[9px] font-semibold bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                CRM
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">50 Reps • HubSpot Alternative</p>
          </div>
        </div>
      </div>

      {/* Role Indicator Banner */}
      <div className="px-4 py-2.5 bg-white/5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeProfile.role === 'super_admin' ? (
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
            )}
            <span className="text-xs font-semibold text-slate-300">
              {activeProfile.role === 'super_admin' ? 'Super Admin' : 'Sales Rep'}
            </span>
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10 font-mono">
            {activeProfile.role === 'super_admin' ? 'ALL ACCESS' : 'MY PIPELINE'}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Hauptnavigation">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Hauptmenü
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                isActive
                  ? 'text-indigo-300 bg-white/10 shadow-sm border border-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-300' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
                    isActive 
                      ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-500/40' 
                      : 'bg-white/5 text-slate-400 border border-white/10'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quota & Sales Rep Stats Card */}
      <div className="p-4 m-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Monatsziel ({activeProfile.name.split(' ')[0]})</span>
          </div>
          <span className="text-xs font-bold text-emerald-400">{quotaPercentage}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-2">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
            style={{ width: `${quotaPercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>{activeProfile.revenueGenerated.toLocaleString('de-DE')} €</span>
          <span>{activeProfile.quotaMonthly.toLocaleString('de-DE')} € Ziel</span>
        </div>
      </div>

      {/* Footer User Info Mini */}
      <div className="p-3.5 border-t border-white/10 flex items-center gap-3 bg-white/5 backdrop-blur-md">
        <img
          src={activeProfile.avatar}
          alt={activeProfile.name}
          className="w-8 h-8 rounded-full object-cover ring-1 ring-indigo-500/50"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white truncate">{activeProfile.name}</p>
          <p className="text-[11px] text-slate-400 truncate">{activeProfile.roleTitle}</p>
        </div>
      </div>
    </aside>
  );
};
