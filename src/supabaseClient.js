import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gxjkdthevlrehjwepbam.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4amtkdGhldmxyZWhqd2VwYmFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MTQ4MTEsImV4cCI6MjA5MzM5MDgxMX0.tVZBKRAlAT4uXhodSkaH8TsMzpIzyhk38Jmqmtn4Sj8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Saves a legal document to the user's history
 */
export const saveDocument = async (userId, title, content, templateId = null) => {
  const { data, error } = await supabase
    .from('documents')
    .insert([
      { 
        user_id: userId, 
        title, 
        content, 
        template_id: templateId 
      }
    ])
    .select();

  if (error) {
    console.error('Error saving document:', error);
    throw error;
  }
  return data[0];
};

/**
 * Fetches all active legal templates from the database
 */
export const getTemplates = async () => {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('is_active', true)
    .order('category', { ascending: true });

  if (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
  return data;
};
