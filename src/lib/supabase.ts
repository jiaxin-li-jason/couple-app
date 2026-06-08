import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

export type Database = {
  users: {
    id: string;
    nickname: string;
    avatar_url: string | null;
    partner_id: string | null;
    pair_code: string | null;
    device_id: string | null;
    created_at: string;
  };
  anniversaries: {
    id: string;
    title: string;
    date: string;
    type: string;
    created_by: string;
    created_at: string;
  };
  photos: {
    id: string;
    image_url: string;
    caption: string;
    uploaded_by: string;
    month_tag: string;
    created_at: string;
  };
  comments: {
    id: string;
    photo_id: string;
    user_id: string;
    text: string;
    created_at: string;
  };
  likes: {
    id: string;
    photo_id: string;
    user_id: string;
    created_at: string;
  };
  messages: {
    id: string;
    sender_id: string;
    type: 'text' | 'image' | 'voice';
    content: string;
    read: boolean;
    created_at: string;
  };
  daily_questions: {
    id: string;
    question: string;
    date: string;
    created_at: string;
  };
  answers: {
    id: string;
    question_id: string;
    user_id: string;
    answer: string;
    created_at: string;
  };
  challenges: {
    id: string;
    title: string;
    description: string;
    total_days: number;
    created_by: string;
    active: boolean;
    created_at: string;
  };
  checkins: {
    id: string;
    challenge_id: string;
    user_id: string;
    checkin_date: string;
    note: string;
  };
  quiz_questions: {
    id: string;
    created_by: string;
    question: string;
    options: string[];
    correct_index: number;
    answered: boolean;
    created_at: string;
  };
  scores: {
    id: string;
    user_id: string;
    score: number;
  };
};
