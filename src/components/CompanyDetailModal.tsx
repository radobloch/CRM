import React from 'react';
import { 
  X, 
  Building2, 
  Globe, 
  MapPin, 
  Users, 
  Kanban, 
  ExternalLink,
  Briefcase
} from 'lucide-react';
import { Company, Deal, Contact } from '../types/crm';

interface CompanyDetailModalProps {
  company: Company;
  deals: Deal[];
  contacts: Contact[];
  onClose: () => void;
  onSelectDeal: (deal: Deal) => void;
  onSelectContact: (contact: Contact) => void;
}

export const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({
  company,
  deals,
  contacts,
  onClose,
  onSelectDeal,
  onSelectContact,
}) => {
  const companyDeals = deals.filter(d => d.companyId === company.id);
  const companyContacts = contacts.filter(c => c.companyId === company.id);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900/90 rounded-2xl border border-white/20 w-full max-w-2xl shadow-2xl overflow-hidden my-8 backdrop-blur-2xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${company.accentColor} text-white font-extrabold text-base flex items-center justify-center shadow-lg`}>
              {company.logoText}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  {company.name}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {company.tier}
                </span>
              </div>
              <p className="text-xs text-slate-400">{company.industry} • {company.city}, {company.country}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Pipeline-Wert</span>
              <p className="text-sm font-extrabold text-emerald-400 font-mono mt-0.5">
                {company.totalPipelineValue.toLocaleString('de-DE')} €
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Größe</span>
              <p className="text-xs font-bold text-white mt-1">
                {company.size}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Hauptkontakt</span>
              <p className="text-xs font-bold text-white mt-1 truncate">
                {company.primaryContact}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Website</span>
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1 mt-1 truncate"
              >
                <span>Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Associated Contacts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Ansprechpartner ({companyContacts.length})</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {companyContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => {
                    onClose();
                    onSelectContact(contact);
                  }}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition cursor-pointer flex items-center gap-3"
                >
                  <img src={contact.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">
                      {contact.firstName} {contact.lastName}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{contact.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Associated Deals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Kanban className="w-3.5 h-3.5 text-indigo-400" />
              <span>Laufende Deals ({companyDeals.length})</span>
            </h4>
            <div className="space-y-2">
              {companyDeals.map((deal) => (
                <div
                  key={deal.id}
                  onClick={() => {
                    onClose();
                    onSelectDeal(deal);
                  }}
                  className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-white">{deal.title}</p>
                    <p className="text-[11px] text-slate-400">{deal.stage} • Betreuer: {deal.ownerName}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {deal.value.toLocaleString('de-DE')} €
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold rounded-lg transition"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
