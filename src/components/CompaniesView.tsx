import React, { useState } from 'react';
import { 
  Building2, 
  Globe, 
  MapPin, 
  Users, 
  Kanban, 
  ArrowUpRight, 
  ExternalLink,
  Plus,
  Search,
  Shield,
  Briefcase
} from 'lucide-react';
import { Company, Deal, Contact } from '../types/crm';

interface CompaniesViewProps {
  companies: Company[];
  deals: Deal[];
  contacts: Contact[];
  onSelectCompany: (company: Company) => void;
  onSelectDeal: (deal: Deal) => void;
}

export const CompaniesView: React.FC<CompaniesViewProps> = ({
  companies,
  deals,
  contacts,
  onSelectCompany,
  onSelectDeal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');

  const filteredCompanies = companies.filter(comp => {
    if (tierFilter !== 'all' && comp.tier !== tierFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        comp.name.toLowerCase().includes(q) ||
        comp.industry.toLowerCase().includes(q) ||
        comp.city.toLowerCase().includes(q) ||
        comp.country.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalCompaniesPipeline = companies.reduce((sum, c) => sum + c.totalPipelineValue, 0);

  return (
    <div id="companies-view" className="flex flex-col h-full overflow-hidden bg-transparent">
      {/* Header Bar */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl px-8 py-5 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Firmen (Companies)
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-white/10 text-slate-300 border border-white/10">
                {companies.length} Firmen verknüpft
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Unternehmensaccounts mit aggregierten Pipeline-Werten und Team-Zuordnungen.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-lg">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mr-2">Gesamtwert Firmen:</span>
              <span className="text-sm font-extrabold text-white font-mono">
                {totalCompaniesPipeline.toLocaleString('de-DE')} €
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3.5 border-t border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Firma, Branche oder Stadt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 backdrop-blur-md"
              />
            </div>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="text-xs font-medium bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 backdrop-blur-md cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">Alle Segmente</option>
              <option value="Enterprise" className="bg-slate-900 text-white">Enterprise</option>
              <option value="Mid-Market" className="bg-slate-900 text-white">Mid-Market</option>
              <option value="SMB" className="bg-slate-900 text-white">SMB</option>
            </select>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            DACH & CEE Region
          </span>
        </div>
      </div>

      {/* Grid of Companies */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCompanies.map((company) => {
            const companyDeals = deals.filter(d => d.companyId === company.id);
            const companyContacts = contacts.filter(c => c.companyId === company.id);

            return (
              <div
                key={company.id}
                id={`company-card-${company.id}`}
                onClick={() => onSelectCompany(company)}
                className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-xl shadow-xl hover:border-indigo-500/50 hover:bg-white/15 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Logo Badge & Tier */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${company.accentColor} text-white font-extrabold text-sm flex items-center justify-center shadow-lg`}>
                        {company.logoText}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-white group-hover:text-indigo-300 transition leading-tight">
                          {company.name}
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Briefcase className="w-3 h-3 text-slate-400" />
                          <span>{company.industry}</span>
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      company.tier === 'Enterprise'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    }`}>
                      {company.tier}
                    </span>
                  </div>

                  {/* Company Info Metadata */}
                  <div className="space-y-2 text-xs text-slate-300 mb-4 bg-white/5 p-3 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <MapPin className="w-3.5 h-3.5" /> Standort:
                      </span>
                      <span className="font-medium text-white">{company.city}, {company.country}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Users className="w-3.5 h-3.5" /> Größe:
                      </span>
                      <span className="font-medium text-white">{company.size}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Globe className="w-3.5 h-3.5" /> Website:
                      </span>
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="font-mono text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1"
                      >
                        {company.website.replace('https://', '')}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Linked Deals Summary */}
                  <div className="mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                      Aktive Deals ({companyDeals.length})
                    </p>
                    <div className="space-y-1.5">
                      {companyDeals.map((deal) => (
                        <div
                          key={deal.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDeal(deal);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 flex items-center justify-between text-xs transition"
                        >
                          <span className="font-medium text-white truncate pr-2">
                            {deal.title}
                          </span>
                          <span className="font-mono font-bold text-emerald-400 whitespace-nowrap">
                            {deal.value.toLocaleString('de-DE')} €
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Pipeline Sum & Contacts Count */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {companyContacts.slice(0, 3).map((contact) => (
                        <img
                          key={contact.id}
                          src={contact.avatar}
                          alt={contact.firstName}
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 object-cover"
                          title={`${contact.firstName} ${contact.lastName} (${contact.role})`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {companyContacts.length} Kontakte
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] text-slate-400 uppercase font-semibold">Pipeline Gesamt</p>
                    <p className="text-sm font-extrabold text-white font-mono">
                      {company.totalPipelineValue.toLocaleString('de-DE')} €
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
