import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pgsdgbhjqdbrznudoixk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnc2RnYmhqcWRicnpudWRvaXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MTc4ODQsImV4cCI6MjA4NTA5Mzg4NH0.SBJa3IqZNSzb8YEhtMOOMkwbNT73xSk0Nc8ybmRUnK8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
