'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
}

/**
 * Hook to get current authentication state
 */
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isEmailVerified: user?.email_confirmed_at != null,
  };
}

/**
 * Hook to check if current user is an operator
 */
export function useIsOperator(): { isOperator: boolean; isLoading: boolean } {
  const { user, isLoading: authLoading } = useAuth();
  const [isOperator, setIsOperator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkOperator = async () => {
      if (!user) {
        setIsOperator(false);
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from('operators')
        .select('role')
        .eq('user_id', user.id)
        .single();

      setIsOperator(!!data);
      setIsLoading(false);
    };

    if (!authLoading) {
      checkOperator();
    }
  }, [user, authLoading, supabase]);

  return { isOperator, isLoading: authLoading || isLoading };
}
