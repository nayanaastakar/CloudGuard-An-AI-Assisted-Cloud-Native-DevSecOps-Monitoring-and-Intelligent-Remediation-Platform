import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { authApi } from '../services/api';
import api from '../services/api';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";















const AuthContext = /*#__PURE__*/createContext(undefined);

const TOKEN_KEY = 'cloudguard_token';
const LEGACY_TOKEN_KEY = 'CloudGuard_token';
const REFRESH_TOKEN_KEY = 'cloudguard_refresh_token';
const LEGACY_REFRESH_TOKEN_KEY = 'CloudGuard_refresh_token';
const USER_KEY = 'cloudguard_user';
const LEGACY_USER_KEY = 'CloudGuard_user';
const TOKEN_EXPIRY_KEY = 'cloudguard_token_expiry';
const LEGACY_TOKEN_EXPIRY_KEY = 'CloudGuard_token_expiry';

const ROLE_HIERARCHY = {
  viewer: 1,
  operator: 2,
  developer: 3,
  admin: 4
};

// Refresh token 1 minute before expiry
const REFRESH_BUFFER_MS = 60 * 1000;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY) || localStorage.getItem(LEGACY_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);
  });
  const [refreshToken, setRefreshToken] = useState(() => {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || localStorage.getItem(LEGACY_REFRESH_TOKEN_KEY);
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshTimerRef = useRef(null);
  const isRefreshingRef = useRef(false);
  const justLoggedInRef = useRef(false);

  // Clear auth state
  const clearAuthState = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LEGACY_USER_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    localStorage.removeItem(LEGACY_TOKEN_EXPIRY_KEY);
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  // Refresh the access token
  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken || isRefreshingRef.current) return null;

    isRefreshingRef.current = true;
    try {
      const response = await authApi.refreshToken(refreshToken);
      const { access_token, expires_in } = response.data;

      // Store new access token
      localStorage.setItem(TOKEN_KEY, access_token);
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('token', access_token);
      const expiryTime = Date.now() + expires_in * 1000;
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());

      setToken(access_token);
      return access_token;
    } catch (err) {
      console.error('Token refresh failed:', err);
      clearAuthState();
      return null;
    } finally {
      isRefreshingRef.current = false;
    }
  }, [refreshToken, clearAuthState]);

  // Schedule token refresh
  const scheduleTokenRefresh = useCallback((expiresIn) => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    // Refresh before expiry
    const refreshTime = expiresIn * 1000 - REFRESH_BUFFER_MS;
    if (refreshTime > 0) {
      refreshTimerRef.current = setTimeout(() => {
        refreshAccessToken();
      }, refreshTime);
    }
  }, [refreshAccessToken]);

  // Response interceptor for handling 401 errors - set up once
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retrying, try to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
          if (storedRefreshToken && !isRefreshingRef.current) {
            try {
              const newToken = await refreshAccessToken();
              if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
              }
            } catch (refreshError) {
              clearAuthState();
              return Promise.reject(refreshError);
            }
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [refreshAccessToken, clearAuthState]);

  // Verify token on mount and set up refresh timer
  useEffect(() => {
    async function verifyToken() {
      // Skip verification if we just logged in (we already have user data)
      if (justLoggedInRef.current) {
        justLoggedInRef.current = false;
        setLoading(false);
        return;
      }

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authApi.getCurrentUser();
        setUser(response.data);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data));

        // Check if we need to schedule a refresh
        const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
        if (expiryTime) {
          const timeUntilExpiry = parseInt(expiryTime) - Date.now();
          if (timeUntilExpiry > REFRESH_BUFFER_MS) {
            scheduleTokenRefresh(timeUntilExpiry / 1000);
          } else if (refreshToken) {
            // Token is about to expire, refresh now
            refreshAccessToken();
          }
        }
      } catch (err) {
        // Token is invalid, try to refresh
        if (refreshToken) {
          const newToken = await refreshAccessToken();
          if (!newToken) {
            clearAuthState();
          }
        } else {
          clearAuthState();
        }
      } finally {
        setLoading(false);
      }
    }

    verifyToken();
  }, [token, refreshToken, scheduleTokenRefresh, refreshAccessToken, clearAuthState]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  const login = useCallback(async (username, password) => {
    setError(null);
    setLoading(true);

    try {
      const response = await authApi.login(username, password);
      const { access_token, refresh_token, expires_in, user: userData } = response.data;

      // Store tokens and user data
      localStorage.setItem(TOKEN_KEY, access_token);
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('token', access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));

      const expiryTime = Date.now() + expires_in * 1000;
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());

      // Mark that we just logged in to skip verifyToken in useEffect
      justLoggedInRef.current = true;

      setToken(access_token);
      setRefreshToken(refresh_token);
      setUser(userData);

      // Schedule token refresh
      scheduleTokenRefresh(expires_in);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [scheduleTokenRefresh]);

  const logout = useCallback(async () => {
    try {
      // Call backend logout to invalidate tokens
      if (token) {
        await authApi.logout(refreshToken || undefined);
      }
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      clearAuthState();
    }
  }, [token, refreshToken, clearAuthState]);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      await authApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password change failed';
      throw new Error(errorMessage);
    }
  }, []);

  const hasPermission = useCallback((_permission) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    // Add more permission checks based on role
    return false;
  }, [user]);

  const hasRole = useCallback((minRole) => {
    if (!user) return false;
    const userLevel = ROLE_HIERARCHY[user.role];
    const requiredLevel = ROLE_HIERARCHY[minRole];
    return userLevel >= requiredLevel;
  }, [user]);

  return (/*#__PURE__*/
    _jsxDEV(AuthContext.Provider, { value: {
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        error,
        login,
        logout,
        changePassword,
        hasPermission,
        hasRole
      }, children:
      children }, void 0, false
    ));

}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}