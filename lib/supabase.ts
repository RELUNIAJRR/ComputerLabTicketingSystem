import { createClient } from '@supabase/supabase-js';
import env from './env';

// Create Supabase client with validated environment variables
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey);

// Custom type for the User table
export type User = {
  id: string;
  email: string;
  created_at: string;
  role: 'admin' | 'user';
};

// Custom type for Equipment
export type Equipment = {
  id: string;
  name: string;
  type: string;
  status: 'available' | 'in-use' | 'maintenance';
  serial_number: string;
  location: string;
  last_maintenance: string;
  notes?: string;
  created_at: string;
};

// Custom type for Tickets
export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  equipment_id: string;
  created_by: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}; 