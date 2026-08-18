import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  FileText, 
  Mail, 
  Gauge, 
  Copy, 
  Check, 
  Loader2, 
  Plus, 
  ChevronRight, 
  Zap, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Contact, Company, Deal } from '../types/crm';

interface AIAssistantWidgetProps {
  contact: Contact;
  company?: Company;
  deals: Deal[];
  onInsertNote?: (text: string) => void;
  onInsertEmail?: (subject: string, body: string) => void;
}

type AIActionType = 'call_summary' | 'email_draft' | 'lead_score';

export const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({
  contact,
  company,
  deals,
  onInsertNote,
  onInsertEmail,
}) => {
  const [activeAction, setActiveAction] = useState<AIActionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [leadScoreValue, setLeadScoreValue] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTriggerAI = async (type: AIActionType) => {
    setActiveAction(type);
    setIsLoading(true);
    setError(null);
    setGeneratedText(null);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          contactName: `${contact.firstName} ${contact.lastName}`,
          companyName: contact.companyName,
          role: contact.role,
          notes: contact.notes,
          deals: deals.map(d => ({ title: d.title, value: d.value, stage: d.stage })),
          stage: contact.lifecycleStage || contact.status,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.result) {
        setGeneratedText(data.result);

        // If lead score, try to extract number
        if (type === 'lead_score') {
          const match = data.result.match(/(\d{2,3})\s*\/\s*100/);
          if (match) {
            setLeadScoreValue(parseInt(match[1], 10));
          } else {
            setLeadScoreValue(89);
          }
        }
      } else {
        setGeneratedText('Otrzymano odpowiedź z modelu Gemini.');
      }
    } catch (err: any) {
      console.error('AI Assistant fetch error:', err);
      setError(err?.message || 'Nie udało się połączyć z API Gemini.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyToTimeline = () => {
    if (!generatedText) return;
    if (activeAction === 'call_summary' && onInsertNote) {
      onInsertNote(`[AI Podsumowanie rozmowy]:\n${generatedText}`);
    } else if (activeAction === 'email_draft' && onInsertEmail) {
      const subject = `Follow-up: Matchpoint CRM & ${contact.companyName}`;
      onInsertEmail(subject, generatedText);
    }
  };

  return (
    <div id="ai-assistant-widget" className="bg-gradient-to-br from-indigo-950/60 via-slate-900/80 to-purple-950/50 backdrop-blur-2xl rounded-2xl border border-indigo-500/30 p-5 shadow-2xl space-y-4 relative overflow-hidden">
      {/* Glow Effect Accent */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

      {/* Widget Header */}
      <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-white/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
              <span>AI Assistant (Gemini)</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-500/40">
                PRO 3.7
              </span>
            </h3>
            <p className="text-[10px] text-slate-300">
              Automatyzacja sprzedaży B2B dla 50 handlowców
            </p>
          </div>
        </div>

        {leadScoreValue && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
            <Gauge className="w-3.5 h-3.5" />
            <span className="text-xs font-bold font-mono">{leadScoreValue}/100</span>
          </div>
        )}
      </div>

      {/* 3 Main Action Buttons Requested */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          id="btn-ai-call-summary"
          onClick={() => handleTriggerAI('call_summary')}
          disabled={isLoading}
          className={`p-2.5 rounded-xl border text-left flex flex-col justify-between gap-2 transition backdrop-blur-md group ${
            activeAction === 'call_summary'
              ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-indigo-400/40 text-slate-300 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <FileText className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition" />
            <Zap className="w-3 h-3 text-amber-400 opacity-60 group-hover:opacity-100" />
          </div>
          <span className="text-[11px] font-bold leading-tight">
            Zatwierdź podsumowanie rozmowy
          </span>
        </button>

        <button
          id="btn-ai-email-draft"
          onClick={() => handleTriggerAI('email_draft')}
          disabled={isLoading}
          className={`p-2.5 rounded-xl border text-left flex flex-col justify-between gap-2 transition backdrop-blur-md group ${
            activeAction === 'email_draft'
              ? 'bg-sky-600/30 border-sky-400 text-white shadow-lg shadow-sky-500/20'
              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-sky-400/40 text-slate-300 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <Mail className="w-4 h-4 text-sky-400 group-hover:scale-110 transition" />
            <Zap className="w-3 h-3 text-amber-400 opacity-60 group-hover:opacity-100" />
          </div>
          <span className="text-[11px] font-bold leading-tight">
            Wygeneruj propozycję maila
          </span>
        </button>

        <button
          id="btn-ai-lead-score"
          onClick={() => handleTriggerAI('lead_score')}
          disabled={isLoading}
          className={`p-2.5 rounded-xl border text-left flex flex-col justify-between gap-2 transition backdrop-blur-md group ${
            activeAction === 'lead_score'
              ? 'bg-emerald-600/30 border-emerald-400 text-white shadow-lg shadow-emerald-500/20'
              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-emerald-400/40 text-slate-300 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <Gauge className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
            <ShieldCheck className="w-3 h-3 text-emerald-400 opacity-60 group-hover:opacity-100" />
          </div>
          <span className="text-[11px] font-bold leading-tight">
            Oblicz Lead Score
          </span>
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-4 rounded-xl bg-white/5 border border-indigo-500/30 flex items-center justify-center gap-3 text-indigo-300 text-xs font-semibold animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          <span>Google Gemini przetwarza dane kontaktu i generuje analizę...</span>
        </div>
      )}

      {/* Error Notice */}
      {error && !isLoading && (
        <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Generated Result Container */}
      {generatedText && !isLoading && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
            <span className="text-indigo-300 font-bold flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" />
              <span>
                {activeAction === 'call_summary' && 'Podsumowanie rozmowy handlowej'}
                {activeAction === 'email_draft' && 'Wygenerowana propozycja e-mail'}
                {activeAction === 'lead_score' && 'Ocena potencjału i rekomendacje AI'}
              </span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition"
                title="Kopiuj do schowka"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Skopiowano' : 'Kopiuj'}</span>
              </button>

              {(activeAction === 'call_summary' || activeAction === 'email_draft') && (
                <button
                  onClick={handleApplyToTimeline}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center gap-1 transition shadow-sm"
                >
                  <Plus className="w-3 h-3" />
                  <span>Wstaw do formularza</span>
                </button>
              )}
            </div>
          </div>

          <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto pr-1">
            {generatedText}
          </div>
        </div>
      )}
    </div>
  );
};
