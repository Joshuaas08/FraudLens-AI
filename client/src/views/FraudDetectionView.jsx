import React, { useState, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState 
} from 'reactflow';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Network, 
  Layers, 
  ArrowRight, 
  Eye, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  Database, 
  X,
  Building2,
  Lock,
  Download
} from 'lucide-react';
import { api } from '../services/api.js';
import CustomFinancialNode from '../components/CustomFinancialNode.jsx';

const nodeTypes = {
  customFinancialNode: CustomFinancialNode,
};

const FraudDetectionView = ({ onNavigate, currency }) => {
  const [activeSubTab, setActiveSubTab] = useState('surveillance'); // 'surveillance' | 'network' | 'smurfing'
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [smurfingData, setSmurfingData] = useState(null);

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    loadTransactions();
    loadSmurfingData();
    loadNetworkGraph();
  }, [riskFilter, channelFilter]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.getTransactions({ 
        riskLevel: riskFilter, 
        channel: channelFilter, 
        search 
      });
      setTransactions(res.transactions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSmurfingData = async () => {
    try {
      const res = await api.getSmurfingData();
      setSmurfingData(res);
    } catch (err) {
      console.error(err);
    }
  };

  const loadNetworkGraph = async () => {
    try {
      const res = await api.getNetworkGraph();
      if (res.nodes && res.edges) {
        setNodes(res.nodes);
        setEdges(res.edges);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadTransactions();
  };

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '₹0';
    if (currency === 'USD') return `$${(val / 85).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header & Sub-tab navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            AI-Powered Transaction Risk & Fraud Surveillance
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time pattern surveillance powered by Exasol Personal columnar window aggregations
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-navy-900 p-1 rounded-xl border border-navy-800 text-xs">
          <button
            onClick={() => setActiveSubTab('surveillance')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSubTab === 'surveillance' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Surveillance Table
          </button>
          <button
            onClick={() => setActiveSubTab('network')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeSubTab === 'network' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Money Flow Graph</span>
          </button>
          <button
            onClick={() => setActiveSubTab('smurfing')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeSubTab === 'smurfing' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Smurfing Detector</span>
          </button>
        </div>
      </div>

      {/* Sub-tab 1: Transaction Surveillance Table */}
      {activeSubTab === 'surveillance' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-navy-900/80 border border-navy-800 p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3">
            <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[260px] relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions, accounts, counterparties, IDs..."
                className="w-full bg-navy-950 border border-navy-750 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </form>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Filter className="w-3.5 h-3.5" />
                <span>Risk:</span>
              </div>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="bg-navy-950 border border-navy-750 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Risk Levels</option>
                <option value="CRITICAL">Critical (Score 85+)</option>
                <option value="HIGH">High (Score 65-84)</option>
                <option value="LOW">Low (Normal)</option>
              </select>

              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="bg-navy-950 border border-navy-750 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Channels</option>
                <option value="UPI">UPI</option>
                <option value="IMPS">IMPS</option>
                <option value="RTGS">RTGS</option>
                <option value="SWIFT">SWIFT</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-navy-900/80 border border-navy-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-navy-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-navy-800">
                  <tr>
                    <th className="py-3 px-4">TXN ID</th>
                    <th className="py-3 px-4">Originating Account</th>
                    <th className="py-3 px-4">Counterparty / Bank</th>
                    <th className="py-3 px-4">Channel</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Risk Score</th>
                    <th className="py-3 px-4">Primary Anomaly</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800/60">
                  {transactions.map(txn => {
                    const isCritical = txn.risk_level === 'CRITICAL';
                    const isHigh = txn.risk_level === 'HIGH';

                    return (
                      <tr 
                        key={txn.id}
                        className="hover:bg-navy-850/60 transition-colors group cursor-pointer"
                        onClick={() => setSelectedTxn(txn)}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-slate-200">
                          {txn.id}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-200">{txn.account_name}</div>
                          <div className="text-[10px] font-mono text-slate-400">{txn.account_id}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-200">{txn.counterparty_name}</div>
                          <div className="text-[10px] text-slate-400">{txn.counterparty_bank}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono px-2 py-0.5 rounded bg-navy-800 border border-navy-700 text-slate-300 text-[11px]">
                            {txn.channel}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-100">
                          {formatCurrency(txn.amount)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-navy-950 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  isCritical ? 'bg-red-500' : (isHigh ? 'bg-amber-500' : 'bg-emerald-500')
                                }`}
                                style={{ width: `${txn.risk_score}%` }}
                              />
                            </div>
                            <span className={`font-mono font-bold text-[11px] ${
                              isCritical ? 'text-red-400' : (isHigh ? 'text-amber-400' : 'text-emerald-400')
                            }`}>
                              {txn.risk_score}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                            isCritical 
                              ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
                              : (isHigh ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-blue-500/10 text-blue-400')
                          }`}>
                            {txn.risk_breakdown?.[0]?.factor || 'Normal Velocity'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedTxn(txn); }}
                            className="p-1.5 rounded-lg bg-navy-800 hover:bg-blue-600/30 text-blue-400 transition-colors"
                            title="Inspect SHAP Explainability"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Interactive React Flow Money Flow Network */}
      {activeSubTab === 'network' && (
        <div className="bg-navy-950 border border-navy-800 rounded-xl overflow-hidden shadow-2xl h-[650px] relative">
          <div className="absolute top-4 left-4 z-10 bg-navy-900/90 backdrop-blur-md p-3 rounded-xl border border-navy-750 text-xs text-slate-300 shadow-xl max-w-sm">
            <h4 className="font-bold text-slate-100 flex items-center gap-1.5 mb-1">
              <Network className="w-4 h-4 text-blue-400" />
              Connected Transaction Graph
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Interactive money flow between shell entities, mule nodes, and corporate accounts. Red pulses indicate high-velocity fund relays and structuring syndicates.
            </p>
          </div>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="#1E293B" gap={16} />
            <Controls className="!bg-navy-900 !border-navy-700 !text-slate-300" />
            <MiniMap 
              nodeColor={(n) => n.data?.risk === 'CRITICAL' ? '#EF4444' : '#3B82F6'}
              className="!bg-navy-900/90 !border-navy-700" 
            />
          </ReactFlow>
        </div>
      )}

      {/* Sub-tab 3: Smurfing & Structuring Detector */}
      {activeSubTab === 'smurfing' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-red-950/40 via-navy-900 to-navy-900 border border-red-500/30 p-5 rounded-xl shadow-lg">
            <div className="flex items-center gap-2.5 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="text-base font-bold text-slate-100">
                Smurfing / Structuring Rule Enforcement (Exasol Aggregation)
              </h3>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Exasol Personal executes rolling temporal aggregations to identify accounts generating repetitive transfers between ₹40,000 and ₹49,999 within 48-hour windows to intentionally evade the ₹50,000 PAN reporting threshold.
            </p>
          </div>

          {smurfingData?.results?.map((syndicate, i) => (
            <div key={i} className="bg-navy-900/80 border border-navy-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-navy-800 pb-3 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">{syndicate.accountName}</span>
                    <span className="font-mono text-xs text-slate-400">({syndicate.accountId})</span>
                    <span className="text-[10px] font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">
                      THRESHOLD EVASION DETECTED
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Total Structured Amount: <span className="font-bold font-mono text-slate-200">{formatCurrency(syndicate.totalStructuredAmount)}</span> across {syndicate.transactionCount} transfers
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('cases')}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-xs shadow-md transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Escalate to SAR Case</span>
                </button>
              </div>

              {/* Transactions in syndicate */}
              <div>
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Correlated Evasion Transfers (All Sub-50k)
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {syndicate.transactions?.map(t => (
                    <div key={t.id} className="p-2.5 rounded-lg bg-navy-950 border border-navy-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-mono font-bold text-slate-200">{t.id} • {t.channel}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[140px]">{t.counterparty_name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-red-400">{formatCurrency(t.amount)}</div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SHAP Explainability Inspection Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-navy-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-navy-800 flex items-center justify-between bg-navy-950">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${
                  selectedTxn.risk_level === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    Explainable Risk Analysis: {selectedTxn.id}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {selectedTxn.account_name} → {selectedTxn.counterparty_name}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTxn(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
              {/* Score Header */}
              <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Calibrated Risk Score</span>
                  <div className="text-3xl font-black font-mono text-red-400 mt-0.5">
                    {selectedTxn.risk_score} <span className="text-sm font-sans font-normal text-slate-400">/ 100</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Transfer Volume</span>
                  <div className="text-xl font-bold font-mono text-slate-100 mt-0.5">
                    {formatCurrency(selectedTxn.amount)}
                  </div>
                </div>
              </div>

              {/* SHAP Factor Waterfall */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  SHAP-Style Feature Attribution Waterfall
                </h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-navy-950 border border-navy-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-300">Baseline Institutional Risk</span>
                      <p className="text-[11px] text-slate-500">Standard prior probability for transaction category</p>
                    </div>
                    <span className="font-mono text-slate-400 font-bold">+12 pts</span>
                  </div>

                  {selectedTxn.risk_breakdown?.map((factor, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-red-950/20 border border-red-500/30 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-red-300">{factor.factor}</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">{factor.description}</p>
                      </div>
                      <span className="font-mono font-bold text-red-400">+{factor.contribution} pts</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Context */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-navy-950 p-4 rounded-xl border border-navy-800">
                <div>
                  <span className="text-slate-500 block text-[11px]">Originating IP & Device</span>
                  <span className="font-mono text-slate-300">{selectedTxn.ip_address} ({selectedTxn.device_id})</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Jurisdiction</span>
                  <span className="font-mono text-slate-300">{selectedTxn.geo_city}, {selectedTxn.geo_country}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-navy-800 bg-navy-950 flex justify-between items-center">
              <button
                onClick={() => setSelectedTxn(null)}
                className="px-4 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 text-xs font-medium"
              >
                Close
              </button>
              <button
                onClick={() => { setSelectedTxn(null); onNavigate('cases'); }}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-600/30 flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Escalate to Case Queue</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FraudDetectionView;
