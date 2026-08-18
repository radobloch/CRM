import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  Building2, 
  Filter, 
  ExternalLink,
  MoreHorizontal,
  Tag,
  Clock,
  Sparkles,
  UserCheck,
  CheckSquare,
  Square,
  Bookmark,
  Download,
  SlidersHorizontal,
  ChevronDown,
  Trash2,
  PhoneCall,
  Edit,
  Eye,
  Check,
  X
} from 'lucide-react';
import { Contact, ContactStatus, Company, Deal, UserProfile } from '../types/crm';
import { NewContactDrawer } from './NewContactDrawer';

export interface SavedView {
  id: string;
  name: string;
  statusFilter: string;
  ownerFilter: string;
  companyFilter: string;
  minPotential: number;
}

const DEFAULT_SAVED_VIEWS: SavedView[] = [
  { id: 'all', name: 'Alle Kontakte', statusFilter: 'all', ownerFilter: 'all', companyFilter: 'all', minPotential: 0 },
  { id: 'mine', name: 'Meine Kontakte', statusFilter: 'all', ownerFilter: 'mine', companyFilter: 'all', minPotential: 0 },
  { id: 'leads', name: 'Neue Leads', statusFilter: 'Lead', ownerFilter: 'all', companyFilter: 'all', minPotential: 0 },
  { id: 'qualified', name: 'Qualifizierte Leads', statusFilter: 'Qualifiziert', ownerFilter: 'all', companyFilter: 'all', minPotential: 0 },
  { id: 'customers', name: 'Kunden (Bestandskunden)', statusFilter: 'Kunde', ownerFilter: 'all', companyFilter: 'all', minPotential: 0 },
  { id: 'high_value', name: 'High-Potential (> 50k €)', statusFilter: 'all', ownerFilter: 'all', companyFilter: 'all', minPotential: 50000 },
];

