import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';


// Types
interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, fullName: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
}

// Zustand Store
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        // Initial State
        user: null,
        session: null,
        isLoading: false,
        error: null,

        
        initializeAuth: async () => {
          set({ isLoading: true });
          try {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) throw error;

            set({ 
              session, 
              user: session?.user || null,
              isLoading: false 
            });

            // Set up auth state listener
            supabase.auth.onAuthStateChange((_event, session) => {
              set({ 
                session, 
                user: session?.user || null 
              });
            });
          } catch (error: any) {
            set({ 
              error: error.message, 
              isLoading: false 
            });
          }
        },

        // Sign in
        signIn: async (email: string, password: string) => {
          set({ isLoading: true, error: null });
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (error) throw error;

            set({ 
              user: data.user,
              session: data.session,
              isLoading: false 
            });
            
            return true;
          } catch (error: any) {
            set({ 
              error: error.message, 
              isLoading: false 
            });
            return false;
          }
        },

        // Sign up
        signUp: async (email: string, password: string, fullName: string) => {
          set({ isLoading: true, error: null });
          try {
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  full_name: fullName,
                },
              },
            });

            if (error) throw error;

            set({ 
              user: data.user,
              session: data.session,
              isLoading: false 
            });
            
            return true;
          } catch (error: any) {
            set({ 
              error: error.message, 
              isLoading: false 
            });
            return false;
          }
        },

        // Sign out
        signOut: async () => {
          set({ isLoading: true });
          try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            set({ 
              user: null,
              session: null,
              isLoading: false 
            });
          } catch (error: any) {
            set({ 
              error: error.message, 
              isLoading: false 
            });
          }
        },

        // Reset password
        resetPassword: async (email: string) => {
          set({ isLoading: true, error: null });
          try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (error) throw error;

            set({ isLoading: false });
            return true;
          } catch (error: any) {
            set({ 
              error: error.message, 
              isLoading: false 
            });
            return false;
          }
        },

        // Update password
        updatePassword: async (newPassword: string) => {
          set({ isLoading: true, error: null });
          try {
            const { error } = await supabase.auth.updateUser({
              password: newPassword,
            });

            if (error) throw error;

            set({ isLoading: false });
            return true;
          } catch (error: any) {
            set({ 
              error: error.message, 
              isLoading: false 
            });
            return false;
          }
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          // Don't persist sensitive data
          user: null,
          session: null,
        }),
      }
    )
  )
);
