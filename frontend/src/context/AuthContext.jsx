import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axiosClient';

// initial shape: {user, accessToken, login, logout}
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    // set axios interceptor to attach token
    const reqInterceptor = api.interceptors.request.use(config => {
      if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    });

    const resInterceptor = api.interceptors.response.use(
      res => res,
      async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          // call refresh token endpoint (cookie will be sent automatically)
          try {
            const r = await api.post('/auth/refresh_token');
            setAccessToken(r.data.accessToken);
            // retry original request
            originalRequest.headers.Authorization = `Bearer ${r.data.accessToken}`;
            return api(originalRequest);
          } catch (e) {
            // refresh failed -> logout
            logout();
            return Promise.reject(e);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, [accessToken]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, setAccessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
