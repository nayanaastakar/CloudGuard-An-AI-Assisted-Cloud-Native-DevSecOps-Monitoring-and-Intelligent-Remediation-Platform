/**
 * Security data hooks with React Query caching
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

// Types for security data



































































































// Query key factory to include cluster ID for proper cache isolation
const getSecurityQueryKey = (clusterId) =>
['security', 'combined', clusterId ?? 'default'];

async function fetchSecurityData() {
  // Fetch all security data in parallel with debug logging
  const [dashboardRes, rbacRes, netPolRes, trendsRes] = await Promise.all([
  api.get('/security/dashboard').catch((err) => {
    console.debug('[Security] Dashboard fetch failed:', err?.response?.status, err?.message);
    return { data: null };
  }),
  api.get('/security/rbac/summary').catch((err) => {
    console.debug('[Security] RBAC summary fetch failed:', err?.response?.status, err?.message);
    return { data: null };
  }),
  api.get('/security/network-policies/summary').catch((err) => {
    console.debug('[Security] Network policies fetch failed:', err?.response?.status, err?.message);
    return { data: null };
  }),
  api.get('/security/trends/summary').catch((err) => {
    console.debug('[Security] Trends fetch failed:', err?.response?.status, err?.message);
    return { data: null };
  })]
  );

  // Log results for debugging
  if (import.meta.env.DEV) {
    console.debug('[Security] Data fetch results:', {
      dashboard: dashboardRes.data ? 'OK' : 'NULL',
      rbac: rbacRes.data ? 'OK' : 'NULL',
      networkPolicy: netPolRes.data ? 'OK' : 'NULL',
      trends: trendsRes.data ? 'OK' : 'NULL'
    });
  }

  // Missing API data is unavailable, not evidence of a clean cluster.
  const dashboardData = dashboardRes.data;

  return {
    dashboard: dashboardData,
    rbacSummary: rbacRes.data,
    networkPolicySummary: netPolRes.data,
    trendsSummary: trendsRes.data
  };
}

/**
 * Security dashboard data hook with cluster-aware caching
 * @param clusterId - The active cluster ID to use for cache isolation
 */
export function useSecurityDashboard(clusterId) {
  const queryClient = useQueryClient();
  const effectiveClusterId = clusterId ?? 'default';
  const queryKey = getSecurityQueryKey(effectiveClusterId);

  const query = useQuery({
    queryKey,
    queryFn: fetchSecurityData,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 1000
  });

  const refresh = async () => {
    await queryClient.removeQueries({ queryKey });
    await queryClient.refetchQueries({ queryKey });
  };

  // Hard reset - clears all security caches
  const hardReset = async () => {
    await queryClient.removeQueries({ queryKey: ['security'] });
    await queryClient.refetchQueries({ queryKey });
  };

  return {
    data: query.data,
    dashboard: query.data?.dashboard ?? null,
    rbacSummary: query.data?.rbacSummary ?? null,
    networkPolicySummary: query.data?.networkPolicySummary ?? null,
    trendsSummary: query.data?.trendsSummary ?? null,
    isLoading: query.isLoading,
    isRefetching: query.isFetching && !query.isLoading,
    error: query.error,
    refresh,
    hardReset
  };
}

export default useSecurityDashboard;

// Export types for use in components