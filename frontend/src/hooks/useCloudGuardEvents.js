import { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';













export function useCloudGuardEvents(options = {}) {
  const { clusterId = 'default', enabled = true, onEvent } = options;
  const { token, isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();

  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const isUnmountedRef = useRef(false);

  const handleMessage = useCallback((event) => {
    try {
      const payload = JSON.parse(event.data);

      // Invalidate appropriate React Query caches based on event type
      switch (payload.type) {
        case 'runtime_threat':
          queryClient.invalidateQueries({ queryKey: ['cloudguard-runtime-threats'] });
          queryClient.invalidateQueries({ queryKey: ['cloudguard-posture'] });
          queryClient.invalidateQueries({ queryKey: ['security-dashboard'] });
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cloudguard:runtime_threat', { detail: payload }));
          }
          break;

        case 'remediation_update':
          queryClient.invalidateQueries({ queryKey: ['cloudguard-remediations'] });
          queryClient.invalidateQueries({ queryKey: ['cloudguard-posture'] });
          queryClient.invalidateQueries({ queryKey: ['cloudguard-attack-paths'] });
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cloudguard:remediation_update', { detail: payload }));
          }
          break;

        case 'posture_update':
          queryClient.invalidateQueries({ queryKey: ['cloudguard-posture'] });
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cloudguard:posture_update', { detail: payload }));
          }
          break;

        case 'k8s_event':
          queryClient.invalidateQueries({ queryKey: ['k8s-events'] });
          queryClient.invalidateQueries({ queryKey: ['cluster-overview'] });
          queryClient.invalidateQueries({ queryKey: ['workloads'] });
          queryClient.invalidateQueries({ queryKey: ['nodes'] });
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cloudguard:k8s_event', { detail: payload }));
          }
          break;

        default:
          break;
      }

      if (onEvent) {
        onEvent(payload);
      }
    } catch {

      // Ignore heartbeat/ping/pong frames
    }}, [queryClient, onEvent]);

  const connect = useCallback(() => {
    if (!enabled || !isAuthenticated || !token || isUnmountedRef.current) {
      return;
    }

    // Avoid duplicate connection if already open or connecting
    if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      // Connect without token in query parameter
      const wsUrl = `${protocol}//${host}/api/v1/ws/events?cluster_id=${encodeURIComponent(clusterId)}`;

      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        if (isUnmountedRef.current) {
          ws.close();
          return;
        }
        setError(null);
        reconnectAttemptsRef.current = 0;

        // Perform in-band authentication handshake frame
        ws.send(JSON.stringify({
          type: 'authenticate',
          token: token,
          cluster_id: clusterId
        }));
      };

      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.type === 'authenticated') {
            setConnected(true);
            return;
          }
          if (data.type === 'auth_error') {
            setError(data.error || 'Authentication failed');
            setConnected(false);
            ws.close();
            return;
          }
        } catch {

          // Pass through to general message handler
        }handleMessage(e);
      };

      ws.onerror = () => {
        setError('WebSocket encountered a network error');
      };

      ws.onclose = () => {
        setConnected(false);
        socketRef.current = null;

        // Schedule reconnection with exponential backoff if not unmounted
        if (!isUnmountedRef.current && enabled && isAuthenticated) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 15000);
          reconnectAttemptsRef.current += 1;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };
    } catch (err) {
      setError(err?.message || 'Failed to establish WebSocket connection');
    }
  }, [enabled, isAuthenticated, token, clusterId, handleMessage]);

  useEffect(() => {
    isUnmountedRef.current = false;
    connect();

    return () => {
      isUnmountedRef.current = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      setConnected(false);
    };
  }, [connect]);

  return {
    connected,
    error,
    user
  };
}