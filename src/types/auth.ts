
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'user' | 'provider' | 'admin';

export interface AuthContextType {
  user: User | null;
  profile: any | null;
  session: Session | null;
  isAuthenticated: boolean;
  role: UserRole;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
}
