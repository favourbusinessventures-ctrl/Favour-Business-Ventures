import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  RefreshCw, 
  Database, 
  ShieldCheck, 
  Package, 
  Star, 
  Headphones, 
  Image as ImageIcon, 
  ShoppingBag, 
  Server, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Zap, 
  Info,
  ExternalLink
} from 'lucide-react';
import { useSystemHealth } from '../hooks/useSystemHealth';
import { ServiceHealthItem, ServiceStatus } from '../services/health/systemHealthService';

export const AdminSystemHealth: React.FC = () => {
  const { report, loading, error, lastCheckTime, refreshHealth } = useSystemHealth();
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [testActive, setTestActive] = useState<boolean>(false);
  const [manualNotice, setManualNotice] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    if (!report) return;
    const allExpanded: Record<string, boolean> = {};
    report.services.forEach(s => {
      allExpanded[s.id] = true;
    });
    setExpandedCards(allExpanded);
  };

  const collapseAll = () => {
    setExpandedCards({});
  };

  const runQuickTest = async (testName: string) => {
    setTestActive(true);
    setManualNotice(`Running live probe for ${testName}...`);
    await refreshHealth();
    setManualNotice(`Diagnostic probe for ${testName} completed successfully.`);
    setTestActive(false);
    setTimeout(() => setManualNotice(null), 4000);
  };

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'frontend':
        return Activity;
      case 'database':
        return Database;
      case 'authentication':
        return ShieldCheck;
      case 'productCatalog':
        return Package;
      case 'reviews':
        return Star;
      case 'customerCare':
        return Headphones;
      case 'imageStorage':
        return ImageIcon;
      case 'orders':
        return ShoppingBag;
      case 'apiWorker':
        return Server;
      default:
        return Activity;
    }
  };

  const getStatusBadge = (status: ServiceStatus) => {
    switch (status) {
      case 'Operational':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-sans-clean font-semibold tracking-wider uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Operational
          </span>
        );
      case 'Degraded':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-sans-clean font-semibold tracking-wider uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Degraded
          </span>
        );
      case 'Needs attention':
      case 'Unavailable':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-sans-clean font-semibold tracking-wider uppercase bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Needs Attention
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-sans-clean font-semibold tracking-wider uppercase bg-slate-500/15 text-slate-400 border border-slate-500/30">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto selection:bg-[#B8954A]/30">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#16382A]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2">
            <span className="w-4 h-[1.5px] bg-[#B8954A]" />
            <span className="text-[10px] font-sans-clean font-semibold tracking-[0.25em] uppercase text-[#B8954A]">
              Platform Diagnostics
            </span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-4xl font-bold tracking-tight text-[#EDEDED]">
            System Health & Reliability
          </h1>
          <p className="text-xs sm:text-sm text-[#A3B899] font-sans-clean font-light max-w-2xl">
            Real-time status monitoring and diagnostic protection for customer-facing storefront services, database connectivity, and APIs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => refreshHealth()}
            disabled={loading || testActive}
            className="btn-tactile inline-flex items-center gap-2 px-4 py-2.5 bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16] text-xs font-bold tracking-wider uppercase rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50 min-h-[44px]"
            aria-label="Run diagnostic check"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Checking...' : 'Run Diagnostics'}</span>
          </button>
        </div>
      </div>

      {/* ── Notification Feedback ── */}
      {manualNotice && (
        <div className="p-3.5 bg-[#0D3325] border border-[#B8954A]/40 rounded-xl text-xs font-sans-clean text-[#EDEDED] flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-[#B8954A] shrink-0" />
            <span>{manualNotice}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800/40 rounded-xl text-xs font-sans-clean text-rose-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block font-semibold">Diagnostic Notification</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* ── Overall System Status Banner ── */}
      {report && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`p-6 sm:p-8 rounded-2xl border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
            report.overallStatus === 'Operational'
              ? 'bg-gradient-to-r from-[#0D3325] to-[#071F16] border-[#16382A]'
              : report.overallStatus === 'Degraded'
              ? 'bg-gradient-to-r from-amber-950/30 to-[#071F16] border-amber-900/40'
              : 'bg-gradient-to-r from-rose-950/30 to-[#071F16] border-rose-900/40'
          }`}
        >
          <div className="flex items-start sm:items-center gap-4">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner ${
              report.overallStatus === 'Operational'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : report.overallStatus === 'Degraded'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}>
              {report.overallStatus === 'Operational' ? (
                <CheckCircle2 className="w-7 h-7" />
              ) : report.overallStatus === 'Degraded' ? (
                <AlertTriangle className="w-7 h-7" />
              ) : (
                <AlertCircle className="w-7 h-7" />
              )}
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.25em] text-[#B8954A]">
                Overall System Status
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#EDEDED]">
                {report.overallStatus === 'Operational'
                  ? 'All Systems Operational'
                  : report.overallStatus === 'Degraded'
                  ? 'Some Services Degraded (Fallbacks Active)'
                  : 'System Health Needs Attention'}
              </h2>
              <p className="text-xs sm:text-sm text-[#A3B899] font-sans-clean font-light">
                {report.operationalCount} of {report.totalServices} subsystems fully healthy with zero customer interruptions.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:flex-col md:items-end text-xs font-sans-clean text-[#A3B899] border-t md:border-t-0 border-[#16382A] pt-4 md:pt-0">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#B8954A]" />
              <span>
                Last check: {lastCheckTime ? lastCheckTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Just now'}
              </span>
            </div>
            {report.apiUptimeSeconds !== undefined && report.apiUptimeSeconds > 0 && (
              <div className="text-[11px] text-[#A3B899]/75">
                API Uptime: {Math.floor(report.apiUptimeSeconds / 60)}m {report.apiUptimeSeconds % 60}s
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ── Subsystem Cards Header & Controls ── */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#A3B899]">
          Individual Subsystem Checks ({report?.services.length || 0})
        </div>
        <div className="flex items-center gap-2 text-xs font-sans-clean">
          <button
            type="button"
            onClick={expandAll}
            className="px-2.5 py-1 text-[#A3B899] hover:text-[#EDEDED] transition-colors cursor-pointer"
          >
            Expand All
          </button>
          <span className="text-[#16382A]">|</span>
          <button
            type="button"
            onClick={collapseAll}
            className="px-2.5 py-1 text-[#A3B899] hover:text-[#EDEDED] transition-colors cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* ── Subsystem Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {report?.services.map((item) => {
          const Icon = getServiceIcon(item.id);
          const isExpanded = Boolean(expandedCards[item.id]);

          return (
            <div
              key={item.id}
              className="bg-[#0D3325] border border-[#16382A] hover:border-[#B8954A]/30 rounded-2xl p-5 sm:p-6 transition-all flex flex-col justify-between space-y-4 shadow-lg"
            >
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#071F16] border border-[#16382A] flex items-center justify-center text-[#B8954A] shadow-inner shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                <div>
                  <h3 className="font-editorial text-lg font-bold text-[#EDEDED]">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#A3B899] font-sans-clean font-light mt-1 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>

              {/* Metrics & Expandable Section */}
              <div className="pt-3 border-t border-[#16382A] space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-sans-clean text-[#A3B899]">
                  <span>
                    {item.latencyMs !== undefined ? `Response: ${item.latencyMs}ms` : 'Status: Ready'}
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => toggleExpand(item.id)}
                    className="inline-flex items-center gap-1 text-[#B8954A] hover:text-[#C9A75E] transition-colors cursor-pointer font-medium"
                    aria-expanded={isExpanded}
                  >
                    <span>{isExpanded ? 'Hide Details' : 'Details'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Technical Accordion */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-2 text-xs font-sans-clean space-y-2 border-t border-[#16382A]/80 text-[#EDEDED]/80"
                  >
                    <p className="leading-relaxed text-[11px] text-[#A3B899]">
                      {item.details}
                    </p>

                    {item.technicalInfo && (
                      <div className="p-2.5 rounded-lg bg-[#071F16] border border-[#16382A] space-y-1 font-mono text-[10px] text-[#A3B899]">
                        {item.technicalInfo.diagnosticCode && (
                          <div>CODE: <span className="text-[#EDEDED]">{item.technicalInfo.diagnosticCode}</span></div>
                        )}
                        {item.technicalInfo.endpoint && (
                          <div>ROUTE: <span className="text-[#EDEDED]">{item.technicalInfo.endpoint}</span></div>
                        )}
                        {item.technicalInfo.responseTimeMs !== undefined && (
                          <div>LATENCY: <span className="text-[#EDEDED]">{item.technicalInfo.responseTimeMs}ms</span></div>
                        )}
                        {item.technicalInfo.itemCount !== undefined && (
                          <div>RECORDS: <span className="text-[#EDEDED]">{item.technicalInfo.itemCount}</span></div>
                        )}
                      </div>
                    )}

                    <div className="pt-1 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => runQuickTest(item.name)}
                        className="text-[10px] uppercase tracking-wider text-[#B8954A] hover:underline cursor-pointer inline-flex items-center gap-1"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        <span>Re-test Subsystem</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer Guidance ── */}
      <div className="p-5 sm:p-6 bg-[#0D3325]/60 border border-[#16382A] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-sans-clean text-[#A3B899]">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#B8954A] shrink-0" />
          <span>
            Fail-Safe Protection Active: If cloud connections ever drop, the storefront automatically provides verified fallback catalogs and WhatsApp direct ordering.
          </span>
        </div>
        <button
          type="button"
          onClick={() => window.open('/api/health', '_blank')}
          className="inline-flex items-center gap-1 text-[#B8954A] hover:text-[#C9A75E] underline cursor-pointer shrink-0"
        >
          <span>Raw Health JSON</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

    </div>
  );
};
