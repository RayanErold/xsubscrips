import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    let mounted = true;
    
    // Safety timeout: Never stay in loading state longer than 4 seconds
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        setLoading(false);
      }
    }, 4000);

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      clearTimeout(timeout);
    }).catch(() => {
      if (mounted) setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        clearTimeout(timeout);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Clear all cached queries to avoid data leakage between users
      queryClient.clear();
      // Clear localStorage persistence if any
      localStorage.removeItem("REACT_QUERY_OFFLINE_CACHE");
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
