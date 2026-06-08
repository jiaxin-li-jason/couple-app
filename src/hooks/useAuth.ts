'use client';
import { useState, useEffect, useCallback } from 'react';
import { initUser, getCurrentUser, createPairCode, joinWithCode } from '@/lib/auth';

interface AuthState {
  userId: string | null;
  partnerId: string | null;
  loading: boolean;
  paired: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    userId: null, partnerId: null, loading: true, paired: false,
  });

  useEffect(() => {
    initUser().then((user) => {
      setState({
        userId: user.id,
        partnerId: (user as any).partner_id || null,
        loading: false,
        paired: !!(user as any).partner_id,
      });
    });
  }, []);

  const generateCode = useCallback(async () => {
    const code = await createPairCode();
    return code;
  }, []);

  const pair = useCallback(async (code: string) => {
    const ok = await joinWithCode(code);
    if (ok) setState(s => ({ ...s, paired: true }));
    return ok;
  }, []);

  return { ...state, generateCode, pair };
}
