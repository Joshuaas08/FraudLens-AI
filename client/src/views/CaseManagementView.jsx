import React, { useState, useEffect } from 'react';
import { 
  FolderLock, 
  Search, 
  Plus, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Send, 
  User, 
  X,
  History,
  ShieldAlert,
  ArrowUpRight,
  Download
} from 'lucide-react';
import { api } from '../services/api.js';

const CaseManagementView = ({ currency }) => {
  const [activeTab, setActiveTab] = useState('cases'); // 'cases' | 'audit'
  const [cases, setCases] = useState([]);
  const [auditEvents, setAuditEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [authorName, setAuthorName] = useState('Amit Patel (Investigator)');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sarSuccess, setSarSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [casesRes, auditRes] = await Promise.all([
        api.getCases({ status: statusFilter }),
        api.getAuditTrail(60)
      ]);
      setCases(casesRes || []);
      setAuditEvents(auditRes || []);
      if (selectedCase) {
        const refreshed = casesRes.find(c => c.caseId === selectedCase.caseId);
        if (refreshed) setSelectedCase(refreshed);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (caseId, newStatus) => {
    try {
      await api.updateCaseStatus(caseId, newStatus, `Analyst changed state to ${newStatus}`);
      await loadData();
    } catch (err) {
      alert('Error updating case: ' + err.message);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedCase) return;

    try {
      await api.addCaseNote(selectedCase.caseId, {
        author: authorName,
        text: newNoteText,
        actionTaken: 'INVESTIGATION_NOTE_ADDED'
      });
      setNewNoteText('');
      await loadData();
    } catch (err) {
      alert('Error adding note: ' + err.message);
    }
  };

  const handleGenerateSar = async (caseId) => {
    try {
      const res = await api.generateSarReport(caseId);
      setSarSuccess(`Suspicious Activity Report officially transmitted! FIU Ref: ${res.fiuReferenceNumber}`);
      await loadData();
      setTimeout(() => setSarSuccess(''), 5000);
    } catch (err) {
      alert('Error generating SAR: ' + err.message);
    }
  };

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '₹0';
    if (currency === 'USD') return `$${(val / 85).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            <FolderLock className="w-5 h-5 text-blue-400" />
            Case Management & Traceable Audit Trail
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Mongoose/MongoDB backed case investigations, analyst deliberations, and immutable compliance audit logs
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-navy-900 p-1 rounded-xl border border-navy-800 text-xs">
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'cases' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Investigation Queue ({cases.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'audit' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail ({auditEvents.length})</span>
          </button>
        </div>
      </div>

      {/* Success banner */}
      {sarSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{sarSuccess}</span>
          </div>
          <button onClick={() => setSarSuccess('')} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tab 1: Investigation Cases */}
      {activeTab === 'cases' && (
        <div className="space-y-4">
          {/* Status Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-navy-900/80 p-2 rounded-xl border border-navy-800 text-xs">
            {['ALL', 'NEW', 'IN_INVESTIGATION', 'ESCALATED', 'RESOLVED'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === st ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          {/* Cases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cases.map(c => {
              const isCritical = c.severity === 'CRITICAL';
              const isHigh = c.severity === 'HIGH';

              return (
                <div
                  key={c.caseId}
                  onClick={() => setSelectedCase(c)}
                  className={`p-5 rounded-xl border bg-navy-900/80 hover:bg-navy-850 transition-all cursor-pointer shadow-lg space-y-3 ${
                    isCritical ? 'border-red-500/40' : (isHigh ? 'border-amber-500/40' : 'border-navy-800')
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-200">{c.caseId}</span>
                      <span className="text-[10px] font-mono text-slate-400 bg-navy-950 px-2 py-0.5 rounded">
                        {c.category}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      c.status === 'NEW' ? 'bg-blue-500/20 text-blue-400' :
                      c.status === 'IN_INVESTIGATION' ? 'bg-amber-500/20 text-amber-400' :
                      c.status === 'ESCALATED' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {c.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{c.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {c.evidence?.[0] || 'No preliminary evidence description attached.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-navy-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Financial Impact</span>
                      <span className="font-mono font-bold text-slate-200">{formatCurrency(c.financialImpact)}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-500 block text-[10px]">Assigned Lead</span>
                      <span className="text-slate-300 text-[11px] font-medium">{c.assignedTo}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" /> {c.notes?.length || 0} notes
                    </span>
                    {c.sarReportGenerated && (
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> SAR Filed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Traceable Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-navy-900/80 border border-navy-800 rounded-xl overflow-hidden shadow-xl">
          <div className="px-5 py-4 border-b border-navy-800 flex items-center justify-between bg-navy-950/60">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <History className="w-4 h-4 text-blue-400" />
              Traceable Regulatory Audit Trail (MongoDB Collection)
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Showing {auditEvents.length} Recent Events
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-navy-950 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-navy-800">
                <tr>
                  <th className="py-3 px-4">Event ID & Timestamp</th>
                  <th className="py-3 px-4">Actor & Role</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Details & Reason</th>
                  <th className="py-3 px-4 font-mono text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60 font-sans">
                {auditEvents.map(evt => (
                  <tr key={evt.eventId} className="hover:bg-navy-850/50">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-200">{evt.eventId}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {new Date(evt.timestamp).toLocaleString()}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">{evt.actor}</div>
                      <div className="text-[10px] text-slate-400">{evt.role}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-navy-950 border border-navy-750 text-blue-300">
                        {evt.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-200">
                      {evt.targetId}
                    </td>

                    <td className="py-3 px-4 text-slate-300 max-w-xs truncate text-[11px]">
                      {evt.details?.reason || evt.details?.actionTaken || evt.details?.message || JSON.stringify(evt.details)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-slate-400 text-[10px]">
                      {evt.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Case Details Drawer / Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-navy-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-navy-800 flex items-center justify-between bg-navy-950">
              <div>
                <span className="font-mono text-xs text-blue-400">{selectedCase.caseId} • {selectedCase.category}</span>
                <h3 className="text-base font-bold text-slate-100">{selectedCase.title}</h3>
              </div>
              <button onClick={() => setSelectedCase(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              {/* Status and Action Buttons */}
              <div className="p-3 bg-navy-950 rounded-xl border border-navy-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Current Status:</span>
                  <select
                    value={selectedCase.status}
                    onChange={(e) => handleStatusUpdate(selectedCase.caseId, e.target.value)}
                    className="bg-navy-900 border border-navy-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
                  >
                    <option value="NEW">NEW</option>
                    <option value="IN_INVESTIGATION">IN INVESTIGATION</option>
                    <option value="ESCALATED">ESCALATED</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="FALSE_POSITIVE">FALSE POSITIVE</option>
                  </select>
                </div>

                <button
                  onClick={() => handleGenerateSar(selectedCase.caseId)}
                  className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-md transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{selectedCase.sarReportGenerated ? 'Re-Transmit STR/SAR' : 'Generate & File SAR'}</span>
                </button>
              </div>

              {/* Empirical Evidence Checklist */}
              <div>
                <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-2">
                  Supporting Forensic Evidence
                </h4>
                <ul className="space-y-1.5 bg-navy-950 p-4 rounded-xl border border-navy-800">
                  {selectedCase.evidence?.map((ev, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Notes History */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                  Investigation Deliberations ({selectedCase.notes?.length || 0})
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedCase.notes?.map((n, i) => (
                    <div key={i} className="p-3 bg-navy-950 rounded-lg border border-navy-800 text-xs">
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span className="font-semibold text-slate-300">{n.author}</span>
                        <span className="font-mono">{new Date(n.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-200">{n.text}</p>
                    </div>
                  ))}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-navy-800">
                  <textarea
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Add an investigation note, regulatory hypothesis, or evidence link..."
                    rows={2}
                    className="w-full bg-navy-950 border border-navy-750 rounded-lg p-2.5 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newNoteText.trim()}
                      className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-colors"
                    >
                      Post Deliberation Note
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseManagementView;
