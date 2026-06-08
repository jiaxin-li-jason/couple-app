'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  getCurrentUser,
  initUserProfile,
  createPairCode,
  joinWithCode,
  signInWithEmail,
  signInWithPassword,
  signUpWithEmail,
  signOut as authSignOut,
} from '@/lib/auth';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  userProfile: { id: string; partner_id: string | null } | null;
  loading: boolean;
  paired: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    userProfile: null,
    loading: true,
    paired: false,
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'INITIAL_SESSION' && !session) {
          setState((s) => ({ ...s, loading: false }));
          return;
        }

        if (session?.user) {
          await initUserProfile();
          const profile = await getCurrentUser();
          setState({
            user: session.user,
            userProfile: profile,
            loading: false,
            paired: !!profile?.partner_id,
          });
          return;
        }

        if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            userProfile: null,
            loading: false,
            paired: false,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string) => {
    await signInWithEmail(email);
  }, []);

  const signInPassword = useCallback(async (email: string, password: string) => {
    await signInWithPassword(email, password);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    await signUpWithEmail(email, password);
  }, []);

  const signOut = useCallback(async () => {
    await authSignOut();
  }, []);

  const generateCode = useCallback(async () => {
    return await createPairCode();
  }, []);

  const pair = useCallback(async (code: string) => {
    const ok = await joinWithCode(code);
    if (ok) {
      const profile = await getCurrentUser();
      setState((s) => ({ ...s, userProfile: profile, paired: true }));
    }
    return ok;
  }, []);

  return { ...state, signIn, signInPassword, signUp, signOut, generateCode, pair };
}
