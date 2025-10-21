"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, User } from '@/app/types/auth';
import { getCookie, setCookie, deleteCookie } from '@/app/utils/cookies';

// Auth Actions
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_TOKEN'; payload: string }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_AUTH' };

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: true,
        isLoading: false 
      };
    
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    
    case 'LOGOUT':
    case 'CLEAR_AUTH':
      return {
        ...initialState,
        isLoading: false,
      };
    
    default:
      return state;
  }
}

// Context
interface AuthContextType extends AuthState {
  login: (user: User, token: string, rememberMe?: boolean) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from cookies
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = getCookie('userToken');
        const userData = getCookie('userData');

        if (token && userData) {
          const user = JSON.parse(userData) as User;
          dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({ type: 'CLEAR_AUTH' });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = (user: User, token: string, rememberMe = false) => {
    const days = rememberMe ? 7 : 1;
    
    setCookie('userToken', token, days);
    setCookie('userData', JSON.stringify(user), days);
    
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
  };

  // Logout function
  const logout = () => {
    deleteCookie('userToken');
    deleteCookie('userData');
    dispatch({ type: 'LOGOUT' });
    // Ana sayfaya yönlendir
    window.location.href = '/';
  };

  // Update user function
  const updateUser = (user: User) => {
    setCookie('userData', JSON.stringify(user), 7);
    dispatch({ type: 'SET_USER', payload: user });
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
