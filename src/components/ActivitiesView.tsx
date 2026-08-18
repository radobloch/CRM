import React, { useState } from 'react';
import { 
  CheckSquare, 
  PhoneCall, 
  Mail, 
  Calendar, 
  FileText, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Clock, 
  User, 
  Building2,
  Filter,
  Check
} from 'lucide-react';
import { Activity, ActivityType, UserProfile } from '../types/crm';

interface ActivitiesViewProps {
  activities: Activity[];
  activeProfile: UserProfile;
  onToggleActivityComplete: (id: string) => void;
  onAddActivity: (activity: Omit<Activity, 'id'>) => void;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  activities,
  activeProfile,
  onToggleActivityComplete,
  onAddActivity,
}) => {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isNewActivityModalOpen, setIsNewActivityModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ActivityType>('call');
  const [newContact, setNewContact] = useState('Markus Lindner');
  const [newCompany, setNewCompany] = useState('Bavaria Logistics AG');
  const [newDescription, setNewDescription] = useState('');

  const filteredActivities = activities.filter(act => {
    if (typeFilter !== 'all' && act.type !== typeFilter) return false;
    return true;
  });

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'call':
        return <PhoneCall className="w-4 h-4 text-emerald-500" />;
      case 'meeting':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'email':
        return <Mail className="w-4 h-4 text-sky-500" />;
      case 'task':
        return <CheckSquare className="w-4 h-4 text-amber-500" />;
      case 'note':
        return <FileText className="w-4 h-4 text-indigo-500" />;
    }
  };

  const getActivityTypeLabel = (type: ActivityType) => {
    switch (type) {
      case 'call': return 'Telefonat';
      case 'meeting': return 'Meeting';
      case 'email': return 'E-Mail';
      case 'task': return 'Aufgabe';
      case 'note': return 'Notiz';
    }
  };

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddActivity({
      type: newType,
      title: newTitle,
      description: newDescription || 'Keine Beschreibung angegeben.',
      date: 'Heute',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contactName: newContact,
      companyName: newCompany,
      authorName: activeProfile.name,
      completed: newType === 'task' ? false : true,
    });

    setNewTitle('');
    setNewDescription('');
    setIsNewActivityModalOpen(false);
  };

  return (
    <div id="activities-view" className="flex flex-col h-full overflow-hidden bg-transparent">
      {/* Header Bar */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl px-8 py-5 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Aktivitäten & Aufgaben
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-white/10 text-slate-300 border border-white/10">
                {activities.length} Protokolle
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Historie aller Telefonate, E-Mails, Termine und offener Vertriebsaufgaben für 50 Reps.
            </p>
          </div>

          <button
            onClick={() => setIsNewActivityModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/25 transition backdrop-blur-md"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Aktivität erfassen</span>
          </button>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-white/10 overflow-x-auto">
          {['all', 'task', 'call', 'meeting', 'email', 'note'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition backdrop-blur-md ${
                typeFilter === type
                  ? 'bg-white/20 text-white border border-white/20 shadow-sm'
                  : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-white'
              }`}
            >
              {type === 'all' && 'Alle Aktivitäten'}
              {type === 'task' && 'Aufgaben (Tasks)'}
              {type === 'call' && 'Telefonate'}
              {type === 'meeting' && 'Meetings'}
              {type === 'email' && 'E-Mails'}
              {type === 'note' && 'Notizen'}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className={`p-5 rounded-2xl border backdrop-blur-xl shadow-xl transition ${
                act.completed 
                  ? 'bg-white/10 border-white/10 hover:bg-white/15' 
                  : 'bg-amber-500/10 border-amber-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  {/* Activity Type Icon Container */}
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-inner">
                    {getActivityIcon(act.type)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                        {getActivityTypeLabel(act.type)}
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {act.title}
                      </h4>
                      {act.dueDate && (
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                          Fällig: {act.dueDate}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                      {act.description}
                    </p>

                    {/* Metadata Footer */}
                    <div className="flex items-center gap-4 mt-3.5 text-[11px] text-slate-400 font-medium flex-wrap">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <strong>{act.contactName}</strong>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {act.companyName}
                      </span>
                      <span className="flex items-center gap-1.5 font-mono text-[10px]">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {act.date} • {act.time}
                      </span>
                      <span className="text-slate-400">
                        Erfasst von: {act.authorName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Task Done Checkbox */}
                {act.type === 'task' && (
                  <button
                    onClick={() => onToggleActivityComplete(act.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                      act.completed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15'
                    }`}
                  >
                    {act.completed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Erledigt</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4 text-slate-400" />
                        <span>Als erledigt markieren</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal to Add Activity */}
      {isNewActivityModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900/90 rounded-2xl border border-white/20 w-full max-w-lg shadow-2xl p-6 backdrop-blur-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              Neue Vertriebsaktivität protokollieren
            </h3>

            <form onSubmit={handleCreateActivity} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Aktivitätstyp
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['call', 'meeting', 'email', 'task', 'note'] as ActivityType[]).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setNewType(t)}
                      className={`py-2.5 px-1 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition ${
                        newType === t
                          ? 'bg-indigo-500/30 border-indigo-500 text-indigo-200'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {getActivityIcon(t)}
                      <span>{getActivityTypeLabel(t)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Titel / Betreff
                </label>
                <input
                  type="text"
                  required
                  placeholder="z.B. Folge-Meeting zur CRM-Architektur vereinbart"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs bg-white/5 border border-white/10 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kontakt
                  </label>
                  <input
                    type="text"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    className="w-full text-xs bg-white/5 border border-white/10 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Firma
                  </label>
                  <input
                    type="text"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full text-xs bg-white/5 border border-white/10 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Details & Notizen
                </label>
                <textarea
                  rows={3}
                  placeholder="Besprochene Konditionen, nächste To-Dos..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full text-xs bg-white/5 border border-white/10 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3.5 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsNewActivityModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 rounded-lg transition"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-indigo-500/25 transition"
                >
                  Aktivität speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
