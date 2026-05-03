import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gxjkdthevlrehjwepbam.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4amtkdGhldmxyZWhqd2VwYmFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MTQ4MTEsImV4cCI6MjA5MzM5MDgxMX0.tVZBKRAlAT4uXhodSkaH8TsMzpIzyhk38Jmqmtn4Sj8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
