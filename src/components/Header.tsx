import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Shield, 
  User, 
  Bell, 
  Sparkles, 
  ChevronDown, 
  Check, 
  Building2, 
  Users, 
  Kanban,
  X
} from 'lucide-react';
import { UserProfile, UserRole, Deal, Contact, Company } from '../types/crm';

interface HeaderProps {
  activeProfile: UserProfile;
  onSwitchProfile: (role: UserRole) => void;
  onOpenNewDeal: () => void;
  onOpenNewContact: () => void;
  deals: Deal[];
  contacts: Contact[];
  companies: Company[];
  onSelectDeal: (deal: Deal) => void;
  onSelectContact: (contact: Contact) => void;
  onSelectCompany: (company: Company) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeProfile,
  onSwitchProfile,
  onOpenNewDeal,
  onOpenNewContact,
  deals,
  contacts,
  companies,
  onSelectDeal,
  onSelectContact,
  onSelectCompany,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter items for global search
  const q = searchQuery.toLowerCase().trim();
  const matchedDeals = q ? deals.filter(d => d.title.toLowerCase().includes(q) || d.companyName.toLowerCase().includes(q)) : [];
  const matchedContacts = q ? contacts.filter(c => `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)) : [];
  const matchedCompanies = q ? companies.filter(comp => comp.name.toLowerCase().includes(q) || comp.industry.toLowerCase().includes(q)) : [];
  const hasSearchResults = matchedDeals.length > 0 || matchedContacts.length > 0 || matchedCompanies.length > 0;

  return (
    <header 
      id="main-header" 
      className="h-16 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-between px-8 z-20 flex-shrink-0 select-none"
    >
      {/* Global Search Bar with Live Result Dropdown */}
      <div ref={searchRef} className="relative w-96 max-w-md">
        <div className="relative group">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Wyszukaj kontakty, firmy lub deale..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-1.5 pl-10 pr-9 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all backdrop-blur-md"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Global Search Dropdown */}
        {isSearchOpen && searchQuery.trim() && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 overflow-hidden z-50 max-h-96 overflow-y-auto">
            {!hasSearchResults ? (
              <div className="p-4 text-center text-sm text-slate-400">
                Keine Ergebnisse für "{searchQuery}" gefunden.
              </div>
            ) : (
              <div className="p-2 divide-y divide-white/10">
                {/* Deals matches */}
                {matchedDeals.length > 0 && (
                  <div className="p-2">
                    <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Kanban className="w-3.5 h-3.5 text-indigo-400" /> Deals ({matchedDeals.length})
                    </div>
                    {matchedDeals.map((deal) => (
                      <button
                        key={deal.id}
                        onClick={() => {
                          onSelectDeal(deal);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 flex items-center justify-between transition text-sm"
                      >
                        <div className="truncate">
                          <p className="font-medium text-white truncate">{deal.title}</p>
                          <p className="text-xs text-slate-400">{deal.companyName} • {deal.ownerName}</p>
                        </div>
                        <span className="font-bold text-xs text-emerald-400 font-mono ml-2">
                          {deal.value.toLocaleString('de-DE')} €
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Contacts matches */}
                {matchedContacts.length > 0 && (
                  <div className="p-2">
                    <div className="text-[10px] font-bold text-sky-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-sky-400" /> Kontakty ({matchedContacts.length})
                    </div>
                    {matchedContacts.map((contact) => (
                      <button
                        key={contact.id}
                        onClick={() => {
                          onSelectContact(contact);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 flex items-center gap-3 transition text-sm"
                      >
                        <img src={contact.avatar} alt="" className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20" />
                        <div className="truncate">
                          <p className="font-medium text-white truncate">
                            {contact.firstName} {contact.lastName}
                          </p>
                          <p className="text-xs text-slate-400 truncate">{contact.companyName} • {contact.role}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Companies matches */}
                {matchedCompanies.length > 0 && (
                  <div className="p-2">
                    <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-amber-400" /> Firmen ({matchedCompanies.length})
                    </div>
                    {matchedCompanies.map((comp) => (
                      <button
                        key={comp.id}
                        onClick={() => {
                          onSelectCompany(comp);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 flex items-center justify-between transition text-sm"
                      >
                        <div>
                          <p className="font-medium text-white">{comp.name}</p>
                          <p className="text-xs text-slate-400">{comp.city}, {comp.country} • {comp.industry}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10 font-semibold">
                          {comp.tier}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Quick Actions + Notification + Profile Switcher */}
      <div className="flex items-center gap-3.5">
        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="header-btn-new-contact"
            onClick={onOpenNewContact}
            className="px-3.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition backdrop-blur-md"
          >
            <Plus className="w-3.5 h-3.5 text-slate-300" />
            <span>Neuer Kontakt</span>
          </button>
          
          <button
            id="header-btn-new-deal"
            onClick={onOpenNewDeal}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 transition backdrop-blur-md"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Neuer Deal</span>
          </button>
        </div>

        <div className="h-6 w-[1px] bg-white/10 mx-1" />

        {/* Notifications Icon */}
        <div className="relative">
          <button
            id="header-btn-notifications"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 relative transition backdrop-blur-md"
            title="Benachrichtigungen"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 p-3.5 z-50">
              <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-2.5">
                <span className="text-xs font-bold text-white">Aktivitäts-Feed</span>
                <span className="text-[10px] text-indigo-400 font-semibold">Live-Updates</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <p className="font-semibold text-white">Deal gewonnen: FinFlow Tech</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">42.000 € • Vor 2 Stunden durch Klaus Weber</p>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <p className="font-semibold text-white">Neues Angebot gesendet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Nordic CleanEnergy (58.000 €) • Anna Kowalska</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Role Switcher (Super Admin vs Sales Rep) */}
        <div ref={profileRef} className="relative">
          <button
            id="user-profile-switcher-btn"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition backdrop-blur-md"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-xs font-bold text-indigo-300">
              {activeProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">
                  {activeProfile.name}
                </span>
                {activeProfile.role === 'super_admin' ? (
                  <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                    ADMIN
                  </span>
                ) : (
                  <span className="px-1.5 py-0.2 text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">
                    SALES REP
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{activeProfile.roleTitle}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Profile Switcher Menu */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 p-2 z-50">
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Rolle & Benutzer wechseln
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Prototyp-Simulation für Rechte & Sichtbarkeiten
                </p>
              </div>

              {/* Option 1: Super Admin */}
              <button
                id="switch-to-super-admin"
                onClick={() => {
                  onSwitchProfile('super_admin');
                  setIsProfileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition ${
                  activeProfile.role === 'super_admin'
                    ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/40'
                    : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300 border border-amber-500/30">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Klaus Weber (Super Admin)</p>
                    <p className="text-[10px] text-slate-400">Volle Rechte • Gesamte Pipeline (8 Deals)</p>
                  </div>
                </div>
                {activeProfile.role === 'super_admin' && <Check className="w-4 h-4 text-indigo-400" />}
              </button>

              {/* Option 2: Sales Rep */}
              <button
                id="switch-to-sales-rep"
                onClick={() => {
                  onSwitchProfile('sales_rep');
                  setIsProfileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left mt-1 transition ${
                  activeProfile.role === 'sales_rep'
                    ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/40'
                    : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300 border border-indigo-500/30">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Anna Kowalska (Sales Rep)</p>
                    <p className="text-[10px] text-slate-400">Eigene Pipeline & Quota-Tracking</p>
                  </div>
                </div>
                {activeProfile.role === 'sales_rep' && <Check className="w-4 h-4 text-indigo-400" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
