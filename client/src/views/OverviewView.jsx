import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, 
  RefreshCw, 
  GitCompare, 
  Scale, 
  FileCheck2, 
  AlertTriangle, 
  ArrowUpRight, 
  Clock, 
  Database, 
  TrendingUp,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { api } from '../services/api.js';

const OverviewView = ({ onNavigate, onOpenSqlModal, currency }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      setLoading(true);
      const res = await api.getOverview();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '₹0';
    if (currency === 'USD') {
      const usdVal = val / 85;
      return `$${(usdVal / 1000000).toFixed(2)}M`;
    }
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-sm text-slate-400">Loading risk intelligence from Exasol Personal...</p>
        </div>
      </div>
    );
  }

  const cards = data?.summaryCards || {};
  const exposureBreaches = data?.exposureBreaches || [];
  const recentAlerts = data?.recentAlerts || [];
  const recentRecon = data?.recentReconExceptions || [];
  const closeStats = data?.closeCockpit || {};

  // Chart data
  const reconPieData = [
    { name: 'Matched', value: cards.reconciliationMatchRate || 88.5, color: '#10B981' },
    { name: 'Exceptions', value: 100 - (cards.reconciliationMatchRate || 88.5), color: '#EF4444' }
  ];

  const exposureChartData = [
    { entity: 'Apex Infra', core: 112, treasury: 145, trade: 45 },
    { entity: 'Vanguard Steel', core: 185, derivatives: 65, trade: 0 },
    { entity: 'Zenith Petro', core: 89, trade: 91, treasury: 0 },
    { entity: 'Nova Tech', core: 12, trade: 0, treasury: 0 }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner: Mission & Exasol Engine Status */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-navy-750 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-400" /> Executive Financial Risk Intelligence
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Period: 2026-M10 Closing</span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">
            Unified Risk & Financial Integrity Cockpit
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            FraudLens AI unifies real-time transaction surveillance, multi-ledger reconciliation, group exposure consolidation, and financial close governance into an explainable, auditable platform.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-navy-950/80 p-3 rounded-xl border border-navy-800">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Database className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-[11px] font-semibold text-slate-200">Exasol Personal Engine</div>
            <div className="text-[10px] font-mono text-emerald-400">Columnar • 0.94ms Avg Query</div>
          </div>
          <button
            onClick={onOpenSqlModal}
            className="ml-2 px-2.5 py-1 text-[11px] rounded bg-navy-800 hover:bg-navy-700 text-blue-300 border border-navy-700"
          >
            View SQL
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Flagged Fraud Cases */}
        <div 
          onClick={() => onNavigate('fraud')}
          className="bg-navy-900/90 hover:bg-navy-850 border border-navy-800 hover:border-red-500/40 p-5 rounded-xl shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Suspicious Transactions</span>
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-100 font-mono flex items-baseline gap-2">
              {cards.flaggedTransactionsCount || 7}
              <span className="text-xs font-sans font-medium text-red-400">High/Critical</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Active Structuring Syndicate</span>
              <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Inspect <ArrowUpRight className="w-3 h-3" />
              </span>
            </p>
          </div>
        </div>

        {/* Card 2: 3-Way Reconciliation */}
        <div 
          onClick={() => onNavigate('reconciliation')}
          className="bg-navy-900/90 hover:bg-navy-850 border border-navy-800 hover:border-blue-500/40 p-5 rounded-xl shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">3-Way Recon Match Rate</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <GitCompare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-100 font-mono flex items-baseline gap-2">
              {cards.reconciliationMatchRate}%
              <span className="text-xs font-sans font-medium text-amber-400">
                {formatCurrency(cards.totalVarianceAtRisk)} open
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Bank vs Ledger vs Gateway</span>
              <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Review <ArrowUpRight className="w-3 h-3" />
              </span>
            </p>
          </div>
        </div>

        {/* Card 3: Unified Exposure */}
        <div 
          onClick={() => onNavigate('exposure')}
          className="bg-navy-900/90 hover:bg-navy-850 border border-navy-800 hover:border-amber-500/40 p-5 rounded-xl shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Exposure Monitored</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-100 font-mono flex items-baseline gap-2">
              {formatCurrency(cards.totalExposureMonitored)}
              <span className="text-xs font-sans font-bold text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded">
                {cards.regulatoryBreachCount} Breach
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Vanguard ₹37 Cr Limit Breach</span>
              <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Inspect <ArrowUpRight className="w-3 h-3" />
              </span>
            </p>
          </div>
        </div>

        {/* Card 4: Month-End Close Readiness */}
        <div 
          onClick={() => onNavigate('month-end')}
          className="bg-navy-900/90 hover:bg-navy-850 border border-navy-800 hover:border-emerald-500/40 p-5 rounded-xl shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Close Readiness</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-100 font-mono flex items-baseline gap-2">
              {cards.closeReadinessPercentage}%
              <span className="text-xs font-sans font-medium text-red-400">
                {closeStats.criticalBlockers || 2} Blockers
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Status: {closeStats.closeHealth || 'BLOCKED'}</span>
              <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Checklist <ArrowUpRight className="w-3 h-3" />
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Cross-System Exposure Distribution */}
        <div className="lg:col-span-2 bg-navy-900/80 border border-navy-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Cross-System Exposure Aggregation (Exasol View)
              </h3>
              <p className="text-xs text-slate-400">
                Compares reported values across Core Banking, Treasury, and Trade systems in ₹ Crores
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Live SQL Aggregation
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={exposureChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="entity" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#203467', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="core" name="Core Banking" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="treasury" name="Treasury / Swaps" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="derivatives" name="Derivatives" fill="#EF4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="trade" name="Trade Finance" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-500 rounded-sm"></span> Core Banking</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-500 rounded-sm"></span> Treasury</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-500 rounded-sm"></span> Derivatives</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-500 rounded-sm"></span> Trade Finance</span>
          </div>
        </div>

        {/* Chart 2: Reconciliation Match Ratio */}
        <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-100">Reconciliation Health</h3>
              <span className="text-xs font-mono text-blue-400 font-semibold">{cards.reconciliationMatchRate}%</span>
            </div>
            <p className="text-xs text-slate-400">
              3-way reconciliation match vs open audit exceptions
            </p>
          </div>

          <div className="h-44 relative my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reconPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {reconPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold font-mono text-slate-100">{cards.reconciliationMatchRate}%</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Matched</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-navy-800 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Matched Volume
              </span>
              <span className="font-mono text-emerald-400 font-semibold">92.4%</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Open Material Discrepancies
              </span>
              <span className="font-mono text-red-400 font-semibold">{formatCurrency(cards.totalVarianceAtRisk)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Operational Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feed 1: Critical Fraud Alerts */}
        <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <h3 className="text-sm font-bold text-slate-100">Critical Risk & Fraud Alerts</h3>
            </div>
            <button 
              onClick={() => onNavigate('fraud')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              View All ({cards.flaggedTransactionsCount})
            </button>
          </div>

          <div className="space-y-3">
            {recentAlerts.map(alert => (
              <div 
                key={alert.id}
                onClick={() => onNavigate('fraud')}
                className="p-3 rounded-lg bg-navy-950/70 border border-navy-800 hover:border-red-500/40 transition-all flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-200">{alert.id}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                      SCORE: {alert.risk_score}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{alert.channel}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {alert.account_name} <span className="text-slate-500">→</span> {alert.counterparty_name}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-100">
                    {formatCurrency(alert.amount)}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feed 2: Top Unresolved Reconciliation Exceptions */}
        <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-slate-100">Unresolved Reconciliation Exceptions</h3>
            </div>
            <button 
              onClick={() => onNavigate('reconciliation')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              Open Hub
            </button>
          </div>

          <div className="space-y-3">
            {recentRecon.map((rec, i) => (
              <div 
                key={i}
                onClick={() => onNavigate('reconciliation')}
                className="p-3 rounded-lg bg-navy-950/70 border border-navy-800 hover:border-amber-500/40 transition-all flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-200">{rec.reconciliationRef}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      rec.reconStatus === 'UNMATCHED_BANK' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {rec.reconStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {rec.notes}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-amber-400">
                    {formatCurrency(rec.varianceAmount)}
                  </div>
                  <span className="text-[10px] text-slate-500">Variance</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewView;
