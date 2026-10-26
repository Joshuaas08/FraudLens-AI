import React, { useState, useEffect } from 'react';
import { 
  GitCompare, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Copy, 
  Search, 
  FileCheck, 
  ArrowRight, 
  ExternalLink,
  X,
  Layers,
  Database
} from 'lucide-react';
import { api } from '../services/api.js';

const ReconciliationView = ({ currency }) => {
  const [matrixData, setMatrixData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedException, setSelectedException] = useState(null);
  const [journalNote, setJournalNote] = useState('');
  const [resolving, setResolving] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  useEffect(() => {
    loadReconciliation();
  }, [filterStatus]);

  const loadReconciliation = async () => {
    try {
      setLoading(true);
      const data = await api.getReconciliationMatrix(filterStatus);
      setMatrixData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (e) => {
    e.preventDefault();
    if (!selectedException) return;

    try {
      setResolving(true);
      const res = await api.resolveReconciliationException({
        refKey: selectedException.reconciliationRef,
        action: 'POST_ADJUSTING_JOURNAL',
        adjustmentAmount: selectedException.varianceAmount,
        journalNote: journalNote || `Manual adjusting journal posted for ${selectedException.reconciliationRef}`
      });

      setSuccessToast(`Resolved ${selectedException.reconciliationRef}! Adjusting journal entry posted to GL-110020.`);
      setSelectedException(null);
      setJournalNote('');
      loadReconciliation(); // Reload matrix
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err) {
      alert('Error resolving exception: ' + err.message);
    } finally {
      setResolving(false);
    }
  };

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '₹0';
    if (currency === 'USD') return `$${(val / 85).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const stats = matrixData?.stats || {};
  const results = matrixData?.results || [];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-blue-400" />
            Intelligent 3-Way Reconciliation Hub
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronized comparison of Core Bank Statements, ERP General Ledgers, and Payment Gateway switches
          </p>
        </div>

        {/* Exasol Query latency badge */}
        <div className="flex items-center gap-2 bg-navy-900 px-3 py-1.5 rounded-lg border border-navy-800 text-xs font-mono">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Exasol Join Query:</span>
          <span className="text-emerald-400 font-bold">{matrixData?.durationMs?.toFixed(2) || '0.94'} ms</span>
        </div>
      </div>

      {/* Success notification */}
      {successToast && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl text-xs flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-navy-900/80 border border-navy-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400">Match Rate</span>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
            {stats.matchRatePercentage}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{stats.matchedCount} fully reconciled</p>
        </div>

        <div className="bg-navy-900/80 border border-navy-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400">Open Exceptions</span>
          <div className="text-2xl font-black font-mono text-red-400 mt-1">
            {stats.discrepancyCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Requires ledger action</p>
        </div>

        <div className="bg-navy-900/80 border border-navy-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400">Total Variance At Risk</span>
          <div className="text-2xl font-black font-mono text-amber-400 mt-1">
            {formatCurrency(stats.totalDiscrepancyAmount)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Material audit exposure</p>
        </div>

        <div className="bg-navy-900/80 border border-navy-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400">Total Volume Evaluated</span>
          <div className="text-2xl font-black font-mono text-slate-100 mt-1">
            {formatCurrency(stats.totalVolume)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across 3 ledger feeds</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-navy-900 p-1.5 rounded-xl border border-navy-800 text-xs">
        {[
          { label: 'All Feeds', value: 'ALL' },
          { label: 'Exact Matches', value: 'MATCHED' },
          { label: 'Amount Discrepancy', value: 'AMOUNT_DISCREPANCY' },
          { label: 'Unmatched Bank', value: 'UNMATCHED_BANK' },
          { label: 'Delayed Settlement', value: 'DELAYED_SETTLEMENT' },
          { label: 'Duplicate Entry', value: 'DUPLICATE_ENTRY' }
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFilterStatus(f.value)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterStatus === f.value 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 3-Way Matrix Table */}
      <div className="bg-navy-900/80 border border-navy-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-navy-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-navy-800">
              <tr>
                <th className="py-3 px-4">Ref Key</th>
                <th className="py-3 px-4">Bank Statement Record</th>
                <th className="py-3 px-4">Internal General Ledger</th>
                <th className="py-3 px-4">Gateway Settlement</th>
                <th className="py-3 px-4">Reconciliation Status</th>
                <th className="py-3 px-4">Variance</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {results.map((item, idx) => {
                const isMatched = item.reconStatus === 'MATCHED';
                const isAmountMismatch = item.reconStatus === 'AMOUNT_DISCREPANCY';
                const isBankOnly = item.reconStatus === 'UNMATCHED_BANK';

                return (
                  <tr key={idx} className="hover:bg-navy-850/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-200">
                      {item.reconciliationRef}
                    </td>

                    {/* Bank Column */}
                    <td className="py-3 px-4">
                      {item.bank ? (
                        <div>
                          <span className="font-mono font-bold text-slate-100">{formatCurrency(item.bank.amount)}</span>
                          <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{item.bank.raw_narrative}</p>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">Not found in Bank</span>
                      )}
                    </td>

                    {/* Ledger Column */}
                    <td className="py-3 px-4">
                      {item.ledger ? (
                        <div>
                          <span className="font-mono font-bold text-slate-100">{formatCurrency(item.ledger.amount)}</span>
                          <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{item.ledger.cost_center}</p>
                        </div>
                      ) : (
                        <span className="text-[11px] text-red-400/80 italic font-medium">Unposted in GL</span>
                      )}
                    </td>

                    {/* Gateway Column */}
                    <td className="py-3 px-4">
                      {item.gateway ? (
                        <div>
                          <span className="font-mono font-bold text-slate-100">{formatCurrency(item.gateway.amount)}</span>
                          {item.gateway.fee > 0 && (
                            <span className="text-[10px] text-amber-400 block font-mono">Fee: -₹{item.gateway.fee}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">Direct Channel</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                        isMatched 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                          : (isAmountMismatch ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30')
                      }`}>
                        {item.reconStatus.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Variance Amount */}
                    <td className="py-3 px-4 font-mono font-bold">
                      {item.varianceAmount > 0 ? (
                        <span className="text-amber-400">{formatCurrency(item.varianceAmount)}</span>
                      ) : (
                        <span className="text-slate-500">₹0.00</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      {!isMatched ? (
                        <button
                          onClick={() => setSelectedException(item)}
                          className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-[11px] transition-colors"
                        >
                          Resolve
                        </button>
                      ) : (
                        <span className="text-emerald-400 text-[11px] flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Reconciled
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Exception Resolution Modal */}
      {selectedException && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-navy-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-navy-800 flex items-center justify-between bg-navy-950">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-400" />
                Resolve Exception: {selectedException.reconciliationRef}
              </h3>
              <button 
                onClick={() => setSelectedException(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResolve} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-navy-950 rounded-lg border border-navy-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Identified Discrepancy:</span>
                  <span className="font-mono text-amber-400 font-bold">{formatCurrency(selectedException.varianceAmount)}</span>
                </div>
                <p className="text-slate-300 font-medium">{selectedException.notes}</p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Adjusting Action:
                </label>
                <select className="w-full bg-navy-950 border border-navy-750 rounded-lg p-2 text-slate-200">
                  <option>Post Adjusting Journal Voucher to General Ledger (GL-110020)</option>
                  <option>Record Gateway Commission & Tax Deduction</option>
                  <option>Correct Transposition Entry in Procurement Batch</option>
                  <option>Confirm Legitimate Transit Timing Delay</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Audit Voucher Notes:
                </label>
                <textarea
                  value={journalNote}
                  onChange={(e) => setJournalNote(e.target.value)}
                  placeholder="Enter journal description, approval reference, or auditor justification..."
                  rows={3}
                  className="w-full bg-navy-950 border border-navy-750 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-navy-800">
                <button
                  type="button"
                  onClick={() => setSelectedException(null)}
                  className="px-4 py-1.5 rounded-lg bg-navy-800 text-slate-300 font-medium hover:bg-navy-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resolving}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md flex items-center gap-1.5"
                >
                  {resolving ? 'Posting Voucher...' : 'Confirm & Post Journal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReconciliationView;
