import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, signIn as apiSignIn, signUp as apiSignUp, SignInRequest, SignUpRequest, getCurrentUser } from '@/services/authApi';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: SignInRequest) => Promise<void>;
  signUp: (data: SignUpRequest) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'intgrow_auth_token';
const USER_KEY = 'intgrow_auth_user';
// Legacy keys used by intgrowApi.ts userSignIn
const LEGACY_TOKEN_KEY = 'token';
const LEGACY_USER_KEY = 'user';

// Helper to read token synchronously from localStorage
function getInitialToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY) || null;
}

function getInitialUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const storedUser = localStorage.getItem(USER_KEY) || localStorage.getItem(LEGACY_USER_KEY);
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state synchronously from localStorage to avoid flash of unauthenticated UI
  const [user, setUser] = useState<AuthUser | null>(getInitialUser);
  const [token, setToken] = useState<string | null>(getInitialToken);
  const [isLoading, setIsLoading] = useState(true);

  // Verify token and fetch latest profile on mount
  useEffect(() => {
    const storedToken = token; // Use state which was initialized synchronously

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    // Normalize to new keys for consistency
    localStorage.setItem(TOKEN_KEY, storedToken);

    // Verify token / fetch latest profile
    getCurrentUser(storedToken)
      .then((userData) => {
        setUser(userData);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      })
      .catch(() => {
        // Token expired or invalid, clear auth state
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(LEGACY_TOKEN_KEY);
        localStorage.removeItem(LEGACY_USER_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const signIn = async (credentials: SignInRequest) => {
    console.log('[Auth] Attempting sign in...');
    const response = await apiSignIn(credentials);
    console.log('[Auth] Sign in successful, setting user state...');
    
    const userData: AuthUser = {
      id: String(response.id),
      email: response.email,
      first_name: response.first_name,
      last_name: response.last_name,
      photo_url: response.photo_url,
      role: response.role,
    };

    setToken(response.token);
    setUser(userData);
    
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    console.log('[Auth] User authenticated:', userData.email);
  };

  const signUp = async (data: SignUpRequest) => {
    const response = await apiSignUp(data);
    
    const userData: AuthUser = {
      id: String(response.id),
      email: response.email,
      first_name: response.first_name,
      last_name: response.last_name,
      photo_url: response.photo_url,
    };

    setToken(response.token);
    setUser(userData);
    
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(LEGACY_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        // Token is the source of truth for auth; user data may hydrate asynchronously
        isAuthenticated: !!token,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
