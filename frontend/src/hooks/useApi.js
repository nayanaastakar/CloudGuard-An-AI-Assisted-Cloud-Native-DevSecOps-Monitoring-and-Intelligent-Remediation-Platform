/**
 * useApi Hook
 * Provides consistent API call handling with loading, error, and data states.
 * Standardizes error handling and toast notifications across all components.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { apiLogger as logger } from '../utils/logger';


// =============================================================================
// TYPES
// =============================================================================















































// =============================================================================
// ERROR HANDLING
// =============================================================================

/**
 * Extract error message from various error formats
 */
export function extractErrorMessage(error) {
  if (!error) return 'An unknown error occurred';

  // Axios error with response
  if (isAxiosError(error)) {
    const axiosError = error;

    // Server responded with error
    if (axiosError.response?.data) {
      const data = axiosError.response.data;
      if (typeof data === 'string') return data;
      if (data.detail) return data.detail;
      if (data.message) return data.message;
      if (data.error) return data.error;
    }

    // Network error
    if (axiosError.code === 'ERR_NETWORK') {
      return 'Network error. Please check your connection.';
    }

    // Timeout
    if (axiosError.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.';
    }

    // HTTP status messages
    if (axiosError.response?.status) {
      const status = axiosError.response.status;
      if (status === 401) return 'Authentication required. Please log in again.';
      if (status === 403) return 'You do not have permission to perform this action.';
      if (status === 404) return 'The requested resource was not found.';
      if (status === 422) return 'Invalid request data.';
      if (status === 429) return 'Too many requests. Please try again later.';
      if (status >= 500) return 'Server error. Please try again later.';
    }

    return axiosError.message || 'An error occurred';
  }

  // Standard Error object
  if (error instanceof Error) {
    return error.message;
  }

  // String error
  if (typeof error === 'string') {
    return error;
  }

  return 'An unknown error occurred';
}

/**
 * Type guard for Axios errors
 */
function isAxiosError(error) {
  return error?.isAxiosError === true;
}

// =============================================================================
// useApi HOOK - For fetching data
// =============================================================================

/**
 * Hook for fetching data from API with consistent loading/error states
 *
 * @example
 * const { data, loading, error, execute } = useApi(
 *   () => kubernetesApi.getPods(),
 *   { showErrorToast: true }
 * );
 *
 * useEffect(() => { execute(); }, [execute]);
 */
export function useApi(
apiCall,
options = {})
{
  const {
    showErrorToast = true,
    showSuccessToast = false,
    successMessage,
    errorMessagePrefix = '',
    initialLoading: initialLoadingOption = true
  } = options;

  const toast = useToast();
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
    initialLoading: initialLoadingOption
  });

  const hasLoadedOnce = useRef(false);

  const execute = useCallback(async () => {
    const isInitial = !hasLoadedOnce.current;

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      initialLoading: isInitial && prev.initialLoading
    }));

    try {
      const response = await apiCall();
      const data = response.data;

      hasLoadedOnce.current = true;

      setState({
        data,
        loading: false,
        error: null,
        initialLoading: false
      });

      if (showSuccessToast && successMessage) {
        toast.success('Success', successMessage);
      }

      return data;
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      const fullErrorMessage = errorMessagePrefix ?
      `${errorMessagePrefix}: ${errorMessage}` :
      errorMessage;

      setState((prev) => ({
        ...prev,
        loading: false,
        error: fullErrorMessage,
        initialLoading: false
      }));

      if (showErrorToast) {
        toast.error('Error', fullErrorMessage);
      }

      logger.error('API Error', err);
      return null;
    }
  }, [apiCall, showErrorToast, showSuccessToast, successMessage, errorMessagePrefix, toast]);

  const reset = useCallback(() => {
    hasLoadedOnce.current = false;
    setState({
      data: null,
      loading: false,
      error: null,
      initialLoading: true
    });
  }, []);

  const setData = useCallback((data) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  const setError = useCallback((error) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
    setError,
    refreshing: state.loading && !state.initialLoading
  };
}

// =============================================================================
// useMutation HOOK - For creating/updating/deleting data
// =============================================================================

/**
 * Hook for mutations (POST, PUT, DELETE) with consistent handling
 *
 * @example
 * const { mutate, loading } = useMutation(
 *   (params: { id: string }) => kubernetesApi.deletePod(params.id),
 *   {
 *     showSuccessToast: true,
 *     successMessage: 'Pod deleted successfully',
 *     onSuccess: () => refetchPods(),
 *   }
 * );
 */
export function useMutation(
mutationFn,
options =


{})
{
  const {
    showErrorToast = true,
    showSuccessToast = true,
    successMessage = 'Operation completed successfully',
    errorMessagePrefix = '',
    onSuccess,
    onError
  } = options;

  const toast = useToast();
  const [state, setState] = useState(



    {
      data: null,
      loading: false,
      error: null
    });

  const mutate = useCallback(async (params) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await mutationFn(params);
      const data = response.data;

      setState({ data, loading: false, error: null });

      if (showSuccessToast) {
        toast.success('Success', successMessage);
      }

      onSuccess?.(data);
      return data;
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      const fullErrorMessage = errorMessagePrefix ?
      `${errorMessagePrefix}: ${errorMessage}` :
      errorMessage;

      setState((prev) => ({ ...prev, loading: false, error: fullErrorMessage }));

      if (showErrorToast) {
        toast.error('Error', fullErrorMessage);
      }

      onError?.(fullErrorMessage);
      logger.error('Mutation Error', err);
      return null;
    }
  }, [mutationFn, showErrorToast, showSuccessToast, successMessage, errorMessagePrefix, toast, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, mutate, reset };
}

// =============================================================================
// usePolling HOOK - For auto-refreshing data
// =============================================================================

/**
 * Hook for polling API at regular intervals
 *
 * @example
 * const { data, loading } = usePolling(
 *   () => kubernetesApi.getClusterMetrics(),
 *   30000 // 30 seconds
 * );
 */
export function usePolling(
apiCall,
intervalMs = 30000,
options = {})
{
  const { enabled = true, ...apiOptions } = options;
  const api = useApi(apiCall, apiOptions);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    // Initial fetch
    api.execute();

    // Set up polling
    intervalRef.current = setInterval(() => {
      api.execute();
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // Intentionally excluding api.execute from deps - it changes on every render
    // but we only want to restart the interval when enabled or intervalMs changes
  }, [enabled, intervalMs]); // eslint-disable-line react-hooks/exhaustive-deps

  return api;
}

// =============================================================================
// useAsyncEffect HOOK - For async operations in useEffect
// =============================================================================

/**
 * Hook for running async operations in useEffect with cleanup
 *
 * @example
 * useAsyncEffect(async (signal) => {
 *   const data = await fetchData();
 *   if (!signal.aborted) {
 *     setData(data);
 *   }
 * }, [dependency]);
 */
export function useAsyncEffect(
effect,
deps)
{
  useEffect(() => {
    const controller = new AbortController();

    effect(controller.signal).catch((err) => {
      if (err.name !== 'AbortError') {
        logger.error('Async effect error', err);
      }
    });

    return () => {
      controller.abort();
    };
    // deps is passed from caller, so we can't statically analyze it
    // This is the standard pattern for custom effect hooks with dynamic dependencies
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}

// =============================================================================
// EXPORT DEFAULT
// =============================================================================

export default useApi;