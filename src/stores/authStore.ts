import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Mock types for demo
type User = {
  id: string;
  email?: string;
} | null;

type Session = {
  user: User;
} | null;


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
    (set) => ({
        // Initial State
        user: null,
        session: null,
        isLoading: false,
        error: null,

        
        initializeAuth: async () => {
          set({ isLoading: true });
          // Mock auth for demo - just set to not loading
          setTimeout(() => {
            set({ 
              session: null, 
              user: null,
              isLoading: false 
            });
          }, 100);
        },

        // Sign in (mock for demo)
        signIn: async (email: string, password: string) => {
          set({ isLoading: true, error: null });
          setTimeout(() => {
            set({ 
              user: { id: '1', email },
              session: { user: { id: '1', email } },
              isLoading: false 
            });
          }, 500);
          return true;
        },

        // Sign up (mock for demo)
        signUp: async (email: string, password: string, fullName: string) => {
          set({ isLoading: true, error: null });
          setTimeout(() => {
            set({ 
              user: { id: '1', email },
              session: { user: { id: '1', email } },
              isLoading: false 
            });
          }, 500);
          return true;
        },

        // Sign out (mock for demo)
        signOut: async () => {
          set({ isLoading: true });
          setTimeout(() => {
            set({ 
              user: null,
              session: null,
              isLoading: false 
            });
          }, 300);
        },

        // Reset password (mock for demo)
        resetPassword: async (email: string) => {
          set({ isLoading: true, error: null });
          setTimeout(() => {
            set({ isLoading: false });
          }, 500);
          return true;
        },

        // Update password (mock for demo)
        updatePassword: async (newPassword: string) => {
          set({ isLoading: true, error: null });
          setTimeout(() => {
            set({ isLoading: false });
          }, 500);
          return true;
        },

        clearError: () => set({ error: null }),
      }),
    { name: 'auth-store' }
  )
);
