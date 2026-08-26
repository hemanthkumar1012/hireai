import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, firstName: string, lastName: string, role: 'JOB_SEEKER' | 'RECRUITER' | 'ADMIN') => Promise<User>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    token: localStorage.getItem('applyright_token'),
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('applyright_token');
      if (token) {
        try {
          const user = await authApi.getMe();
          setState({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Auth initialization failed, token might be expired.", error);
          localStorage.removeItem('applyright_token');
          localStorage.removeItem('applyright_refresh_token');
          setState({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const data = await authApi.login({ email, password });
      localStorage.setItem('applyright_token', data.access_token);
      localStorage.setItem('applyright_refresh_token', data.refresh_token);
      setState({
        token: data.access_token,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return data.user;
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string, role: 'JOB_SEEKER' | 'RECRUITER' | 'ADMIN') => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const data = await authApi.register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        role
      });
      localStorage.setItem('applyright_token', data.access_token);
      localStorage.setItem('applyright_refresh_token', data.refresh_token);
      setState({
        token: data.access_token,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return data.user;
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.warn("Logout request to backend failed or token was already invalid.", error);
    } finally {
      localStorage.removeItem('applyright_token');
      localStorage.removeItem('applyright_refresh_token');
      setState({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout, isLoading: state.isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
