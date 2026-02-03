"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupabaseClient, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Define the shape of the context value
interface AuthContextType {
  supabase: SupabaseClient;
  session: Session | null;
}

// Create the context with a default value of null
const AuthContext = createContext<AuthContextType | null>(null);

// Create the provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Set up a listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // Cleanup the subscription on component unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    supabase,
    session,
  };

  // Render children only after the initial session has been fetched
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Create a custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
