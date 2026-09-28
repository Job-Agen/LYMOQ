import { useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthResponseDto } from '@po/shared';
import { setAccessToken, setUnauthorizedHandler } from '@/api/client';
import { keys } from '@/api/queries';
import { tokenStorage } from './token-storage';

interface AuthState {
  ready: boolean;
  signedIn: boolean;
  signIn: (auth: AuthResponseDto) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  const signOut = useCallback(async () => {
    setAccessToken(null);
    setSignedIn(false);
    queryClient.clear();
    await tokenStorage.clear();
  }, [queryClient]);

  const signIn = useCallback(
    async (auth: AuthResponseDto) => {
      setAccessToken(auth.accessToken);
      queryClient.setQueryData(keys.me, auth.user);
      await tokenStorage.set(auth.accessToken);
      setSignedIn(true);
    },
    [queryClient],
  );

  useEffect(() => {
    setUnauthorizedHandler(() => void signOut());
    tokenStorage
      .get()
      .then((token) => {
        setAccessToken(token);
        setSignedIn(Boolean(token));
      })
      .finally(() => setReady(true));
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  const value = useMemo(() => ({ ready, signedIn, signIn, signOut }), [ready, signedIn, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
