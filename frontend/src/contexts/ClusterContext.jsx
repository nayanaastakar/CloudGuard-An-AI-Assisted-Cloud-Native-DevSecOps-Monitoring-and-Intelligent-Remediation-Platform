import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { clustersApi } from '../services/api';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";











const ClusterContext = /*#__PURE__*/createContext(undefined);

export function ClusterProvider({ children }) {
  const [clusters, setClusters] = useState([]);
  const [activeCluster, setActiveClusterState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClusters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clustersApi.list();
      const data = response.data;
      setClusters(data.clusters);

      // Find and set the active cluster
      const active = data.clusters.find((c) => c.is_active);
      if (active) {
        setActiveClusterState(active);
      } else if (data.clusters.length > 0) {
        // If no active cluster, set the first one as active
        setActiveClusterState(data.clusters[0]);
      }
    } catch (err) {
      console.error('Failed to fetch clusters:', err);
      setError('Failed to load clusters');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClusters();
  }, [fetchClusters]);

  const setActiveCluster = useCallback(async (clusterId) => {
    try {
      setError(null);
      await clustersApi.setActive(clusterId);

      // Update local state
      const cluster = clusters.find((c) => c.id === clusterId);
      if (cluster) {
        setActiveClusterState(cluster);
        // Update clusters list to reflect new active state
        setClusters((prev) => prev.map((c) => ({
          ...c,
          is_active: c.id === clusterId
        })));
      }
    } catch (err) {
      console.error('Failed to set active cluster:', err);
      setError('Failed to switch cluster');
      throw err;
    }
  }, [clusters]);

  const refreshClusters = useCallback(async () => {
    await fetchClusters();
  }, [fetchClusters]);

  return (/*#__PURE__*/
    _jsxDEV(ClusterContext.Provider, { value: {
        clusters,
        activeCluster,
        loading,
        error,
        setActiveCluster,
        refreshClusters
      }, children:
      children }, void 0, false
    ));

}

export function useCluster() {
  const context = useContext(ClusterContext);
  if (context === undefined) {
    throw new Error('useCluster must be used within a ClusterProvider');
  }
  return context;
}