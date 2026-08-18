import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Building2, 
  Mail, 
  Phone, 
  Tag, 
  DollarSign, 
  User, 
  Sparkles,
  Layers,
  FileText
} from 'lucide-react';
import { Contact, Company, ContactStatus, UserProfile } from '../types/crm';

interface NewContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
  activeProfile: UserProfile;
  onCreateContact: (contact: Omit<Contact, 'id'>) => void;
}

export const NewContactDrawer: React.FC<NewContactDrawerProps> = ({
  isOpen,
  onClose,
  companies,
  activeProfile,
  onCreateContact,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [companyId, setCompanyId] = useState(companies[0]?.id || 'comp_1');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<ContactStatus>('Lead');
  const [lifecycleStage, setLifecycleStage] = useState('Lead');
  const [leadStatus, setLeadStatus] = useState('Neu');
  const [dealValuePotential, setDealValuePotential] = useState('25000');
  const [ownerName, setOwnerName] = useState(activeProfile.name);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Inbound Lead']);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) return;

    const selectedCompany = companies.find(c => c.id === companyId);

    onCreateContact({
      firstName,
      lastName,
      email,
      phone: phone || '+49 89 000 000',
      mobilePhone: mobilePhone || phone || '+49 170 000 000',
      role: role || 'Ansprechpartner',
      companyId,
      companyName: selectedCompany ? selectedCompany.name : 'Eigenständiges Unternehmen',
      status,
      lifecycleStage,
      leadStatus,
      ownerId: ownerName === 'Klaus Weber' ? 'usr_admin_1' : 'usr_rep_1',
      ownerName,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 99999999)}?w=150&auto=format&fit=crop&q=80`,
      lastContacted: 'Gerade eben erstellt',
      dealValuePotential: parseFloat(dealValuePotential) || 0,
      tags: tags.length > 0 ? tags : ['Neuer Kontakt'],
      notes,
      createdAt: 'Heute, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Frosted Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-slate-900/95 border-l border-white/20 backdrop-blur-2xl shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/5 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shadow-inner">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Kontakt hinzufügen
                </h2>
                <p className="text-xs text-slate-400">
                  HubSpot CRM Datenobjekt • Direkte Zuweisung zu 50 Sales Reps
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Form Body (Scrollable) */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Section: Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <User className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Persönliche Angaben
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Vorname <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="z.B. Maximilian"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full text-xs font-medium bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nachname <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="z.B. von Weber"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full text-xs font-medium bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    E-Mail-Adresse <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="m.weber@unternehmen.de"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl pl-9.5 pr-3 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Telefonnummer
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="+49 89 12345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl pl-9.5 pr-3 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mobiltelefon
                </label>
                <input
                  type="tel"
                  placeholder="+49 170 9876543"
                  value={mobilePhone}
                  onChange={(e) => setMobilePhone(e.target.value)}
                  className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            {/* Section: Company & Role */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Unternehmenszuordnung & Position
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Unternehmen (Company)
                  </label>
                  <select
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className="w-full text-xs font-medium bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition [&>option]:bg-slate-900"
                  >
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.tier})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Position / Job Title
                  </label>
                  <input
                    type="text"
                    placeholder="z.B. Head of Procurement"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full text-xs font-medium bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Section: HubSpot Lifecycle & Sales Parameters */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Lifecycle Stage & Betreuung
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Lifecycle-Phase
                  </label>
                  <select
                    value={lifecycleStage}
                    onChange={(e) => {
                      setLifecycleStage(e.target.value);
                      if (e.target.value === 'Kunde') setStatus('Kunde');
                      else if (e.target.value === 'Lead') setStatus('Lead');
                      else setStatus('Qualifiziert');
                    }}
                    className="w-full text-xs font-medium bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition [&>option]:bg-slate-900"
                  >
                    <option value="Lead">Lead</option>
                    <option value="Marketing Qualified (MQL)">MQL</option>
                    <option value="Sales Qualified (SQL)">SQL</option>
                    <option value="Opportunity">Opportunity</option>
                    <option value="Kunde">Kunde (Customer)</option>
                    <option value="Evangelist">Evangelist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Lead-Status
                  </label>
                  <select
                    value={leadStatus}
                    onChange={(e) => setLeadStatus(e.target.value)}
                    className="w-full text-xs font-medium bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition [&>option]:bg-slate-900"
                  >
                    <option value="Neu">Neu</option>
                    <option value="In Bearbeitung">In Bearbeitung</option>
                    <option value="Kontaktiert">Kontaktiert</option>
                    <option value="Qualifiziert">Qualifiziert</option>
                    <option value="Unqualifiziert">Unqualifiziert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Kontaktinhaber (Owner)
                  </label>
                  <select
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full text-xs font-medium bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition [&>option]:bg-slate-900"
                  >
                    <option value="Anna Kowalska">Anna Kowalska (Rep)</option>
                    <option value="Klaus Weber">Klaus Weber (Admin)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Geschätztes Deal-Potenzial (€)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    step="1000"
                    value={dealValuePotential}
                    onChange={(e) => setDealValuePotential(e.target.value)}
                    className="w-full text-xs font-mono font-bold bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>

              {/* Tags Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tags & Segmente
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Tag eingeben..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 text-xs bg-white/5 border border-white/10 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition border border-white/10"
                  >
                    + Hinzufügen
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-indigo-300/70 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Initial Note */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Erste Notiz / Kontext zum Kontakt
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="z.B. Auf der Messe kennengelernt. Zeigte großes Interesse an einer Migration von HubSpot zu Matchpoint..."
                  className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>
          </form>

          {/* Drawer Footer */}
          <div className="p-6 border-t border-white/10 bg-white/5 flex items-center justify-between flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10 rounded-xl transition"
            >
              Abbrechen
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>Kontakt anlegen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
