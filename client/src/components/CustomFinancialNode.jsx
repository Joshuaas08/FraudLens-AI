import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { ShieldAlert, Building2, User, Landmark, AlertTriangle } from 'lucide-react';

const CustomFinancialNode = ({ data }) => {
  const isCritical = data.risk === 'CRITICAL';
  const isHigh = data.risk === 'HIGH';

  const getNodeIcon = () => {
    switch (data.nodeType) {
      case 'shell':
      case 'intermediary':
        return <Building2 className="w-4 h-4 text-amber-400" />;
      case 'mule':
      case 'high_risk_asset':
        return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case 'syndicate':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      default:
        return <Landmark className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className={`px-4 py-3 rounded-lg shadow-xl border bg-navy-900 transition-all duration-200 min-w-[200px] ${
      isCritical 
        ? 'border-red-500/80 shadow-red-500/20 glow-red' 
        : (isHigh ? 'border-amber-500/80 shadow-amber-500/20' : 'border-navy-700 hover:border-blue-500/50')
    }`}>
      <Handle type="target" position={Position.Left} className="!bg-blue-500 !w-2.5 !h-2.5" />
      
      <div className="flex items-center gap-2 mb-1.5">
        <div className={`p-1.5 rounded-md ${
          isCritical ? 'bg-red-500/20' : (isHigh ? 'bg-amber-500/20' : 'bg-navy-800')
        }`}>
          {getNodeIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-100 truncate">{data.label}</p>
          <p className="text-[10px] text-slate-400 font-mono truncate">{data.accountId}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] pt-1 border-t border-navy-800/80">
        <span className="text-slate-400">{data.bank || data.city || 'Inter-Entity'}</span>
        <span className={`px-1.5 py-0.5 rounded font-mono font-medium ${
          isCritical ? 'bg-red-500/20 text-red-400' : (isHigh ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400')
        }`}>
          {data.risk}
        </span>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-blue-500 !w-2.5 !h-2.5" />
    </div>
  );
};

export default memo(CustomFinancialNode);
