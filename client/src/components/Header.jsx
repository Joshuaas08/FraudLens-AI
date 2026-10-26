import React from 'react';
import { 
  ShieldCheck, 
  Database, 
  Terminal, 
  Bot, 
  Bell, 
  Search, 
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

const Header = ({ 
  systemStatus, 
  onOpenSqlModal, 
  onToggleCopilot, 
  currency, 
  setCurrency,
  period,
  setPeriod 
}) => {
  const isExasolOnline = systemStatus?.databases?.analyticalEngine?.connected;
  const isMongoOnline = systemStatus?.databases?.applicationStore?.connected;

  return (
    <header className="h-16 bg-navy-950/80 border-b border-navy-800/80 px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
      {/* Brand & Track */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-300 bg-clip-text text-transparent">
                FraudLens AI
              </span>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                ExaThon 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Money, Risk & Regulation Track
            </p>
          </div>
        </div>

        {/* Database Status Badges */}
        <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-navy-800">
          <button 
            onClick={onOpenSqlModal}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-navy-900 hover:bg-navy-800 border border-navy-750 hover:border-blue-500/40 transition-all text-xs group"
            title="Click to inspect Exasol analytical queries"
          >
            <span className={`w-2 h-2 rounded-full ${isExasolOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-300 font-medium">Exasol Personal:</span>
            <span className="font-mono text-emerald-400 text-[11px]">Columnar 0.9ms</span>
            <Terminal className="w-3 h-3 text-slate-500 group-hover:text-blue-400" />
          </button>

          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-navy-900 border border-navy-750 text-xs">
            <span className={`w-2 h-2 rounded-full ${isMongoOnline ? 'bg-emerald-400' : 'bg-blue-400'}`} />
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">App Store:</span>
            <span className="text-slate-300 font-medium">MongoDB/Mongoose</span>
          </div>
        </div>
      </div>

      {/* Controls & Actions */}
      <div className="flex items-center gap-3">
        {/* Currency Selector */}
        <div className="flex items-center bg-navy-900 rounded-lg p-0.5 border border-navy-800 text-xs font-mono">
          <button 
            onClick={() => setCurrency('INR')}
            className={`px-2 py-1 rounded font-semibold transition-all ${
              currency === 'INR' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ₹ INR
          </button>
          <button 
            onClick={() => setCurrency('USD')}
            className={`px-2 py-1 rounded font-semibold transition-all ${
              currency === 'USD' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            $ USD
          </button>
        </div>

        {/* Period Selector */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-800 text-xs text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-medium text-slate-400">Period:</span>
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-transparent text-slate-200 font-mono focus:outline-none cursor-pointer"
          >
            <option value="2026-M10" className="bg-navy-950">2026-M10 (Current)</option>
            <option value="2026-M09" className="bg-navy-950">2026-M09 (Audited)</option>
            <option value="2026-Q3" className="bg-navy-950">2026-Q3 (Quarterly)</option>
          </select>
        </div>

        {/* AI Copilot Button */}
        <button
          onClick={onToggleCopilot}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs shadow-lg shadow-blue-600/25 border border-blue-400/30 transition-all transform hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4 text-blue-200 animate-pulse" />
          <span>AI Copilot</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
