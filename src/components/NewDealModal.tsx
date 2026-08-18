import React, { useState } from 'react';
import { X, Plus, DollarSign, Building2, User, Calendar, Tag } from 'lucide-react';
import { Deal, DealStage, DealPriority, Company, Contact, UserProfile } from '../types/crm';
import { DEAL_STAGES } from '../data/mockData';

interface NewDealModalProps {
  companies: Company[];
  contacts: Contact[];
  activeProfile: UserProfile;
  defaultStage?: DealStage;
  onClose: () => void;
  onCreateDeal: (deal: Omit<Deal, 'id'>) => void;
}

export const NewDealModal: React.FC<NewDealModalProps> = ({
  companies,
  contacts,
  activeProfile,
  defaultStage,
  onClose,
  onCreateDeal,
}) => {
  const [title, setTitle] = useState('');
  const [companyId, setCompanyId] = useState(companies[0]?.id || '');
  const [contactId, setContactId] = useState(contacts[0]?.id || '');
  const [value, setValue] = useState('25000');
  const [stage, setStage] = useState<DealStage>(defaultStage || 'lead_in');
  const [priority, setPriority] = useState<DealPriority>('Mittel');
  const [expectedCloseDate, setExpectedCloseDate] = useState('2026-10-31');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedComp = companies.find(c => c.id === companyId) || companies[0];
    const selectedCont = contacts.find(c => c.id === contactId) || contacts[0];
    const currentStageConfig = DEAL_STAGES.find(s => s.id === stage) || DEAL_STAGES[0];

    onCreateDeal({
      title,
      companyId: selectedComp.id,
      companyName: selectedComp.name,
      contactId: selectedCont.id,
      contactName: `${selectedCont.firstName} ${selectedCont.lastName}`,
      contactEmail: selectedCont.email,
      value: parseFloat(value) || 0,
      stage,
      priority,
      probability: currentStageConfig.probability,
      expectedCloseDate,
      ownerId: activeProfile.id,
      ownerName: activeProfile.name,
      lastActivity: 'Deal soeben manuell angelegt',
      notes: notes || 'Neuer Deal aus Matchpoint CRM Formular.',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900/90 rounded-2xl border border-white/20 w-full max-w-xl shadow-2xl overflow-hidden my-8 backdrop-blur-2xl">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Neuen Deal zur Pipeline hinzufügen</span>
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Deal Bezeichnung / Projekt
            </label>
            <input
              type="text"
              required
              placeholder="z.B. Enterprise Lizenzpaket & SLA 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs font-medium bg-white/5 border border-white/10 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Unternehmen (Company)
              </label>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full text-xs font-medium bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 [&>option]:bg-slate-900"
              >
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Hauptkontakt
              </label>
              <select
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
                className="w-full text-xs font-medium bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 [&>option]:bg-slate-900"
              >
                {contacts.map(c => (
                  <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.companyName})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Auftragswert (€)
              </label>
              <input
                type="number"
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full text-xs font-mono font-bold bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Vertriebsphase
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as DealStage)}
                className="w-full text-xs font-semibold bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 [&>option]:bg-slate-900"
              >
                {DEAL_STAGES.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Priorität
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as DealPriority)}
                className="w-full text-xs font-semibold bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 [&>option]:bg-slate-900"
              >
                <option value="Hoch">Hoch</option>
                <option value="Mittel">Mittel</option>
                <option value="Niedrig">Niedrig</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Erwartetes Abschlussdatum
            </label>
            <input
              type="date"
              value={expectedCloseDate}
              onChange={(e) => setExpectedCloseDate(e.target.value)}
              className="w-full text-xs font-mono bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Deal-Beschreibung & Notizen
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="z.B. Anfrage über HubSpot Inbound Formular erhalten..."
              className="w-full text-xs bg-white/5 border border-white/10 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3.5 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 rounded-lg transition"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-indigo-500/25 transition"
            >
              Deal erstellen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
