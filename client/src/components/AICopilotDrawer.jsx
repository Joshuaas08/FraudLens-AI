import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ArrowRight, 
  Database, 
  CornerDownLeft, 
  X, 
  Loader2,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api.js';

const AICopilotDrawer = ({ isOpen, onClose, onNavigateTab }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: {
        title: "FraudLens AI Investigation Copilot",
        summary: "Welcome. I am your evidence-grounded financial risk investigation partner powered by Exasol analytical aggregations and MongoDB audit records. How can I assist your investigation?",
        keyMetrics: [
          { label: "Active Risk Alerts", value: "4 Critical Cases", alert: true },
          { label: "Reconciliation Status", value: "88.5% Matched" },
          { label: "Regulatory Breaches", value: "1 Group (Vanguard)", alert: true }
        ],
        evidence: [
          "Smurfing syndicate active on account ACC-IN-4901 (Mehra Traders) with 6 sub-₹50,000 transfers.",
          "₹4,20,000 unposted CBDT Direct Tax debit flagged on core bank statement.",
          "Vanguard Steel & Mining net exposure breached RBI limit by ₹37 Crores."
        ]
      }
    }
  ]);

  const [prompts, setPrompts] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadPrompts();
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const loadPrompts = async () => {
    try {
      const data = await api.getCopilotPrompts();
      setPrompts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (textToSend) => {
    const q = textToSend || query;
    if (!q.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setQuery('');
    setLoading(true);

    try {
      const res = await api.queryCopilot(q);
      setMessages(prev => [...prev, { role: 'assistant', content: res }]);
    } catch (err) {
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: { 
            title: "Analysis Notice",
            summary: "Error communicating with intelligence engine: " + err.message,
            evidence: []
          } 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action) => {
    if (action.actionId.includes('HOLD') || action.actionId.includes('SAR')) {
      onNavigateTab('cases');
      onClose();
    } else if (action.actionId.includes('RECON') || action.actionId.includes('JOURNAL')) {
      onNavigateTab('reconciliation');
      onClose();
    } else if (action.actionId.includes('MARGIN') || action.actionId.includes('FREEZE')) {
      onNavigateTab('exposure');
      onClose();
    } else if (action.actionId.includes('ADVERSE') || action.actionId.includes('SIMULAT')) {
      onNavigateTab('loans');
      onClose();
    } else if (action.actionId.includes('CLOSE') || action.actionId.includes('CRO')) {
      onNavigateTab('month-end');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-navy-950/95 backdrop-blur-md border-l border-navy-800 shadow-2xl flex flex-col animate-slide-in">
      {/* Drawer Header */}
      <div className="p-4 border-b border-navy-800 flex items-center justify-between bg-navy-900/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              FraudLens AI Investigation Copilot
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
                EVIDENCE-GROUNDED
              </span>
            </h3>
            <p className="text-xs text-slate-400">Grounded in Exasol Columnar Store & Audit Logs</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2.5 bg-navy-900/30 border-b border-navy-800/80 overflow-x-auto flex gap-2 no-scrollbar">
        {prompts.map(p => (
          <button
            key={p.id}
            onClick={() => handleSend(p.query)}
            className="text-[11px] whitespace-nowrap bg-navy-800/70 hover:bg-navy-700/80 text-slate-300 hover:text-blue-300 px-2.5 py-1.5 rounded-full border border-navy-700 transition-all flex items-center gap-1.5 flex-shrink-0"
          >
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'user' ? (
              <div className="max-w-[85%] bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-xs shadow-md">
                {m.text}
              </div>
            ) : (
              <div className="max-w-[95%] bg-navy-900 border border-navy-800 rounded-2xl rounded-tl-sm p-4 text-xs space-y-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-navy-800 pb-2">
                  <span className="font-semibold text-slate-100 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    {m.content.title || "Investigation Briefing"}
                  </span>
                  {m.content.confidence && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      Confidence: {(m.content.confidence * 100).toFixed(0)}%
                    </span>
                  )}
                </div>

                <p className="text-slate-300 leading-relaxed">
                  {m.content.summary}
                </p>

                {/* Key Metrics Chips */}
                {m.content.keyMetrics && m.content.keyMetrics.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {m.content.keyMetrics.map((km, i) => (
                      <div key={i} className={`p-2 rounded-lg border text-[11px] ${
                        km.alert ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-navy-950 border-navy-800 text-slate-300'
                      }`}>
                        <span className="text-[10px] text-slate-400 block">{km.label}</span>
                        <span className="font-semibold font-mono">{km.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empirical Evidence */}
                {m.content.evidence && m.content.evidence.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Supporting Analytical Evidence
                    </span>
                    <ul className="space-y-1">
                      {m.content.evidence.map((ev, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Actions */}
                {m.content.recommendedActions && m.content.recommendedActions.length > 0 && (
                  <div className="pt-2 border-t border-navy-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Recommended Next Actions
                    </span>
                    <div className="space-y-1.5">
                      {m.content.recommendedActions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleActionClick(act)}
                          className="w-full flex items-center justify-between p-2 rounded-lg bg-navy-950 hover:bg-blue-600/20 border border-navy-800 hover:border-blue-500/50 text-left transition-all text-[11px] group"
                        >
                          <span className="text-slate-200 group-hover:text-blue-300 font-medium">
                            {act.label}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exasol SQL Used */}
                {m.content.exasolSql && (
                  <div className="p-2 rounded bg-navy-950 border border-navy-800 text-[10px] font-mono text-slate-400 overflow-x-auto">
                    <span className="text-blue-400 font-semibold block mb-0.5">Exasol Verification Query:</span>
                    <code>{m.content.exasolSql}</code>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs p-3 bg-navy-900 rounded-xl max-w-[200px] border border-navy-800">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span>Evaluating Exasol store...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-navy-800 bg-navy-900/80">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2 bg-navy-950 border border-navy-700 rounded-xl px-3 py-1.5 focus-within:border-blue-500"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask Copilot about TXN-8902, reconciliations, Vanguard exposures..."
            className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AICopilotDrawer;
