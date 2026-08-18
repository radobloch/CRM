import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  Building2, 
  User, 
  Calendar, 
  DollarSign, 
  Save, 
  CheckCircle2, 
  Tag, 
  Clock,
  Send,
  PhoneCall
} from 'lucide-react';
import { Contact, Deal, ContactStatus, Company } from '../types/crm';

interface ContactDetailModalProps {
  contact: Contact;
  companies: Company[];
  deals: Deal[];
  onClose: () => void;
  onUpdateContact: (updated: Contact) => void;
  onSelectDeal: (deal: Deal) => void;
}

export const ContactDetailModal: React.FC<ContactDetailModalProps> = ({
  contact,
  companies,
  deals,
  onClose,
  onUpdateContact,
  onSelectDeal,
}) => {
  const [email, setEmail] = useState(contact.email);
  const [phone, setPhone] = useState(contact.phone);
  const [role, setRole] = useState(contact.role);
  const [status, setStatus] = useState<ContactStatus>(contact.status);
  const [dealValuePotential, setDealValuePotential] = useState(contact.dealValuePotential.toString());
  const [simulatedAction, setSimulatedAction] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const contactDeals = deals.filter(d => d.contactId === contact.id || d.companyId === contact.companyId);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateContact({
      ...contact,
      email,
      phone,
      role,
      status,
      dealValuePotential: parseFloat(dealValuePotential) || 0,
      lastContacted: 'Heute, soeben',
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSimulateCall = () => {
    setSimulatedAction(`Anruf bei ${contact.phone} gestartet...`);
    setTimeout(() => setSimulatedAction(null), 3000);
  };

  const handleSimulateEmail = () => {
    setSimulatedAction(`E-Mail Client für ${contact.email} geöffnet.`);
    setTimeout(() => setSimulatedAction(null), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900/90 rounded-2xl border border-white/20 w-full max-w-2xl shadow-2xl overflow-hidden my-8 backdrop-blur-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <img src={contact.avatar} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40" />
            <div>
              <h3 className="text-base font-bold text-white">
                {contact.firstName} {contact.lastName}
              </h3>
              <p className="text-xs text-slate-400">{contact.companyName} • {contact.role}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action feedback toast */}
        {simulatedAction && (
          <div className="bg-indigo-600/90 text-white text-xs font-bold px-6 py-2.5 flex items-center gap-2 border-b border-indigo-500/30">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{simulatedAction}</span>
          </div>
        )}

        {/* Form & details */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Quick Action Bar */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
            <button
              type="button"
              onClick={handleSimulateCall}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-500/30 transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Anrufen ({contact.phone})</span>
            </button>

            <button
              type="button"
              onClick={handleSimulateEmail}
              className="px-3.5 py-2 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold flex items-center gap-1.5 hover:bg-sky-500/30 transition"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>E-Mail senden</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                E-Mail-Adresse
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Telefonnummer
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Position / Job Title
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-xs bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

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
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Geschätztes Deal-Potenzial (€)
            </label>
            <input
              type="number"
              value={dealValuePotential}
              onChange={(e) => setDealValuePotential(e.target.value)}
              className="w-full text-xs font-mono font-bold bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Linked Deals Section */}
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Verknüpfte Deals ({contactDeals.length})
            </h4>
            <div className="space-y-2">
              {contactDeals.length === 0 ? (
                <p className="text-xs text-slate-400">Keine Deals direkt mit diesem Kontakt verknüpft.</p>
              ) : (
                contactDeals.map((deal) => (
                  <div
                    key={deal.id}
                    onClick={() => {
                      onClose();
                      onSelectDeal(deal);
                    }}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs cursor-pointer hover:bg-white/10 hover:border-white/20 transition"
                  >
                    <div>
                      <p className="font-bold text-white">{deal.title}</p>
                      <p className="text-[11px] text-slate-400">{deal.stage} • Betreuer: {deal.ownerName}</p>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">
                      {deal.value.toLocaleString('de-DE')} €
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 rounded-lg transition"
            >
              Schließen
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-indigo-500/25 flex items-center gap-1.5 transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savedSuccess ? 'Gespeichert!' : 'Kontakt aktualisieren'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
