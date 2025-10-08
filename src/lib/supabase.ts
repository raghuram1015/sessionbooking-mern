import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  is_admin?: boolean;
  created_at: string;
  updated_at: string;
};

export type Session = {
  id: string;
  host_id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  duration: number;
  max_attendees: number;
  meeting_link: string;
  cover_image_url?: string;
  created_at: string;
  updated_at: string;
  host?: Profile;
};

export type Booking = {
  id: string;
  session_id: string;
  user_id: string;
  status: 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
  session?: Session;
};
