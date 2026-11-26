import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { kubernetesApi } from '../services/api';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";










const NamespaceContext = /*#__PURE__*/createContext(undefined);

export function NamespaceProvider({ children }) {
  const [namespaces, setNamespaces] = useState([]);
  const [selectedNamespace, setSelectedNamespaceState] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNamespaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await kubernetesApi.getNamespaces();
      const nsNames = response.data.map((ns) => ns.name);
      setNamespaces(nsNames);
    } catch (err) {
      console.error('Failed to fetch namespaces:', err);
      setError('Failed to load namespaces');
      // Fallback to basic namespaces
      setNamespaces(['default', 'kube-system']);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNamespaces();
  }, [fetchNamespaces]);

  const setSelectedNamespace = useCallback((namespace) => {
    setSelectedNamespaceState(namespace);
  }, []);

  const refreshNamespaces = useCallback(async () => {
    await fetchNamespaces();
  }, [fetchNamespaces]);

  return (/*#__PURE__*/
    _jsxDEV(NamespaceContext.Provider, { value: {
        namespaces,
        selectedNamespace,
        loading,
        error,
        setSelectedNamespace,
        refreshNamespaces
      }, children:
      children }, void 0, false
    ));

}

export function useNamespace() {
  const context = useContext(NamespaceContext);
  if (context === undefined) {
    throw new Error('useNamespace must be used within a NamespaceProvider');
  }
  return context;
}