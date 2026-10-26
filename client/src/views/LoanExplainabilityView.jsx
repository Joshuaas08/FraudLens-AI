import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Sliders, 
  FileText, 
  ArrowRight, 
  TrendingUp, 
  Sparkles,
  RefreshCw,
  Scale,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { api } from '../services/api.js';

const LoanExplainabilityView = ({ currency }) => {
  const [loans, setLoans] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState('LN-2026-881');
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [explaining, setExplaining] = useState(false);

  // What-If Simulation State
  const [collateralIncrease, setCollateralIncrease] = useState(5000000); // 50 Lakhs
  const [debtReduction, setDebtReduction] = useState(8000000); // 80 Lakhs
  const [resolvedBounces, setResolvedBounces] = useState(5);
  const [settledUndisclosed, setSettledUndisclosed] = useState(true);
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    loadLoans();
  }, []);

  useEffect(() => {
    if (selectedLoanId) {
      loadExplanation(selectedLoanId);
      setSimulationResult(null); // Reset simulator
    }
  }, [selectedLoanId]);

  const loadLoans = async () => {
    try {
      setLoading(true);
      const res = await api.getLoanApplications();
      setLoans(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadExplanation = async (id) => {
    try {
      setExplaining(true);
      const res = await api.explainLoan(id);
      setExplanation(res);
    } catch (err) {
      console.error(err);
    } finally {
      setExplaining(false);
    }
  };

  const runSimulation = async () => {
    if (!selectedLoanId) return;
    try {
      setSimulating(true);
      const res = await api.simulateLoanScenario(selectedLoanId, {
        collateralIncrease: Number(collateralIncrease),
        debtReductionAmount: Number(debtReduction),
        resolvedBounces: Number(resolvedBounces),
        settledUndisclosedDebt: settledUndisclosed
      });
      setSimulationResult(res.simulationResult);
    } catch (err) {
      alert('Simulation error: ' + err.message);
    } finally {
      setSimulating(false);
    }
  };

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '₹0';
    if (currency === 'USD') return `$${(val / 85).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const currentLoan = loans.find(l => l.id === selectedLoanId);

  // Prepare waterfall chart data
  const waterfallData = explanation?.factors?.map(f => ({
    name: f.name.replace(/\(.*?\)/g, '').trim(),
    scoreContribution: f.scoreContribution,
    impact: f.impact,
    value: f.value
  })) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="border-b border-navy-800 pb-4">
        <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-blue-400" />
          Explainable Loan Decision Intelligence & Adverse Action Engine
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Auditable attribution models explaining credit rejections, generating regulatory notices, and simulating what-if borrower adjustments
        </p>
      </div>

      {/* Loan Application Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {loans.map(loan => {
          const isSelected = loan.id === selectedLoanId;
          const isDeclined = loan.decision === 'DECLINED';
          const isApproved = loan.decision === 'APPROVED';

          return (
            <div
              key={loan.id}
              onClick={() => setSelectedLoanId(loan.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-navy-850 border-blue-500 shadow-lg shadow-blue-500/10' 
                  : 'bg-navy-900/80 border-navy-800 hover:border-navy-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-slate-200">{loan.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  isDeclined ? 'bg-red-500/20 text-red-400' : (isApproved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400')
                }`}>
                  {loan.decision}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-100 truncate">{loan.applicant_name}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{loan.business_type}</p>
              <div className="mt-2 pt-2 border-t border-navy-800/80 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono">{formatCurrency(loan.requested_amount)}</span>
                <span className="text-slate-300 font-mono">CIBIL: {loan.cibil_score}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Analysis Grid */}
      {explanation && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1 & 2: Waterfall Chart & Factor Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Factor Waterfall Chart */}
            <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    Credit Decision Factor Waterfall Breakdown
                  </h3>
                  <p className="text-xs text-slate-400">
                    Calculates positive and negative factor weights relative to institutional credit threshold
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase">Approval Probability</span>
                  <div className={`text-xl font-black font-mono ${
                    explanation.approvalProbabilityPct >= 65 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {explanation.approvalProbabilityPct}%
                  </div>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waterfallData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                    <XAxis type="number" stroke="#64748B" fontSize={11} domain={[-40, 30]} />
                    <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} tickLine={false} width={130} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0B132B', borderColor: '#203467', borderRadius: '8px', fontSize: '11px' }}
                      formatter={(val, name, props) => [`Score Contribution: ${val > 0 ? '+' : ''}${val} pts`, `Observed: ${props.payload.value}`]}
                    />
                    <Bar dataKey="scoreContribution" radius={[0, 4, 4, 0]}>
                      {waterfallData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.scoreContribution > 0 ? '#10B981' : '#EF4444'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Factor Details Table */}
            <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-5 shadow-lg">
              <h3 className="text-sm font-bold text-slate-100 mb-3">
                Principal Decision Factors & Threshold Benchmarks
              </h3>
              <div className="space-y-2.5">
                {explanation.factors?.map((f, i) => {
                  const isNeg = f.impact.includes('NEGATIVE');
                  return (
                    <div 
                      key={i} 
                      className={`p-3 rounded-lg border flex items-start justify-between text-xs gap-3 ${
                        isNeg ? 'bg-red-950/20 border-red-500/30' : 'bg-emerald-950/20 border-emerald-500/30'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-200">{f.name}</span>
                          <span className="font-mono text-slate-400">({f.value} vs req {f.benchmark})</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{f.explanation}</p>
                      </div>
                      <span className={`font-mono font-bold text-xs whitespace-nowrap ${
                        isNeg ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {f.scoreContribution > 0 ? '+' : ''}{f.scoreContribution} pts
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Official Adverse Action Customer Notice (Plain English) */}
            <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <h4 className="text-sm font-bold text-slate-100">
                    Official Regulatory Adverse Action Notice (Customer Copy)
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-navy-950 px-2 py-0.5 rounded">
                  {explanation.customerNotice?.complianceCode}
                </span>
              </div>

              <div className="bg-navy-950 p-4 rounded-lg border border-navy-800 font-sans text-xs text-slate-300 space-y-2.5 leading-relaxed">
                <div className="flex justify-between text-slate-400 text-[11px] border-b border-navy-800 pb-2">
                  <span>To: {explanation.customerNotice?.applicantName}</span>
                  <span>Date: {explanation.customerNotice?.date}</span>
                </div>
                <p>
                  Thank you for your application for a commercial credit facility of {formatCurrency(explanation.requestedAmount)}. Following transparent algorithmic and underwriting evaluation, we regret to inform you that your request cannot be approved in its current structure due to the following principal factors:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-red-300">
                  {explanation.customerNotice?.principalDeclineFactors?.map((reason, i) => (
                    <li key={i}>{reason}</li>
                  ))}
                </ul>
                <div className="p-3 bg-navy-900 rounded border border-navy-800 text-[11px]">
                  <span className="font-bold text-slate-200 block mb-0.5">Eligibility Restoration Roadmap:</span>
                  <p className="text-slate-400">{explanation.customerNotice?.nextStepsRecommendation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Interactive What-If Simulator */}
          <div className="space-y-6">
            <div className="bg-navy-900/80 border border-blue-500/30 rounded-xl p-5 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-navy-800 pb-3">
                <Sliders className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-slate-100">Interactive "What-If" Simulator</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Adjust financial parameters to model how borrower debt reduction or collateral infusions change the approval outcome.
              </p>

              <div className="space-y-4 text-xs">
                {/* Parameter 1: Collateral Infusion */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Pledge Additional Collateral</span>
                    <span className="font-mono text-blue-400 font-bold">{formatCurrency(collateralIncrease)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20000000}
                    step={1000000}
                    value={collateralIncrease}
                    onChange={(e) => setCollateralIncrease(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                {/* Parameter 2: Debt Reduction */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Pay Down Existing Debt</span>
                    <span className="font-mono text-emerald-400 font-bold">{formatCurrency(debtReduction)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20000000}
                    step={1000000}
                    value={debtReduction}
                    onChange={(e) => setDebtReduction(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Parameter 3: Resolved Cheque Bounces */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Clean NACH Bounce Record</span>
                    <span className="font-mono text-slate-200 font-bold">{resolvedBounces} bounces cleared</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={7}
                    step={1}
                    value={resolvedBounces}
                    onChange={(e) => setResolvedBounces(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Parameter 4: Settle Undisclosed Debt */}
                <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-navy-950 border border-navy-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settledUndisclosed}
                    onChange={(e) => setSettledUndisclosed(e.target.checked)}
                    className="rounded accent-blue-500"
                  />
                  <span className="text-slate-300 text-[11px]">
                    Settle Unlisted Cross-System Liabilities
                  </span>
                </label>

                <button
                  onClick={runSimulation}
                  disabled={simulating}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  <span>{simulating ? 'Re-Evaluating Underwriting Engine...' : 'Run Scenario Simulation'}</span>
                </button>
              </div>

              {/* Simulation Result Box */}
              {simulationResult && (
                <div className="p-4 rounded-xl bg-navy-950 border border-navy-750 space-y-3 animate-fade-in text-xs">
                  <div className="flex items-center justify-between border-b border-navy-800 pb-2">
                    <span className="text-slate-400">Simulated Outcome:</span>
                    <span className={`font-bold px-2 py-0.5 rounded ${
                      simulationResult.simulatedDecision === 'APPROVED' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : (simulationResult.simulatedDecision === 'CONDITIONAL' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400')
                    }`}>
                      {simulationResult.simulatedDecision}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="bg-navy-900 p-2 rounded">
                      <span className="text-slate-500 block">Approval Prob.</span>
                      <span className="font-bold text-emerald-400">{simulationResult.simulatedApprovalProbability}%</span>
                    </div>
                    <div className="bg-navy-900 p-2 rounded">
                      <span className="text-slate-500 block">New DSCR</span>
                      <span className="font-bold text-slate-200">{simulationResult.modifiedParameters.dscr}x</span>
                    </div>
                    <div className="bg-navy-900 p-2 rounded">
                      <span className="text-slate-500 block">New LTV</span>
                      <span className="font-bold text-slate-200">{simulationResult.modifiedParameters.ltv_ratio}%</span>
                    </div>
                    <div className="bg-navy-900 p-2 rounded">
                      <span className="text-slate-500 block">Open Bounces</span>
                      <span className="font-bold text-slate-200">{simulationResult.modifiedParameters.bounce_count}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {simulationResult.simulationSummary}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanExplainabilityView;
