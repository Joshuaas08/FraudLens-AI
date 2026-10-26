import React, { useState } from 'react';
import { Database, Clock, Copy, Check, Terminal, X } from 'lucide-react';

const ExasolSqlViewerModal = ({ isOpen, onClose, queryHistory = [] }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const handleCopy = (sql, index) => {
    navigator.clipboard.writeText(sql);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-navy-900 border border-navy-700 w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-navy-800 flex items-center justify-between bg-navy-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Exasol Personal Analytical Execution Monitor
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                  IN-MEMORY COLUMNAR
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Inspect real-time SQL execution plans, window functions, and execution latencies
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="bg-navy-950/80 p-4 rounded-lg border border-navy-800 flex items-center justify-between text-xs font-mono text-slate-300">
            <div>
              <span className="text-slate-500">Target Schema: </span>
              <span className="text-blue-400 font-semibold">FRAUDLENS_ANALYTICS</span>
            </div>
            <div>
              <span className="text-slate-500">Columnar Engine: </span>
              <span className="text-emerald-400 font-semibold">ACTIVE (Sub-millisecond)</span>
            </div>
            <div>
              <span className="text-slate-500">Logged Analytical Queries: </span>
              <span className="text-amber-400 font-semibold">{queryHistory.length}</span>
            </div>
          </div>

          <div className="space-y-3">
            {queryHistory.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">
                No recent Exasol queries recorded yet.
              </div>
            ) : (
              queryHistory.map((q, idx) => (
                <div key={idx} className="bg-navy-950 rounded-lg border border-navy-800/80 overflow-hidden">
                  <div className="px-4 py-2 bg-navy-900/60 border-b border-navy-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-blue-400" />
                      <span className="font-mono text-slate-300">Query #{idx + 1}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{q.timestamp ? new Date(q.timestamp).toLocaleTimeString() : 'Just now'}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px]">
                        <Clock className="w-3 h-3" />
                        <span>{q.durationMs} ms</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px]">{q.rowCount} rows</span>
                      <button
                        onClick={() => handleCopy(q.sql, idx)}
                        className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-navy-800 transition-colors"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy SQL</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <pre className="p-3 text-[11px] font-mono text-blue-200 overflow-x-auto leading-relaxed bg-navy-950">
                    {q.sql}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-navy-800 bg-navy-950 flex justify-between items-center text-xs text-slate-400">
          <span>Optimized for Exasol Personal distributed columnar query execution</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExasolSqlViewerModal;
