import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  AlertTriangle, 
  Building2, 
  Layers, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Send,
  Database,
  ArrowUpRight,
  X
} from 'lucide-react';
import { api } from '../services/api.js';

const ExposureIntelligenceView = ({ currency }) => {
  const [exposureData, setExposureData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedEntity, setExpandedEntity] = useState(null);
  const [actionModal, setActionModal] = useState(null); // { entity, type }
  const [actionNotes, setActionNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    loadExposures();
  }, []);

  const loadExposures = async () => {
    try {
      setLoading(true);
      const res = await api.getUnifiedExposures();
      setExposureData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    if (!actionModal) return;

    try {
      await api.takeExposureAction({
        entityName: actionModal.entity.entityName,
        actionType: actionModal.type,
        requestedAmount: actionModal.entity.totalNetExposure - actionModal.entity.regulatoryLimit,
        actor: 'Dr. Vikramaditya Sen (CRO)'
      });

      setActionSuccess(`Dispatched ${actionModal.type} for ${actionModal.entity.entityName}! Logged to Audit Trail.`);
      setActionModal(null);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '₹0';
    if (currency === 'USD') return `$${(val / 85).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const results = exposureData?.results || [];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            Unified Multi-System Exposure Intelligence
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Consolidating multi-book positions across Core Banking, Treasury, Trade Finance, and Derivatives
          </p>
        </div>

        <div className="flex items-center gap-2 bg-navy-900 px-3 py-1.5 rounded-lg border border-navy-800 text-xs font-mono">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Exasol Aggregation:</span>
          <span className="text-emerald-400 font-bold">{exposureData?.durationMs?.toFixed(2) || '1.48'} ms</span>
        </div>
      </div>

      {/* Success banner */}
      {actionSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Warning Spotlight: Regulatory Limit Breach */}
      {results.some(r => r.limitStatus === 'BREACHED') && (
        <div className="bg-gradient-to-r from-red-950/40 via-navy-900 to-navy-900 border border-red-500/40 p-4 rounded-xl flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
                Regulatory Exposure Limit Breach Alert
              </span>
              <h4 className="text-sm font-bold text-slate-100">
                Vanguard Steel & Mining Ltd has breached the RBI Single Borrower Limit of ₹200.0 Cr
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Total Net Position is <span className="font-bold text-slate-200">₹237.0 Cr</span> (Excess ₹37.0 Cr). Driven by un-hedged commodity derivative contracts.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActionModal({ entity: results.find(r => r.limitStatus === 'BREACHED'), type: 'MARGIN_CALL_ISSUED' })}
            className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-md transition-all whitespace-nowrap"
          >
            Issue Margin Call
          </button>
        </div>
      )}

      {/* Entities Exposure Cards Grid */}
      <div className="space-y-4">
        {results.map((item, idx) => {
          const isBreached = item.limitStatus === 'BREACHED';
          const isWarning = item.limitStatus === 'WARNING';
          const isConflicted = item.conflictStatus === 'CRITICAL_CONFLICT';
          const isExpanded = expandedEntity === item.entityName;
          const limitPct = Math.min(100, Math.round((item.totalNetExposure / item.regulatoryLimit) * 100));

          return (
            <div 
              key={idx}
              className={`bg-navy-900/80 border rounded-xl overflow-hidden shadow-lg transition-all ${
                isBreached ? 'border-red-500/50' : (isConflicted ? 'border-amber-500/40' : 'border-navy-800')
              }`}
            >
              {/* Card Summary Header */}
              <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    isBreached ? 'bg-red-500/20 text-red-400' : (isConflicted ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400')
                  }`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-100">{item.entityName}</h3>
                      <span className="text-[10px] text-slate-400 font-mono">({item.parentGroup})</span>
                      {isBreached && (
                        <span className="text-[10px] font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">
                          LIMIT BREACHED
                        </span>
                      )}
                      {isConflicted && (
                        <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
                          {formatCurrency(item.crossSystemSpread)} SPREAD
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-xs text-slate-400">Reporting Systems ({item.reportingSystemsCount}):</span>
                      {item.systems?.map(s => (
                        <span key={s} className="text-[10px] font-mono px-2 py-0.5 rounded bg-navy-950 border border-navy-750 text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Metrics & Progress Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Total Net Exposure</span>
                    <span className={`text-lg font-black font-mono ${
                      isBreached ? 'text-red-400' : 'text-slate-100'
                    }`}>
                      {formatCurrency(item.totalNetExposure)}
                    </span>
                  </div>

                  <div className="min-w-[160px]">
                    <div className="flex justify-between text-[11px] mb-1 font-mono">
                      <span className="text-slate-400">Limit: {formatCurrency(item.regulatoryLimit)}</span>
                      <span className={isBreached ? 'text-red-400 font-bold' : 'text-slate-300'}>{limitPct}%</span>
                    </div>
                    <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden border border-navy-800">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          isBreached ? 'bg-red-500' : (isWarning ? 'bg-amber-500' : 'bg-blue-500')
                        }`}
                        style={{ width: `${limitPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedEntity(isExpanded ? null : item.entityName)}
                      className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <span>Drill Down</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    {isBreached && (
                      <button
                        onClick={() => setActionModal({ entity: item, type: 'FREEZE_FACILITY_TRANCHE' })}
                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold"
                      >
                        Action
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Drill-Down Facilities Table (Expandable) */}
              {isExpanded && (
                <div className="border-t border-navy-800/80 bg-navy-950/70 p-4 animate-fade-in">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Disaggregated System Facilities ({item.facilities?.length} records)
                  </h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-navy-900 text-[10px] uppercase text-slate-400 border-b border-navy-800">
                        <tr>
                          <th className="py-2 px-3">System Source</th>
                          <th className="py-2 px-3">Facility Type</th>
                          <th className="py-2 px-3">Gross Exposure</th>
                          <th className="py-2 px-3">Net Exposure</th>
                          <th className="py-2 px-3">Collateral Pledged</th>
                          <th className="py-2 px-3">Risk Weight</th>
                          <th className="py-2 px-3">As Of Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-navy-800/40">
                        {item.facilities?.map(fac => (
                          <tr key={fac.id} className="hover:bg-navy-900/40">
                            <td className="py-2 px-3 font-mono font-semibold text-blue-400">
                              {fac.system_source}
                            </td>
                            <td className="py-2 px-3">{fac.facility_type}</td>
                            <td className="py-2 px-3 font-mono">{formatCurrency(fac.gross_exposure)}</td>
                            <td className="py-2 px-3 font-mono font-bold text-slate-100">{formatCurrency(fac.net_exposure)}</td>
                            <td className="py-2 px-3 font-mono text-emerald-400">{formatCurrency(fac.collateral_value)}</td>
                            <td className="py-2 px-3 font-mono">{fac.risk_weight}x</td>
                            <td className="py-2 px-3 text-slate-500 font-mono">{fac.as_of_date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-navy-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-navy-800 flex items-center justify-between bg-navy-950">
              <h3 className="text-base font-bold text-slate-100">
                Risk Containment Action: {actionModal.entity.entityName}
              </h3>
              <button onClick={() => setActionModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleActionSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-lg">
                <span className="text-red-300 font-semibold block mb-1">Single Borrower Limit Breach</span>
                <p className="text-slate-300">
                  Excess net exposure of {formatCurrency(actionModal.entity.totalNetExposure - actionModal.entity.regulatoryLimit)} requires institutional risk intervention.
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Enforcement Directive:
                </label>
                <select 
                  value={actionModal.type}
                  onChange={(e) => setActionModal({ ...actionModal, type: e.target.value })}
                  className="w-full bg-navy-950 border border-navy-750 rounded-lg p-2 text-slate-200"
                >
                  <option value="MARGIN_CALL_ISSUED">Issue Mandatory Margin Call (Collateral Top-up)</option>
                  <option value="FREEZE_FACILITY_TRANCHE">Freeze New Facility Tranches / Derivatives</option>
                  <option value="REQUEST_CRO_WAIVER">Request Emergency Credit Committee Risk Waiver</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Directive Memo / Notes:
                </label>
                <textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="Enter notice details for Treasury desk and Risk Committee..."
                  rows={3}
                  className="w-full bg-navy-950 border border-navy-750 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-navy-800">
                <button
                  type="button"
                  onClick={() => setActionModal(null)}
                  className="px-4 py-1.5 rounded-lg bg-navy-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold shadow-md"
                >
                  Dispatch Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExposureIntelligenceView;