interface ContactsViewProps {
  contacts: Contact[];
  companies: Company[];
  deals: Deal[];
  activeProfile: UserProfile;
  onSelectContact: (contact: Contact) => void;
  onOpenNewContact?: () => void;
  onCreateContact: (contact: Omit<Contact, 'id'>) => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  contacts,
  companies,
  deals,
  activeProfile,
  onSelectContact,
  onOpenNewContact,
  onCreateContact,
}) => {
  // Saved Views State
  const [savedViews, setSavedViews] = useState<SavedView[]>(DEFAULT_SAVED_VIEWS);
  const [activeViewId, setActiveViewId] = useState<string>('all');
  const [isSaveViewModalOpen, setIsSaveViewModalOpen] = useState(false);
  const [newViewName, setNewViewName] = useState('');

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [minPotentialFilter, setMinPotentialFilter] = useState<number>(0);

  // Row Selection State for Bulk Actions
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  
  // Drawer state for "+ Kontakt hinzufügen"
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [actionMenuContactId, setActionMenuContactId] = useState<string | null>(null);

  // Apply a saved view
  const handleSelectView = (view: SavedView) => {
    setActiveViewId(view.id);
    setStatusFilter(view.statusFilter);
    setOwnerFilter(view.ownerFilter);
    setCompanyFilter(view.companyFilter);
    setMinPotentialFilter(view.minPotential);
  };

  // Save current filter configuration as a new custom view
  const handleSaveCurrentView = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newViewName.trim()) return;

    const newView: SavedView = {
      id: `view_${Date.now()}`,
      name: newViewName.trim(),
      statusFilter,
      ownerFilter,
      companyFilter,
      minPotential: minPotentialFilter,
    };

    setSavedViews([...savedViews, newView]);
    setActiveViewId(newView.id);
    setNewViewName('');
    setIsSaveViewModalOpen(false);
  };

  // Filtered Contacts Logic
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      if (statusFilter !== 'all' && contact.status !== statusFilter) return false;
      if (ownerFilter === 'mine' && contact.ownerName !== activeProfile.name) return false;
      if (ownerFilter !== 'all' && ownerFilter !== 'mine' && contact.ownerName !== ownerFilter) return false;
      if (companyFilter !== 'all' && contact.companyId !== companyFilter) return false;
      if (minPotentialFilter > 0 && contact.dealValuePotential < minPotentialFilter) return false;
      
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
        const email = contact.email.toLowerCase();
        const phone = contact.phone.toLowerCase();
        const company = contact.companyName.toLowerCase();
        const role = contact.role.toLowerCase();
        const owner = contact.ownerName.toLowerCase();
        if (
          !fullName.includes(q) && 
          !email.includes(q) && 
          !phone.includes(q) && 
          !company.includes(q) && 
          !role.includes(q) && 
          !owner.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [contacts, statusFilter, ownerFilter, companyFilter, minPotentialFilter, searchQuery, activeProfile]);

  // Bulk Selection Handlers
  const handleSelectAll = () => {
    if (selectedContactIds.length === filteredContacts.length) {
      setSelectedContactIds([]);
    } else {
      setSelectedContactIds(filteredContacts.map(c => c.id));
    }
  };

  const handleToggleSelectContact = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedContactIds.includes(id)) {
      setSelectedContactIds(selectedContactIds.filter(item => item !== id));
    } else {
      setSelectedContactIds([...selectedContactIds, id]);
    }
  };

  const getStatusBadge = (status: ContactStatus) => {
    switch (status) {
      case 'Kunde':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Qualifiziert':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'Lead':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-white/10 text-slate-400 border-white/10';
    }
  };

  const handleExportCSV = () => {
    const headers = 'ID,Vorname,Nachname,Firma,Position,E-Mail,Telefon,Lifecycle-Status,Owner,Potenzial\n';
    const rows = filteredContacts.map(c => 
      `"${c.id}","${c.firstName}","${c.lastName}","${c.companyName}","${c.role}","${c.email}","${c.phone}","${c.status}","${c.ownerName}","${c.dealValuePotential}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `hubspot_kontakte_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="contacts-view" className="flex flex-col h-full overflow-hidden bg-transparent">
      {/* Header Bar */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl px-8 py-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <Users className="w-6 h-6 text-indigo-400" />
                <span>Kontakte (HubSpot CRM)</span>
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-white/10 text-slate-300 border border-white/10">
                {filteredContacts.length} von {contacts.length} Kontakten
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Zentrales Verzeichnis aller Ansprechpartner und Entscheider bei Enterprise- & Mid-Market-Kunden.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition backdrop-blur-md"
              title="Als CSV exportieren"
            >
              <Download className="w-4 h-4" />
              <span>Exportieren</span>
            </button>

            <button
              id="btn-add-contact-view"
              onClick={() => setIsDrawerOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/25 transition backdrop-blur-md"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Kontakt hinzufügen</span>
            </button>
          </div>
        </div>

        {/* Gespeicherte Views (Saved Views Bar) */}
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-white/10 overflow-x-auto pb-1 no-scrollbar">
          <div className="flex items-center gap-1.5 flex-1 min-w-max">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Bookmark className="w-3 h-3 text-indigo-400" />
              <span>Ansichten:</span>
            </span>

            {savedViews.map((view) => (
              <button
                key={view.id}
                onClick={() => handleSelectView(view)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  activeViewId === view.id
                    ? 'bg-indigo-600/90 text-white border border-indigo-400/40 shadow-md shadow-indigo-500/20'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                <span>{view.name}</span>
                {activeViewId === view.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            ))}

            <button
              onClick={() => setIsSaveViewModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-indigo-300 border border-dashed border-indigo-500/30 flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ansicht speichern</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-white/5">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Name, E-Mail, Telefon, Firma..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 backdrop-blur-md"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Lifecycle Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setActiveViewId('custom');
              }}
              className="text-xs font-medium bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 backdrop-blur-md cursor-pointer [&>option]:bg-slate-900"
            >
              <option value="all">Alle Lifecycle-Status</option>
              <option value="Lead">Lead</option>
              <option value="Qualifiziert">Qualifiziert</option>
              <option value="Kunde">Kunde (Customer)</option>
              <option value="Inaktiv">Inaktiv</option>
            </select>

            {/* Owner Filter */}
            <select
              value={ownerFilter}
              onChange={(e) => {
                setOwnerFilter(e.target.value);
                setActiveViewId('custom');
              }}
              className="text-xs font-medium bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 backdrop-blur-md cursor-pointer [&>option]:bg-slate-900"
            >
              <option value="all">Alle Betreuer (50 Reps)</option>
              <option value="mine">Meine Kontakte ({activeProfile.name.split(' ')[0]})</option>
              <option value="Anna Kowalska">Anna Kowalska</option>
              <option value="Klaus Weber">Klaus Weber</option>
            </select>

            {/* Company Filter */}
            <select
              value={companyFilter}
              onChange={(e) => {
                setCompanyFilter(e.target.value);
                setActiveViewId('custom');
              }}
              className="text-xs font-medium bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 backdrop-blur-md cursor-pointer [&>option]:bg-slate-900"
            >
              <option value="all">Alle Unternehmen</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-400 font-mono hidden md:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>HubSpot Live Sync • 100% konsistent</span>
          </div>
        </div>

        {/* Bulk Action Bar (when rows are selected) */}
        {selectedContactIds.length > 0 && (
          <div className="mt-3 p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-500/40 backdrop-blur-xl flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-3 text-xs">
              <span className="font-bold text-white px-2 py-0.5 rounded bg-indigo-600">
                {selectedContactIds.length} ausgewählt
              </span>
              <span className="text-slate-300">Massenaktionen:</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => alert(`${selectedContactIds.length} Kontakten eine Serien-E-Mail gesendet.`)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>E-Mail senden</span>
              </button>
              <button 
                onClick={() => alert(`Inhaber für ${selectedContactIds.length} Kontakte zugewiesen.`)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Inhaber ändern</span>
              </button>
              <button 
                onClick={() => setSelectedContactIds([])}
                className="px-2.5 py-1 text-slate-400 hover:text-white text-xs font-semibold transition"
              >
                Auswahl aufheben
              </button>
            </div>
          </div>
        )}
      </div>

      {/* HubSpot Contacts Table */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {/* Select All Checkbox */}
                  <th className="py-4 px-4 w-10 text-center">
                    <button onClick={handleSelectAll} className="p-0.5 text-slate-400 hover:text-white">
                      {selectedContactIds.length > 0 && selectedContactIds.length === filteredContacts.length ? (
                        <CheckSquare className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-4 px-4">Name & Position</th>
                  <th className="py-4 px-4">Firma</th>
                  <th className="py-4 px-4">Owner (Betreuer)</th>
                  <th className="py-4 px-4">Lifecycle Status</th>
                  <th className="py-4 px-4">E-Mail</th>
                  <th className="py-4 px-4">Telefon</th>
                  <th className="py-4 px-4 text-right">Akcje (Aktionen)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-slate-400">
                      <Users className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
                      <p className="font-semibold text-white">Keine Kontakte gefunden</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Bitte Suchkriterien oder Filter anpassen.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => {
                    const isSelected = selectedContactIds.includes(contact.id);
                    return (
                      <tr
                        key={contact.id}
                        id={`contact-row-${contact.id}`}
                        onClick={() => onSelectContact(contact)}
                        className={`hover:bg-white/10 transition cursor-pointer group ${
                          isSelected ? 'bg-indigo-950/30' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-4 px-4 text-center" onClick={(e) => handleToggleSelectContact(contact.id, e)}>
                          <button className="p-0.5 text-slate-400 hover:text-white">
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-indigo-400" />
                            ) : (
                              <Square className="w-4 h-4 group-hover:text-slate-300" />
                            )}
                          </button>
                        </td>

                        {/* 1. Name & Position */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={contact.avatar}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30 shadow-sm"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-white group-hover:text-indigo-300 transition truncate">
                                {contact.firstName} {contact.lastName}
                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                {contact.role}
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                {contact.tags.slice(0, 2).map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-slate-400 font-medium"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Firma */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="font-semibold text-white truncate max-w-[160px]">
                              {contact.companyName}
                            </span>
                          </div>
                        </td>

                        {/* 3. Owner */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-xs text-slate-300">
                            <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-300">
                              {contact.ownerName[0]}
                            </div>
                            <span className="font-medium text-white">{contact.ownerName}</span>
                          </div>
                        </td>

                        {/* 4. Lifecycle Status */}
                        <td className="py-4 px-4">
                          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${getStatusBadge(contact.status)}`}>
                            {contact.lifecycleStage || contact.status}
                          </span>
                        </td>

                        {/* 5. E-Mail */}
                        <td className="py-4 px-4 text-xs font-mono text-slate-300">
                          <a
                            href={`mailto:${contact.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 hover:text-indigo-300 transition"
                          >
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate max-w-[180px]">{contact.email}</span>
                          </a>
                        </td>

                        {/* 6. Telefon */}
                        <td className="py-4 px-4 text-xs font-mono text-slate-300">
                          <a
                            href={`tel:${contact.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition"
                          >
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{contact.phone}</span>
                          </a>
                        </td>

                        {/* 7. Akcje */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => onSelectContact(contact)}
                              className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-indigo-600 hover:border-indigo-500 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                              title="HubSpot Datensatz öffnen"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Öffnen</span>
                            </button>

                            <a
                              href={`mailto:${contact.email}`}
                              className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition"
                              title="E-Mail schreiben"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>

                            <a
                              href={`tel:${contact.phone}`}
                              className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/15 text-slate-400 hover:text-emerald-400 transition"
                              title="Anrufen"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Slide-out Drawer for "+ Kontakt hinzufügen" */}
      <NewContactDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        companies={companies}
        activeProfile={activeProfile}
        onCreateContact={onCreateContact}
      />

      {/* Modal: Ansicht speichern (Save View Dialog) */}
      {isSaveViewModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900/95 rounded-2xl border border-white/20 w-full max-w-md p-6 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-indigo-400" />
                <span>Gespeicherte Ansicht erstellen</span>
              </h3>
              <button onClick={() => setIsSaveViewModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCurrentView} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Name der Ansicht
                </label>
                <input
                  type="text"
                  required
                  placeholder="z.B. Enterprise Kontakte Bayern"
                  value={newViewName}
                  onChange={(e) => setNewViewName(e.target.value)}
                  className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-1">
                <p className="font-semibold text-white">Gespeicherte Filterkriterien:</p>
                <p className="text-slate-400">• Status: <strong className="text-slate-200">{statusFilter}</strong></p>
                <p className="text-slate-400">• Inhaber: <strong className="text-slate-200">{ownerFilter}</strong></p>
                <p className="text-slate-400">• Unternehmen: <strong className="text-slate-200">{companyFilter}</strong></p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsSaveViewModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 rounded-xl transition"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition"
                >
                  Ansicht speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
