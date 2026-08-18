import React from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Database, 
  Users, 
  Server, 
  CheckCircle2, 
  RefreshCw, 
  Zap, 
  Layers, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../types/crm';

interface SettingsViewProps {
  activeProfile: UserProfile;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ activeProfile }) => {
  return (
    <div id="settings-view" className="flex flex-col h-full overflow-y-auto bg-transparent p-8 space-y-6">
      {/* Header */}
      <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shadow-inner">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Einstellungen & Systemstatus
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Matchpoint CRM Konfiguration • HubSpot-Ersatz für 50 Sales Reps • Bereit für Vercel Deployment.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HubSpot Migration Status Card */}
        <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">
                HubSpot Datenmigration
              </h2>
            </div>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
              100% ABGESCHLOSSEN
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Alle Datenobjekte wurden ohne Datenverlust aus der bisherigen HubSpot Professional Instanz in das Matchpoint CRM Schema überführt.
          </p>

          <div className="space-y-2.5 text-xs font-medium">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>B2B Kontakte (Contacts)</span>
              </div>
              <span className="font-mono text-slate-400">10 / 10 synchron</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Unternehmenskonten (Companies)</span>
              </div>
              <span className="font-mono text-slate-400">5 / 5 synchron</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Vertriebs-Pipeline (Deals)</span>
              </div>
              <span className="font-mono text-slate-400">8 / 8 Deals (6 Phasen)</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Handelslizenzen (Sales Reps)</span>
              </div>
              <span className="font-mono text-slate-400">50 Seats aktiv</span>
            </div>
          </div>
        </div>

        {/* Roles & Permissions Matrix */}
        <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white">
                Rollen- & Rechte-Matrix
              </h2>
            </div>
            <span className="text-xs text-slate-400">Aktive Rolle: {activeProfile.roleTitle}</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-amber-300">Super Admin (Klaus Weber)</span>
                <Lock className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-[11px] text-slate-300">
                Einsicht in alle 50 Sales-Rep Pipelines, globale Umsatzanalysen, Phasen-Konfiguration und Benutzerverwaltung.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-indigo-300">Sales Rep (Anna Kowalska)</span>
                <Users className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <p className="text-[11px] text-slate-300">
                Fokusansicht auf zugewiesene Kontakte und Deals, Monatsziel-Tracking (Quota: 85.000 €), Aktivitätsprotokollierung.
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack & Architecture Specs */}
        <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-xl space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2.5 pb-3.5 border-b border-white/10">
            <Server className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">
              Architektur-Spezifikation (Matchpoint CRM)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Frontend Stack</span>
              <p className="font-bold text-white mt-1">React 19 / TypeScript</p>
              <p className="text-slate-400 text-[11px] mt-0.5">Vercel & Next.js kompatibel</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Design System</span>
              <p className="font-bold text-white mt-1">Frosted Glass Theme</p>
              <p className="text-slate-400 text-[11px] mt-0.5">Tailwind CSS 4 + Lucide</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Team Kapazität</span>
              <p className="font-bold text-white mt-1">50 Handelsvertreter</p>
              <p className="text-slate-400 text-[11px] mt-0.5">Optimiert für hohe Deal-Dichte</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Deployment</span>
              <p className="font-bold text-white mt-1">Vercel Zero-Config</p>
              <p className="text-slate-400 text-[11px] mt-0.5">Edge Network & Fast Builds</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
