import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  User, 
  Mail, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Tag, 
  FileText,
  Trash2,
  Save,
  ArrowRight
} from 'lucide-react';
import { Deal, DealStage, DealPriority, UserProfile } from '../types/crm';
import { DEAL_STAGES } from '../data/mockData';

interface DealDetailModalProps {
  deal: Deal;
  onClose: () => void;
  onUpdateDeal: (updated: Deal) => void;
  onDeleteDeal: (dealId: string) => void;
}

export const DealDetailModal: React.FC<DealDetailModalProps> = ({
  deal,
  onClose,
  onUpdateDeal,
  onDeleteDeal,
}) => {
  const [title, setTitle] = useState(deal.title);
  const [value, setValue] = useState(deal.value.toString());
  const [stage, setStage] = useState<DealStage>(deal.stage);
  const [priority, setPriority] = useState<DealPriority>(deal.priority);
  const [probability, setProbability] = useState(deal.probability.toString());
  const [expectedCloseDate, setExpectedCloseDate] = useState(deal.expectedCloseDate);
  const [notes, setNotes] = useState(deal.notes);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Deal = {
      ...deal,
      title,
      value: parseFloat(value) || 0,
      stage,
      priority,
      probability: parseInt(probability, 10) || 0,
      expectedCloseDate,
      notes,
      lastActivity: 'Deal-Details aktualisiert',
    };
    onUpdateDeal(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const currentStageConfig = DEAL_STAGES.find(s => s.id === stage) || DEAL_STAGES[0];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900/90 rounded-2xl border border-white/20 w-full max-w-2xl shadow-2xl overflow-hidden my-8 backdrop-blur-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-full shadow-sm" 
              style={{ backgroundColor: currentStageConfig.color }} 
            />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Deal-Akte • ID #{deal.id}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Deal-Titel
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-base font-bold bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 border border-white/10 text-xs">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Unternehmen</p>
                <p className="font-bold text-white">{deal.companyName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Hauptkontakt & Betreuer</p>
                <p className="font-bold text-white">{deal.contactName} ({deal.ownerName})</p>
              </div>
            </div>
          </div>

          {/* Stage & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Vertriebsphase (Stage)
              </label>
              <select
                value={stage}
                onChange={(e) => {
                  const newStage = e.target.value as DealStage;
                  setStage(newStage);
                  const st = DEAL_STAGES.find(s => s.id === newStage);
                  if (st) setProbability(st.probability.toString());
                }}
                className="w-full text-xs font-semibold bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 [&>option]:bg-slate-900"
              >
                {DEAL_STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label} ({s.probability}%)
                  </option>
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

          {/* Value & Probability & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Deal-Wert (€)
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
                Abschlusswsk. (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={probability}
                onChange={(e) => setProbability(e.target.value)}
                className="w-full text-xs font-mono bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Erwarteter Abschluss
              </label>
              <input
                type="date"
                value={expectedCloseDate}
                onChange={(e) => setExpectedCloseDate(e.target.value)}
                className="w-full text-xs font-mono bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Verhandlungshistorie & HubSpot Notizen
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notizen, Einwände, nächste Schritte..."
              className="w-full text-xs bg-white/5 border border-white/10 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                if (confirm('Diesen Deal wirklich löschen?')) {
                  onDeleteDeal(deal.id);
                  onClose();
                }
              }}
              className="px-3.5 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 rounded-lg flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Deal löschen</span>
            </button>

            <div className="flex items-center gap-2.5">
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
                <span>{savedSuccess ? 'Gespeichert!' : 'Änderungen speichern'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
