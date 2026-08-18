import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Filter, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Building2, 
  User, 
  ArrowRight, 
  ArrowLeft,
  ChevronRight,
  Sparkles,
  AlertCircle,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  GripVertical,
  MoveHorizontal,
  Flame,
  Briefcase
} from 'lucide-react';
import { Deal, DealStage, DealStageConfig, UserProfile } from '../types/crm';
import { DEAL_STAGES } from '../data/mockData';

interface PipelineViewProps {
  deals: Deal[];
  activeProfile: UserProfile;
  onUpdateDealStage: (dealId: string, newStage: DealStage) => void;
  onSelectDeal: (deal: Deal) => void;
  onOpenNewDeal: (stage?: DealStage) => void;
}

export const PipelineView: React.FC<PipelineViewProps> = ({
  deals,
  activeProfile,
  onUpdateDealStage,
  onSelectDeal,
  onOpenNewDeal,
}) => {
  const [filterOwner, setFilterOwner] = useState<'all' | 'mine'>(activeProfile.role === 'sales_rep' ? 'mine' : 'all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Drag and drop state
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [dragOverStageId, setDragOverStageId] = useState<DealStage | null>(null);

  // Filter deals
  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      // Owner filter
      if (filterOwner === 'mine' && deal.ownerName !== activeProfile.name) {
        return false;
      }
      // Priority filter
      if (filterPriority !== 'all' && deal.priority !== filterPriority) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = deal.title.toLowerCase().includes(q);
        const matchCompany = deal.companyName.toLowerCase().includes(q);
        const matchContact = deal.contactName.toLowerCase().includes(q);
        const matchOwner = deal.ownerName.toLowerCase().includes(q);
        if (!matchTitle && !matchCompany && !matchContact && !matchOwner) return false;
      }
      return true;
    });
  }, [deals, filterOwner, filterPriority, searchQuery, activeProfile]);

  // Aggregate Metrics
  const totalPipelineValue = useMemo(() => {
    return filteredDeals
      .filter(d => d.stage !== 'closed_lost')
      .reduce((sum, d) => sum + d.value, 0);
  }, [filteredDeals]);

  const weightedForecast = useMemo(() => {
    return filteredDeals
      .filter(d => d.stage !== 'closed_lost')
      .reduce((sum, d) => sum + (d.value * (d.probability / 100)), 0);
  }, [filteredDeals]);

  const wonDealsValue = useMemo(() => {
    return filteredDeals
      .filter(d => d.stage === 'closed_won')
      .reduce((sum, d) => sum + d.value, 0);
  }, [filteredDeals]);

  const wonDealsCount = useMemo(() => {
    return filteredDeals.filter(d => d.stage === 'closed_won').length;
  }, [filteredDeals]);

  // Priority badge styling
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Hoch':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'Mittel':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-white/10 text-slate-300 border-white/10';
    }
  };

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('text/plain', dealId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedDealId(dealId);
  };

  const handleDragOver = (e: React.DragEvent, stageId: DealStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStageId !== stageId) {
      setDragOverStageId(stageId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if leaving to outside column
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragOverStageId(null);
  };

  const handleDrop = (e: React.DragEvent, targetStage: DealStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain') || draggedDealId;
    if (dealId) {
      onUpdateDealStage(dealId, targetStage);
    }
    setDraggedDealId(null);
    setDragOverStageId(null);
  };

  const handleDragEnd = () => {
    setDraggedDealId(null);
    setDragOverStageId(null);
  };

  return (
    <div id="pipeline-view" className="flex flex-col h-full overflow-hidden bg-transparent">
      {/* Top Pipeline Bar: Metrics & Controls */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl px-8 py-4 flex-shrink-0">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-indigo-400" />
                <span>Deal-Pipeline (Kanban)</span>
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {filteredDeals.length} Aktive Transaktionen
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Interaktive HubSpot-Pipeline mit Drag & Drop, Phasensummen und Deal-Direkterstellung.
            </p>
          </div>

          {/* Stats Row with Frosted Glass Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/10 border border-white/20 rounded-2xl p-3.5 backdrop-blur-xl shadow-lg">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Aktywne Deals</p>
              <p className="text-xl font-bold text-white mt-0.5">{filteredDeals.length}</p>
              <div className="mt-0.5 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>50 Reps aktiv</span>
              </div>
            </div>

            <div className="bg-white/10 border border-white/20 rounded-2xl p-3.5 backdrop-blur-xl shadow-lg">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Pipeline-Volumen</p>
              <p className="text-xl font-bold text-white mt-0.5 font-mono truncate">{totalPipelineValue.toLocaleString('de-DE')} €</p>
              <div className="mt-0.5 text-[11px] text-slate-400">Gesamtwert aktiv</div>
            </div>

            <div className="bg-white/10 border border-white/20 rounded-2xl p-3.5 backdrop-blur-xl shadow-lg">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Forecast Gewichtet</p>
              <p className="text-xl font-bold text-indigo-300 mt-0.5 font-mono truncate">{Math.round(weightedForecast).toLocaleString('de-DE')} €</p>
              <div className="mt-0.5 text-[11px] text-indigo-400 font-semibold">Abschluss-Prognose</div>
            </div>

            <div className="bg-white/10 border border-white/20 rounded-2xl p-3.5 backdrop-blur-xl shadow-lg">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Gewonnen (Won)</p>
              <p className="text-xl font-bold text-emerald-400 mt-0.5 font-mono truncate">{wonDealsValue.toLocaleString('de-DE')} €</p>
              <div className="mt-0.5 text-[11px] text-emerald-400 font-semibold">{wonDealsCount} Abschlüsse</div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View scope toggle */}
            <div className="inline-flex p-0.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold backdrop-blur-md">
              <button
                id="filter-deals-all"
                onClick={() => setFilterOwner('all')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterOwner === 'all'
                    ? 'bg-indigo-600/90 text-white shadow-sm border border-indigo-400/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Alle Deals (50 Reps)
              </button>
              <button
                id="filter-deals-mine"
                onClick={() => setFilterOwner('mine')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterOwner === 'mine'
                    ? 'bg-indigo-600/90 text-white shadow-sm border border-indigo-400/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Meine Deals ({activeProfile.name.split(' ')[0]})
              </button>
            </div>

            {/* Priority filter */}
            <select
              id="filter-priority-select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="text-xs font-medium bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 backdrop-blur-md cursor-pointer [&>option]:bg-slate-900"
            >
              <option value="all">Alle Prioritäten</option>
              <option value="Hoch">Priorität: Hoch</option>
              <option value="Mittel">Priorität: Mittel</option>
              <option value="Niedrig">Priorität: Niedrig</option>
            </select>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative w-52">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="In Pipeline suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 w-full text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 backdrop-blur-md"
              />
            </div>
            
            <button
              id="btn-create-deal-header"
              onClick={() => onOpenNewDeal()}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 transition backdrop-blur-md"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>Deal anlegen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex items-start gap-4 min-w-[1450px] h-full pb-4">
          {DEAL_STAGES.map((stageConfig, stageIndex) => {
            const stageDeals = filteredDeals.filter(d => d.stage === stageConfig.id);
            const stageTotalValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
            const isDragOver = dragOverStageId === stageConfig.id;

            return (
              <div
                key={stageConfig.id}
                id={`stage-column-${stageConfig.id}`}
                onDragOver={(e) => handleDragOver(e, stageConfig.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stageConfig.id)}
                className={`w-72 flex-shrink-0 flex flex-col rounded-2xl backdrop-blur-2xl max-h-full overflow-hidden shadow-2xl transition-all duration-200 border ${
                  isDragOver
                    ? 'bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-500/50 shadow-indigo-500/20 scale-[1.01]'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Column Header */}
                <div className="p-3.5 border-b border-white/10 bg-white/5 flex-shrink-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span 
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-[0_0_8px_currentColor]" 
                        style={{ backgroundColor: stageConfig.color, color: stageConfig.color }} 
                      />
                      <h2 className="text-xs font-bold text-white truncate" title={stageConfig.label}>
                        {stageConfig.label}
                      </h2>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                        {stageDeals.length}
                      </span>
                      
                      {/* Add Deal Directly to this Stage Button */}
                      <button
                        onClick={() => onOpenNewDeal(stageConfig.id)}
                        className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white border border-white/10 transition"
                        title={`Neuen Deal in '${stageConfig.label}' erstellen`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Header Subtext: Summe & Wahrscheinlichkeit */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-1 pt-1.5 border-t border-white/5">
                    <span className="text-emerald-400 font-bold">
                      {stageTotalValue.toLocaleString('de-DE')} €
                    </span>
                    <span className="text-slate-400">
                      {stageConfig.probability}% Wsk.
                    </span>
                  </div>
                </div>

                {/* Deal Cards Scrollable Container */}
                <div className="p-3 flex-1 overflow-y-auto space-y-3 min-h-[220px]">
                  {stageDeals.length === 0 ? (
                    <div className={`h-36 flex flex-col items-center justify-center text-center p-3 border border-dashed rounded-xl transition ${
                      isDragOver ? 'border-indigo-400 bg-indigo-500/10 text-indigo-300' : 'border-white/10 text-slate-500'
                    }`}>
                      <p className="text-xs font-medium">
                        {isDragOver ? 'Hier ablegen' : 'Keine Deals in dieser Phase'}
                      </p>
                      <button
                        onClick={() => onOpenNewDeal(stageConfig.id)}
                        className="mt-2 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Deal hinzufügen</span>
                      </button>
                    </div>
                  ) : (
                    stageDeals.map((deal) => {
                      const isBeingDragged = draggedDealId === deal.id;

                      return (
                        <div
                          key={deal.id}
                          id={`deal-card-${deal.id}`}
                          draggable={true}
                          onDragStart={(e) => handleDragStart(e, deal.id)}
                          onDragEnd={handleDragEnd}
                          onClick={() => onSelectDeal(deal)}
                          className={`p-3.5 rounded-xl border backdrop-blur-xl transition-all cursor-grab active:cursor-grabbing group shadow-md select-none ${
                            isBeingDragged 
                              ? 'opacity-40 border-dashed border-indigo-400 scale-95' 
                              : deal.stage === 'closed_won'
                              ? 'bg-emerald-950/40 border-emerald-500/30 hover:border-emerald-400/60 hover:bg-emerald-950/60 text-white'
                              : deal.stage === 'closed_lost'
                              ? 'bg-rose-950/30 border-rose-500/20 hover:border-rose-400/40 text-slate-300'
                              : 'bg-white/10 border-white/10 hover:border-indigo-500/50 hover:bg-white/15 text-white'
                          }`}
                        >
                          {/* Priority & Value Header */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityBadge(deal.priority)}`}>
                              {deal.priority}
                            </span>
                            <span className="text-sm font-extrabold text-white font-mono">
                              {deal.value.toLocaleString('de-DE')} €
                            </span>
                          </div>

                          {/* Title & Grip */}
                          <div className="flex items-start gap-1.5 mb-1.5">
                            <GripVertical className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 flex-shrink-0 mt-0.5" />
                            <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition leading-snug line-clamp-2">
                              {deal.title}
                            </h4>
                          </div>

                          {/* Associated Company */}
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-medium mb-3 pl-5">
                            <Building2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                            <span className="truncate">{deal.companyName}</span>
                          </div>

                          {/* Footer: Owner & Expected Close Date */}
                          <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-[9px] text-indigo-300">
                                {deal.ownerName.split(' ').map(n => n[0]).join('')}
                              </span>
                              <span className="truncate text-xs font-medium text-slate-200">{deal.ownerName}</span>
                            </div>
                            <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{deal.expectedCloseDate.slice(5)}</span>
                            </div>
                          </div>

                          {/* Quick Stage Shift Dropdown & Buttons */}
                          <div 
                            className="mt-2.5 pt-2 border-t border-dashed border-white/10 flex items-center justify-between gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              disabled={stageIndex === 0}
                              onClick={() => onUpdateDealStage(deal.id, DEAL_STAGES[stageIndex - 1].id)}
                              className="p-1 px-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition text-[10px] font-semibold flex items-center gap-1 border border-white/5"
                              title="Eine Phase zurückschieben"
                            >
                              <ArrowLeft className="w-3 h-3" />
                              <span>Zurück</span>
                            </button>

                            {/* Dropdown for direct stage switch */}
                            <select
                              value={deal.stage}
                              onChange={(e) => onUpdateDealStage(deal.id, e.target.value as DealStage)}
                              className="text-[10px] font-semibold bg-white/5 border border-white/10 rounded-lg px-1.5 py-0.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 [&>option]:bg-slate-900"
                            >
                              {DEAL_STAGES.map(s => (
                                <option key={s.id} value={s.id}>{s.label.split('.')[1] || s.label}</option>
                              ))}
                            </select>

                            <button
                              disabled={stageIndex === DEAL_STAGES.length - 1}
                              onClick={() => onUpdateDealStage(deal.id, DEAL_STAGES[stageIndex + 1].id)}
                              className="p-1 px-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition text-[10px] font-bold flex items-center gap-1 border border-indigo-500/30"
                              title="In nächste Phase verschieben"
                            >
                              <span>Vor</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Column Bottom Quick-Add Action */}
                  <button
                    onClick={() => onOpenNewDeal(stageConfig.id)}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-dashed border-white/10 hover:border-white/20 text-slate-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Deal in dieser Phase</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
