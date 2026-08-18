import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  Tag, 
  DollarSign, 
  User, 
  CheckCircle2, 
  Circle, 
  Plus, 
  FileText, 
  PhoneCall, 
  Send, 
  Clock, 
  ChevronDown, 
  ChevronRight, 
  ExternalLink, 
  Paperclip, 
  MoreHorizontal, 
  Check, 
  Copy, 
  Layers, 
  Sparkles, 
  Edit3, 
  Share2, 
  Trash2,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { Contact, Company, Deal, Activity, ActivityType, UserProfile, ContactStatus } from '../types/crm';
import { AIAssistantWidget } from './AIAssistantWidget';

interface ContactRecordPageProps {
  contact: Contact;
  companies: Company[];
  deals: Deal[];
  activities: Activity[];
  activeProfile: UserProfile;
  onBack: () => void;
  onUpdateContact: (contact: Contact) => void;
  onSelectDeal: (deal: Deal) => void;
  onSelectCompany: (company: Company) => void;
  onAddActivity: (activity: Omit<Activity, 'id'>) => void;
  onToggleActivityComplete: (activityId: string) => void;
  onOpenNewDeal: () => void;
}

export const ContactRecordPage: React.FC<ContactRecordPageProps> = ({
  contact,
  companies,
  deals,
  activities,
  activeProfile,
  onBack,
  onUpdateContact,
  onSelectDeal,
  onSelectCompany,
  onAddActivity,
  onToggleActivityComplete,
  onOpenNewDeal,
}) => {
  // Activity Composer State
  const [activeComposerTab, setActiveComposerTab] = useState<'note' | 'email' | 'call' | 'task' | 'meeting'>('note');
  
  // Note Form
  const [noteContent, setNoteContent] = useState('');
  // Email Form
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  // Call Form
  const [callOutcome, setCallOutcome] = useState('Erreicht / Positives Feedback');
  const [callDuration, setCallDuration] = useState('15 Minuten');
  const [callNotes, setCallNotes] = useState('');
  // Task Form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('Morgen, 10:00 Uhr');
  // Meeting Form
  const [meetingTitle, setMeetingTitle] = useState('Discovery & Matchpoint Demo');
  const [meetingDate, setMeetingDate] = useState('2026-08-25 14:00');

  // Activity stream filter
  const [activityFilter, setActivityFilter] = useState<'all' | ActivityType>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Editable Contact State
  const [isEditingProps, setIsEditingProps] = useState(false);
  const [editEmail, setEditEmail] = useState(contact.email);
  const [editPhone, setEditPhone] = useState(contact.phone);
  const [editRole, setEditRole] = useState(contact.role);
  const [editStatus, setEditStatus] = useState<ContactStatus>(contact.status);
  const [editLifecycleStage, setEditLifecycleStage] = useState(contact.lifecycleStage || 'Lead');
  const [editLeadStatus, setEditLeadStatus] = useState(contact.leadStatus || 'In Bearbeitung');
  const [editPotential, setEditPotential] = useState(contact.dealValuePotential.toString());
  const [editOwner, setEditOwner] = useState(contact.ownerName);

  // Associated records
  const associatedCompany = companies.find(c => c.id === contact.companyId) || companies[0];
  const associatedDeals = deals.filter(d => d.contactId === contact.id || d.companyId === contact.companyId);
  const contactActivities = activities.filter(a => 
    a.contactName.toLowerCase().includes(contact.lastName.toLowerCase()) ||
    a.companyName.toLowerCase().includes(contact.companyName.toLowerCase())
  );

  const filteredActivities = contactActivities.filter(a => {
    if (activityFilter === 'all') return true;
    return a.type === activityFilter;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    showToast(`${field} in die Zwischenablage kopiert`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveProperties = () => {
    onUpdateContact({
      ...contact,
      email: editEmail,
      phone: editPhone,
      role: editRole,
      status: editStatus,
      lifecycleStage: editLifecycleStage,
      leadStatus: editLeadStatus,
      dealValuePotential: parseFloat(editPotential) || 0,
      ownerName: editOwner,
    });
    setIsEditingProps(false);
    showToast('Kontakteigenschaften erfolgreich gespeichert');
  };

  // Submit Note
  const handleSubmitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    onAddActivity({
      type: 'note',
      title: `Notiz zu ${contact.firstName} ${contact.lastName}`,
      description: noteContent,
      date: 'Heute',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contactName: `${contact.firstName} ${contact.lastName}`,
      companyName: contact.companyName,
      authorName: activeProfile.name,
      completed: true,
    });

    setNoteContent('');
    showToast('Notiz zur HubSpot Timeline hinzugefügt');
  };

  // Submit Email
  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject.trim()) return;

    onAddActivity({
      type: 'email',
      title: `E-Mail: ${emailSubject}`,
      description: emailBody || 'Kein zusätzlicher E-Mail-Text hinterlegt.',
      date: 'Heute',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contactName: `${contact.firstName} ${contact.lastName}`,
      companyName: contact.companyName,
      authorName: activeProfile.name,
      completed: true,
    });

    setEmailSubject('');
    setEmailBody('');
    showToast(`E-Mail an ${contact.email} gesendet & protokolliert`);
  };

  // Submit Call
  const handleSubmitCall = (e: React.FormEvent) => {
    e.preventDefault();

    onAddActivity({
      type: 'call',
      title: `Anruf (${callOutcome}) • ${callDuration}`,
      description: callNotes || 'Telefonat erfolgreich abgeschlossen.',
      date: 'Heute',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contactName: `${contact.firstName} ${contact.lastName}`,
      companyName: contact.companyName,
      authorName: activeProfile.name,
      completed: true,
    });

    setCallNotes('');
    showToast('Anruf im Protokoll gespeichert');
  };

  // Submit Task
  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    onAddActivity({
      type: 'task',
      title: taskTitle,
      description: `Fällig: ${taskDueDate} • Verantwortlich: ${activeProfile.name}`,
      date: 'Heute',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contactName: `${contact.firstName} ${contact.lastName}`,
      companyName: contact.companyName,
      authorName: activeProfile.name,
      completed: false,
      dueDate: taskDueDate,
    });

    setTaskTitle('');
    showToast('Aufgabe für Kontakt erstellt');
  };

  // Submit Meeting
  const handleSubmitMeeting = (e: React.FormEvent) => {
    e.preventDefault();

    onAddActivity({
      type: 'meeting',
      title: meetingTitle,
      description: `Termin angesetzt für: ${meetingDate}. Teilnehmer: ${contact.firstName} ${contact.lastName}, ${activeProfile.name}.`,
      date: 'Heute',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contactName: `${contact.firstName} ${contact.lastName}`,
      companyName: contact.companyName,
      authorName: activeProfile.name,
      completed: false,
    });

    showToast('Meeting im Kalender eingetragen');
  };

  return (
    <div id="contact-record-page" className="flex flex-col h-full overflow-hidden bg-transparent">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-6 z-50 bg-indigo-600/90 text-white text-xs font-bold px-5 py-3 rounded-xl border border-indigo-400/40 shadow-2xl backdrop-blur-xl flex items-center gap-2.5 animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Record Top Bar */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl px-8 py-3.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-2 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Zurück zur Kontaktliste</span>
          </button>
          
          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Kontakte</span>
            <span>/</span>
            <span className="font-bold text-white">
              {contact.firstName} {contact.lastName}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-slate-300 border border-white/10">
              ID #{contact.id}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenNewDeal()}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Deal erstellen</span>
          </button>
        </div>
      </div>

      {/* 3-Column HubSpot Record Layout */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-7xl mx-auto">
          
          {/* ======================================================== */}
          {/* LEFT PANEL: Contact Data & Properties (3.5 cols) */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 space-y-5">
            {/* Contact Header Card */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-start gap-4">
                <img
                  src={contact.avatar}
                  alt=""
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/40 shadow-md"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold text-white truncate">
                    {contact.firstName} {contact.lastName}
                  </h2>
                  <p className="text-xs text-slate-300 font-medium mt-0.5 truncate">
                    {contact.role}
                  </p>
                  <p className="text-xs text-indigo-400 font-semibold mt-0.5 truncate">
                    {contact.companyName}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2.5">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {contact.lifecycleStage || contact.status}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                      {contact.leadStatus || 'Qualifiziert'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Action Icons Bar (HubSpot UX) */}
              <div className="grid grid-cols-5 gap-2 mt-6 pt-5 border-t border-white/10">
                <button
                  onClick={() => setActiveComposerTab('note')}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/5 hover:bg-indigo-600/30 hover:border-indigo-500/40 border border-white/5 text-slate-300 hover:text-white transition group"
                >
                  <FileText className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition" />
                  <span className="text-[10px] font-semibold">Notiz</span>
                </button>
                <button
                  onClick={() => setActiveComposerTab('email')}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/5 hover:bg-sky-600/30 hover:border-sky-500/40 border border-white/5 text-slate-300 hover:text-white transition group"
                >
                  <Mail className="w-4 h-4 text-sky-400 group-hover:scale-110 transition" />
                  <span className="text-[10px] font-semibold">E-Mail</span>
                </button>
                <button
                  onClick={() => setActiveComposerTab('call')}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/5 hover:bg-emerald-600/30 hover:border-emerald-500/40 border border-white/5 text-slate-300 hover:text-white transition group"
                >
                  <Phone className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
                  <span className="text-[10px] font-semibold">Anruf</span>
                </button>
                <button
                  onClick={() => setActiveComposerTab('task')}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/5 hover:bg-amber-600/30 hover:border-amber-500/40 border border-white/5 text-slate-300 hover:text-white transition group"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
                  <span className="text-[10px] font-semibold">Aufgabe</span>
                </button>
                <button
                  onClick={() => setActiveComposerTab('meeting')}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/5 hover:bg-purple-600/30 hover:border-purple-500/40 border border-white/5 text-slate-300 hover:text-white transition group"
                >
                  <Calendar className="w-4 h-4 text-purple-400 group-hover:scale-110 transition" />
                  <span className="text-[10px] font-semibold">Meeting</span>
                </button>
              </div>
            </div>

            {/* Properties Card (Über diesen Kontakt) */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Über diesen Kontakt</span>
                </h3>
                <button
                  onClick={() => {
                    if (isEditingProps) handleSaveProperties();
                    else setIsEditingProps(true);
                  }}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingProps ? 'Speichern' : 'Bearbeiten'}</span>
                </button>
              </div>

              {isEditingProps ? (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      E-Mail-Adresse
                    </label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Telefon
                    </label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Lifecycle-Phase
                    </label>
                    <select
                      value={editLifecycleStage}
                      onChange={(e) => setEditLifecycleStage(e.target.value)}
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 [&>option]:bg-slate-900"
                    >
                      <option value="Lead">Lead</option>
                      <option value="Marketing Qualified (MQL)">Marketing Qualified (MQL)</option>
                      <option value="Sales Qualified (SQL)">Sales Qualified (SQL)</option>
                      <option value="Opportunity">Opportunity</option>
                      <option value="Kunde">Kunde (Customer)</option>
                      <option value="Evangelist">Evangelist</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Betreuer / Owner
                    </label>
                    <select
                      value={editOwner}
                      onChange={(e) => setEditOwner(e.target.value)}
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 [&>option]:bg-slate-900"
                    >
                      <option value="Anna Kowalska">Anna Kowalska</option>
                      <option value="Klaus Weber">Klaus Weber</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Deal-Potenzial (€)
                    </label>
                    <input
                      type="number"
                      value={editPotential}
                      onChange={(e) => setEditPotential(e.target.value)}
                      className="w-full text-xs font-mono bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSaveProperties}
                      className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
                    >
                      Speichern
                    </button>
                    <button
                      onClick={() => setIsEditingProps(false)}
                      className="px-3 py-2 bg-white/10 text-slate-300 rounded-lg text-xs font-semibold"
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5 text-xs">
                  {/* Email */}
                  <div className="flex items-center justify-between group">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                        E-Mail
                      </span>
                      <a 
                        href={`mailto:${contact.email}`}
                        className="font-medium text-white hover:text-indigo-300 transition"
                      >
                        {contact.email}
                      </a>
                    </div>
                    <button
                      onClick={() => handleCopy(contact.email, 'E-Mail')}
                      className="p-1 rounded bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition"
                    >
                      {copiedField === 'E-Mail' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center justify-between group">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                        Telefonnummer
                      </span>
                      <a 
                        href={`tel:${contact.phone}`}
                        className="font-medium text-white hover:text-indigo-300 transition font-mono"
                      >
                        {contact.phone}
                      </a>
                    </div>
                    <button
                      onClick={() => handleCopy(contact.phone, 'Telefon')}
                      className="p-1 rounded bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition"
                    >
                      {copiedField === 'Telefon' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Mobile Phone */}
                  {contact.mobilePhone && (
                    <div className="flex items-center justify-between group">
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                          Mobiltelefon
                        </span>
                        <span className="font-medium text-white font-mono">{contact.mobilePhone}</span>
                      </div>
                    </div>
                  )}

                  {/* Contact Owner */}
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                      Kontaktinhaber (Owner)
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/30 border border-indigo-500/40 flex items-center justify-center text-[10px] font-bold text-indigo-300">
                        {contact.ownerName[0]}
                      </div>
                      <span className="font-semibold text-white">{contact.ownerName}</span>
                    </div>
                  </div>

                  {/* Lifecycle Stage */}
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                      Lifecycle-Phase
                    </span>
                    <span className="inline-block mt-1 font-semibold px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {contact.lifecycleStage || contact.status}
                    </span>
                  </div>

                  {/* Deal Potential */}
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                      Geschätztes Deal-Potenzial
                    </span>
                    <span className="text-sm font-extrabold text-emerald-400 font-mono block mt-0.5">
                      {contact.dealValuePotential.toLocaleString('de-DE')} €
                    </span>
                  </div>

                  {/* Last Contacted */}
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                      Zuletzt kontaktiert
                    </span>
                    <span className="text-slate-300 font-medium block mt-0.5">
                      {contact.lastContacted}
                    </span>
                  </div>

                  {/* Tags */}
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block mb-1.5">
                      Segmente & Tags
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {contact.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/10 border border-white/10 text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* MIDDLE PANEL: Activity Timeline & Composer (5.5 cols) */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 space-y-6">
            {/* AI Assistant (Gemini) Widget */}
            <AIAssistantWidget
              contact={contact}
              company={associatedCompany}
              deals={associatedDeals}
              onInsertNote={(text) => {
                setActiveComposerTab('note');
                setNoteContent(text);
                showToast('Wstawiono podsumowanie AI do notatki');
              }}
              onInsertEmail={(subject, body) => {
                setActiveComposerTab('email');
                setEmailSubject(subject);
                setEmailBody(body);
                showToast('Wstawiono draft AI do formularza e-mail');
              }}
            />

            {/* Activity Composer Box */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden">
              {/* Composer Tab Header */}
              <div className="flex items-center border-b border-white/10 bg-white/5 px-4">
                <button
                  onClick={() => setActiveComposerTab('note')}
                  className={`py-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition ${
                    activeComposerTab === 'note'
                      ? 'border-indigo-500 text-indigo-300 bg-white/5'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Notiz</span>
                </button>
                <button
                  onClick={() => setActiveComposerTab('email')}
                  className={`py-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition ${
                    activeComposerTab === 'email'
                      ? 'border-sky-500 text-sky-300 bg-white/5'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>E-Mail</span>
                </button>
                <button
                  onClick={() => setActiveComposerTab('call')}
                  className={`py-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition ${
                    activeComposerTab === 'call'
                      ? 'border-emerald-500 text-emerald-300 bg-white/5'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Anruf</span>
                </button>
                <button
                  onClick={() => setActiveComposerTab('task')}
                  className={`py-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition ${
                    activeComposerTab === 'task'
                      ? 'border-amber-500 text-amber-300 bg-white/5'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Aufgabe</span>
                </button>
                <button
                  onClick={() => setActiveComposerTab('meeting')}
                  className={`py-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition ${
                    activeComposerTab === 'meeting'
                      ? 'border-purple-500 text-purple-300 bg-white/5'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Meeting</span>
                </button>
              </div>

              {/* Composer Content Form */}
              <div className="p-5">
                {activeComposerTab === 'note' && (
                  <form onSubmit={handleSubmitNote} className="space-y-3">
                    <textarea
                      rows={3}
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder={`Notiz zu ${contact.firstName} hinzufügen (z.B. Feedback aus dem letzten Gespräch)...`}
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400">
                        Wird in der HubSpot-Historie für alle 50 Reps synchronisiert
                      </span>
                      <button
                        type="submit"
                        disabled={!noteContent.trim()}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition"
                      >
                        Notiz speichern
                      </button>
                    </div>
                  </form>
                )}

                {activeComposerTab === 'email' && (
                  <form onSubmit={handleSubmitEmail} className="space-y-3">
                    <div className="text-xs text-slate-400 flex items-center gap-2 pb-1 border-b border-white/10">
                      <span>An:</span>
                      <span className="text-white font-semibold">{contact.email}</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Betreff / Subject line..."
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    <textarea
                      rows={3}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="E-Mail-Inhalt oder Vorlage einfügen..."
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400">
                        Über verbundenes Postfach (SMTP/IMAP)
                      </span>
                      <button
                        type="submit"
                        disabled={!emailSubject.trim()}
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-500/25 flex items-center gap-1.5 transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>E-Mail senden & tracken</span>
                      </button>
                    </div>
                  </form>
                )}

                {activeComposerTab === 'call' && (
                  <form onSubmit={handleSubmitCall} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                          Ergebnis des Anrufs
                        </label>
                        <select
                          value={callOutcome}
                          onChange={(e) => setCallOutcome(e.target.value)}
                          className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 [&>option]:bg-slate-900"
                        >
                          <option value="Erreicht / Positives Feedback">Erreicht / Positives Feedback</option>
                          <option value="Mailbox hinterlassen">Mailbox hinterlassen</option>
                          <option value="Nicht erreicht / Besetzt">Nicht erreicht / Besetzt</option>
                          <option value="Falsche Nummer / Nicht interessiert">Nicht interessiert</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                          Dauer
                        </label>
                        <input
                          type="text"
                          value={callDuration}
                          onChange={(e) => setCallDuration(e.target.value)}
                          className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                    <textarea
                      rows={2}
                      value={callNotes}
                      onChange={(e) => setCallNotes(e.target.value)}
                      placeholder="Wichtige Gesprächspunkte & nächste Vereinbarungen..."
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 transition"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Anruf protokollieren</span>
                      </button>
                    </div>
                  </form>
                )}

                {activeComposerTab === 'task' && (
                  <form onSubmit={handleSubmitTask} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Aufgabentitel (z.B. Angebot überarbeiten)..."
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                          Fälligkeitsdatum & Uhrzeit
                        </label>
                        <input
                          type="text"
                          value={taskDueDate}
                          onChange={(e) => setTaskDueDate(e.target.value)}
                          className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                          Priorität
                        </label>
                        <select className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 [&>option]:bg-slate-900">
                          <option value="Hoch">Hoch</option>
                          <option value="Mittel">Mittel</option>
                          <option value="Niedrig">Niedrig</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        disabled={!taskTitle.trim()}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-1.5 transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Aufgabe anlegen</span>
                      </button>
                    </div>
                  </form>
                )}

                {activeComposerTab === 'meeting' && (
                  <form onSubmit={handleSubmitMeeting} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Meeting-Titel..."
                      value={meetingTitle}
                      onChange={(e) => setMeetingTitle(e.target.value)}
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                          Datum & Uhrzeit
                        </label>
                        <input
                          type="text"
                          value={meetingDate}
                          onChange={(e) => setMeetingDate(e.target.value)}
                          className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                          Ort / Link
                        </label>
                        <input
                          type="text"
                          defaultValue="Google Meet Video Call"
                          className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-500/25 flex items-center gap-1.5 transition"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Termin ansetzen</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Timeline Filter Header */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>Aktivitäten-Timeline ({contactActivities.length})</span>
                </h3>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 text-[11px]">
                  <button
                    onClick={() => setActivityFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                      activityFilter === 'all'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Alle
                  </button>
                  <button
                    onClick={() => setActivityFilter('note')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                      activityFilter === 'note'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Notizen
                  </button>
                  <button
                    onClick={() => setActivityFilter('email')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                      activityFilter === 'email'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    E-Mails
                  </button>
                  <button
                    onClick={() => setActivityFilter('call')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                      activityFilter === 'call'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Anrufe
                  </button>
                  <button
                    onClick={() => setActivityFilter('task')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                      activityFilter === 'task'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Aufgaben
                  </button>
                </div>
              </div>

              {/* Timeline Stream */}
              <div className="space-y-4">
                {filteredActivities.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 text-xs">
                    Keine Aktivitäten in diesem Filter vorhanden. Nutzen Sie die Aktionsleiste oben, um eine Notiz oder einen Anruf zu erfassen.
                  </div>
                ) : (
                  filteredActivities.map((act) => (
                    <div
                      key={act.id}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition relative pl-10 group"
                    >
                      {/* Activity Type Icon Dot */}
                      <div className="absolute left-3.5 top-4 w-4 h-4 rounded-full flex items-center justify-center">
                        {act.type === 'note' && <FileText className="w-3.5 h-3.5 text-indigo-400" />}
                        {act.type === 'email' && <Mail className="w-3.5 h-3.5 text-sky-400" />}
                        {act.type === 'call' && <Phone className="w-3.5 h-3.5 text-emerald-400" />}
                        {act.type === 'task' && (
                          <button onClick={() => onToggleActivityComplete(act.id)}>
                            {act.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-amber-400 hover:text-emerald-400" />
                            )}
                          </button>
                        )}
                        {act.type === 'meeting' && <Calendar className="w-3.5 h-3.5 text-purple-400" />}
                      </div>

                      {/* Header info */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white group-hover:text-indigo-300 transition">
                          {act.title}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {act.date} • {act.time}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                        {act.description}
                      </p>

                      {/* Footer / Author */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-white/5">
                        <span>Erfasst von: <strong className="text-slate-200">{act.authorName}</strong></span>
                        {act.dealTitle && (
                          <span className="text-indigo-400 truncate max-w-[200px]">
                            Deal: {act.dealTitle}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT PANEL: Associated Objects (Company, Deals) (3 cols) */}
          {/* ======================================================== */}
          <div className="lg:col-span-3 space-y-5">
            
            {/* Associated Company Card */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-xl space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Unternehmen</span>
                </h3>
                <button
                  onClick={() => onSelectCompany(associatedCompany)}
                  className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>Details</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {associatedCompany ? (
                <div 
                  onClick={() => onSelectCompany(associatedCompany)}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${associatedCompany.accentColor} text-white font-extrabold text-xs flex items-center justify-center shadow-md`}>
                      {associatedCompany.logoText}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">{associatedCompany.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{associatedCompany.industry}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Pipeline-Wert:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {associatedCompany.totalPipelineValue.toLocaleString('de-DE')} €
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Kein primäres Unternehmen zugewiesen.</p>
              )}
            </div>

            {/* Associated Deals Card */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-xl space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Deals ({associatedDeals.length})</span>
                </h3>
                <button
                  onClick={onOpenNewDeal}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Deal</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {associatedDeals.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">
                    Keine aktiven Deals verknüpft.
                  </p>
                ) : (
                  associatedDeals.map((deal) => (
                    <div
                      key={deal.id}
                      onClick={() => onSelectDeal(deal)}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition cursor-pointer space-y-1.5 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
                          {deal.title}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-semibold">
                          {deal.stage}
                        </span>
                        <span className="font-mono font-bold text-emerald-400">
                          {deal.value.toLocaleString('de-DE')} €
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Attachments & Files Card */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-xl space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Anhänge & Dokumente</span>
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-white truncate">Matchpoint_NDA_2026.pdf</span>
                  </div>
                  <span className="text-[10px] text-slate-400">1.2 MB</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-white truncate">Angebot_Migration_v2.pdf</span>
                  </div>
                  <span className="text-[10px] text-slate-400">4.8 MB</span>
                </div>
                
                <button
                  onClick={() => showToast('Datei erfolgreich hochgeladen & verschlüsselt')}
                  className="w-full py-2.5 mt-2 rounded-xl bg-white/5 hover:bg-white/10 border border-dashed border-white/20 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Datei hochladen</span>
                </button>
              </div>
            </div>

            {/* Sales Intelligence Quick Summary */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 backdrop-blur-xl space-y-2">
              <div className="flex items-center gap-1.5 text-indigo-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>HubSpot KI Insights</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Hohe Abschlusswahrscheinlichkeit basierend auf 5 Interaktionen in den letzten 14 Tagen. Nächster empfohlener Schritt: Angebotsprüfung anmahnen.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
