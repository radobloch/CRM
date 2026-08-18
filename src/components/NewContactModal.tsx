import React, { useState } from 'react';
import { X, Plus, User, Mail, Phone, Building2 } from 'lucide-react';
import { Contact, ContactStatus, Company, UserProfile } from '../types/crm';

interface NewContactModalProps {
  companies: Company[];
  activeProfile: UserProfile;
  onClose: () => void;
  onCreateContact: (contact: Omit<Contact, 'id'>) => void;
}

export const NewContactModal: React.FC<NewContactModalProps> = ({
  companies,
  activeProfile,
  onClose,
  onCreateContact,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [companyId, setCompanyId] = useState(companies[0]?.id || '');
  const [status, setStatus] = useState<ContactStatus>('Lead');
  const [dealValuePotential, setDealValuePotential] = useState('30000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedComp = companies.find(c => c.id === companyId) || companies[0];

    onCreateContact({
      firstName,
      lastName,
      email,
      phone: phone || '+49 89 0000 0000',
      role: role || 'Lead Manager',
      companyId: selectedComp.id,
      companyName: selectedComp.name,
      status,
      ownerId: activeProfile.id,
      ownerName: activeProfile.name,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      lastContacted: 'Heute, soeben',
      dealValuePotential: parseFloat(dealValuePotential) || 0,
      tags: ['Neu', selectedComp.tier],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900/90 rounded-2xl border border-white/20 w-full max-w-lg shadow-2xl overflow-hidden my-8 backdrop-blur-2xl">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Neuen Kontakt anlegen</span>
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Vorname
              </label>
              <input
                type="text"
                required
                placeholder="z.B. Thomas"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full text-xs font-medium bg-white/5 border border-white/10 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nachname
              </label>
              <input
                type="text"
                required
                placeholder="z.B. Bergmann"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full text-xs font-medium bg-white/5 border border-white/10 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                E-Mail
              </label>
              <input
                type="email"
                required
                placeholder="t.bergmann@company.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs bg-white/5 border border-white/10 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Telefon
              </label>
              <input
                type="text"
                placeholder="+49 89 123456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs bg-white/5 border border-white/10 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Unternehmen
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
                Position / Rolle
              </label>
              <input
                type="text"
                placeholder="z.B. Head of Procurement"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-xs bg-white/5 border border-white/10 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContactStatus)}
                className="w-full text-xs font-semibold bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 [&>option]:bg-slate-900"
              >
                <option value="Lead">Lead</option>
                <option value="Qualifiziert">Qualifiziert</option>
                <option value="Kunde">Kunde</option>
                <option value="Inaktiv">Inaktiv</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Geschätztes Potenzial (€)
              </label>
              <input
                type="number"
                value={dealValuePotential}
                onChange={(e) => setDealValuePotential(e.target.value)}
                className="w-full text-xs font-mono font-bold bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
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
              Kontakt speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
