import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  User, 
  AlertTriangle, 
  Check, 
  ShieldAlert, 
  Database,
  ArrowRight,
  Download,
  Calendar
} from 'lucide-react';
import { api } from '../services/api.js';

const MonthEndCloseView = ({ currency }) => {
  const [closeData, setCloseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  useEffect(() => {
    loadReadiness();
  }, []);

  const loadReadiness = async () => {
    try {
      setLoading(true);
      const res = await api.getMonthEndReadiness();
      setCloseData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOff = async (task) => {
    try {
      setUpdatingTaskId(task.id);
      await api.updateCloseTask(task.id, {
        status: 'COMPLETED',
        notes: `Signed off by Financial Close Lead. Variance reviewed against materiality.`,
        actor: 'Priya Sharma (Senior Accountant)'
      });
      await loadReadiness();
    } catch (err) {
      alert('Error signing off task: ' + err.message);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '₹0';
    if (currency === 'USD') return `$${(val / 85).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const stats = closeData?.stats || {};
  const tasks = closeData?.tasks || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
            Month-End Financial Close Readiness Cockpit
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time close progress, materiality variance thresholds, and critical ledger blockers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-navy-900 px-3 py-1.5 rounded-lg border border-navy-800 text-xs text-slate-300 font-mono">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>Target Close: Oct 31, 2026</span>
          </div>
          <button 
            onClick={() => alert('Exporting Official Close Audit Dossier (XML / PDF) for External Auditors.')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-200 text-xs font-medium border border-navy-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Auditor Dossier</span>
          </button>
        </div>
      </div>

      {/* Close Health Banner */}
      <div className={`p-6 rounded-2xl border shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
        stats.closeHealth === 'BLOCKED' 
          ? 'bg-gradient-to-r from-red-950/40 via-navy-900 to-navy-900 border-red-500/40' 
          : 'bg-gradient-to-r from-emerald-950/40 via-navy-900 to-navy-900 border-emerald-500/40'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl ${
            stats.closeHealth === 'BLOCKED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            <AlertOctagon className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                stats.closeHealth === 'BLOCKED' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                CLOSE STATUS: {stats.closeHealth}
              </span>
              <span className="text-xs text-slate-400 font-mono">Period: 2026-M10</span>
            </div>
            <h3 className="text-lg font-black text-slate-100">
              {stats.criticalBlockers} Critical Close Blockers Preventing General Ledger Sign-Off
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              All tasks with variances exceeding the entity materiality threshold must be reconciled and signed off before books can be officially sealed.
            </p>
          </div>
        </div>

        {/* Readiness Circular Progress Bar */}
        <div className="flex items-center gap-6 bg-navy-950/80 p-4 rounded-xl border border-navy-800">
          <div>
            <span className="text-xs text-slate-400 block">Close Readiness</span>
            <div className="text-3xl font-black font-mono text-slate-100 mt-0.5">
              {stats.readinessPct}%
            </div>
          </div>
          <div className="h-12 w-px bg-navy-800" />
          <div>
            <span className="text-xs text-slate-400 block">Outstanding Variance</span>
            <div className="text-lg font-black font-mono text-amber-400 mt-0.5">
              {formatCurrency(stats.outstandingVariance)}
            </div>
          </div>
        </div>
      </div>

      {/* Task Checklist Table */}
      <div className="bg-navy-900/80 border border-navy-800 rounded-xl overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-navy-800 flex items-center justify-between bg-navy-950/60">
          <h3 className="text-sm font-bold text-slate-100">
            Financial Close Checklist & Sign-Off Matrix ({tasks.length} Control Tasks)
          </h3>
          <span className="text-xs font-mono text-emerald-400">
            {stats.completedTasks} of {stats.totalTasks} Completed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-navy-950 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-navy-800">
              <tr>
                <th className="py-3 px-4">Task Name & Category</th>
                <th className="py-3 px-4">Assigned Lead</th>
                <th className="py-3 px-4">Materiality Threshold</th>
                <th className="py-3 px-4">Open Variance</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Sign-Off</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {tasks.map(task => {
                const isCompleted = task.status === 'COMPLETED';
                const isBlocked = task.status === 'BLOCKED' || task.blocker_severity === 'CRITICAL';
                const isWarning = task.blocker_severity === 'WARNING';

                return (
                  <tr key={task.id} className="hover:bg-navy-850/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-100">{task.task_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {task.id} • {task.category} • {task.entity_code}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>{task.assigned_to}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-400">
                      {formatCurrency(task.materiality_threshold)}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold">
                      {task.variance_amount > 0 ? (
                        <span className={task.variance_amount > task.materiality_threshold ? 'text-red-400' : 'text-amber-400'}>
                          {formatCurrency(task.variance_amount)}
                        </span>
                      ) : (
                        <span className="text-slate-500">₹0.00</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        task.blocker_severity === 'CRITICAL' 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                          : (task.blocker_severity === 'WARNING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-navy-800 text-slate-400')
                      }`}>
                        {task.blocker_severity}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                        isCompleted 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : (isBlocked ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400')
                      }`}>
                        {task.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {!isCompleted ? (
                        <button
                          onClick={() => handleSignOff(task)}
                          disabled={updatingTaskId === task.id}
                          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-[11px] shadow-sm transition-colors flex items-center gap-1 ml-auto"
                        >
                          <Check className="w-3 h-3" />
                          <span>{updatingTaskId === task.id ? 'Signing...' : 'Sign Off'}</span>
                        </button>
                      ) : (
                        <span className="text-emerald-400 text-[11px] flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
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
    </div>
  );
};

export default MonthEndCloseView;
