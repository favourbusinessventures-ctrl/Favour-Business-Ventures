import { useState, useEffect, useCallback } from 'react';
import { runSystemHealthDiagnostics, SystemHealthReport } from '../services/health/systemHealthService';

interface UseSystemHealthOptions {
  autoRefreshIntervalMs?: number; // default 0 (manual refresh)
  enabled?: boolean;
}

export function useSystemHealth(options: UseSystemHealthOptions = {}) {
  const { autoRefreshIntervalMs = 0, enabled = true } = options;
  const [report, setReport] = useState<SystemHealthReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await runSystemHealthDiagnostics();
      setReport(data);
      setLastCheckTime(new Date());
    } catch (err: any) {
      console.warn('Health check exception:', err);
      setError(err?.message || 'Failed to complete system health check');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    checkHealth();

    if (autoRefreshIntervalMs > 0) {
      const interval = setInterval(checkHealth, autoRefreshIntervalMs);
      return () => clearInterval(interval);
    }
  }, [checkHealth, autoRefreshIntervalMs, enabled]);

  return {
    report,
    loading,
    error,
    lastCheckTime,
    refreshHealth: checkHealth
  };
}
