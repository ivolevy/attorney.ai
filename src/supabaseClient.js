import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
