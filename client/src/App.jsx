import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import OverviewView from './views/OverviewView.jsx';
import FraudDetectionView from './views/FraudDetectionView.jsx';
import ReconciliationView from './views/ReconciliationView.jsx';
import ExposureIntelligenceView from './views/ExposureIntelligenceView.jsx';
import LoanExplainabilityView from './views/LoanExplainabilityView.jsx';
import MonthEndCloseView from './views/MonthEndCloseView.jsx';
import CaseManagementView from './views/CaseManagementView.jsx';
import AICopilotDrawer from './components/AICopilotDrawer.jsx';
import ExasolSqlViewerModal from './components/ExasolSqlViewerModal.jsx';
import { api } from './services/api.js';

import { 
  LayoutDashboard, 
  ShieldAlert, 
  GitCompare, 
  Scale, 
  FileSpreadsheet, 
  FileCheck2, 
  FolderLock,
  Sparkles,
  Bot
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [currency, setCurrency] = useState('INR');
  const [period, setPeriod] = useState('2026-M10');
  const [systemStatus, setSystemStatus] = useState(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const data = await api.getSystemStatus();
      setSystemStatus(data);
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Executive Cockpit', icon: LayoutDashboard },
    { id: 'fraud', label: 'Fraud & Network Graph', icon: ShieldAlert },
    { id: 'reconciliation', label: '3-Way Reconciliation', icon: GitCompare },
    { id: 'exposure', label: 'Unified Exposures', icon: Scale },
    { id: 'loans', label: 'Explainable Loans', icon: FileSpreadsheet },
    { id: 'month-end', label: 'Month-End Close', icon: FileCheck2 },
    { id: 'cases', label: 'Cases & Audit Trail', icon: FolderLock }
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header
        systemStatus={systemStatus}
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
        onToggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
        currency={currency}
        setCurrency={setCurrency}
        period={period}
        setPeriod={setPeriod}
      />

      {/* Main Navigation Bar */}
      <nav className="bg-navy-900/60 border-b border-navy-800 px-6 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
                  isActive 
                    ? 'border-blue-500 text-blue-400 bg-blue-500/5' 
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-navy-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main View Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {activeTab === 'overview' && (
          <OverviewView 
            onNavigate={(tab) => setActiveTab(tab)} 
            onOpenSqlModal={() => setIsSqlModalOpen(true)}
            currency={currency} 
          />
        )}
        {activeTab === 'fraud' && (
          <FraudDetectionView 
            onNavigate={(tab) => setActiveTab(tab)} 
            currency={currency} 
          />
        )}
        {activeTab === 'reconciliation' && (
          <ReconciliationView currency={currency} />
        )}
        {activeTab === 'exposure' && (
          <ExposureIntelligenceView currency={currency} />
        )}
        {activeTab === 'loans' && (
          <LoanExplainabilityView currency={currency} />
        )}
        {activeTab === 'month-end' && (
          <MonthEndCloseView currency={currency} />
        )}
        {activeTab === 'cases' && (
          <CaseManagementView currency={currency} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-navy-800/60 bg-navy-950 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>FraudLens AI — ExaThon India 2026 | Money, Risk & Regulation Track</span>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Analytical Engine: Exasol Personal Columnar</span>
            <span>•</span>
            <span>App Store: MongoDB Mongoose</span>
          </div>
        </div>
      </footer>

      {/* Slide-out AI Copilot Drawer */}
      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Exasol SQL Execution Modal */}
      <ExasolSqlViewerModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
        queryHistory={systemStatus?.databases?.analyticalEngine?.lastQueries || []}
      />

      {/* Floating AI Copilot Trigger (Bottom-Right) */}
      {!isCopilotOpen && (
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-2xl shadow-blue-500/40 border border-blue-400/40 transition-transform hover:scale-110 flex items-center gap-2 group"
          title="Open AI Investigation Copilot"
        >
          <Bot className="w-5 h-5 animate-pulse" />
          <span className="text-xs font-bold pr-1 hidden group-hover:inline transition-all">
            Ask Copilot
          </span>
        </button>
      )}
    </div>
  );
}
