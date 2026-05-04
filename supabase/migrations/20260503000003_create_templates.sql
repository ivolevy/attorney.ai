
-- Tabla de Plantillas Legales
CREATE TABLE IF NOT EXISTS public.templates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  type TEXT DEFAULT 'generic', -- 'generic' o 'official'
  fields JSONB, -- Definición de los inputs
  background_url TEXT, -- Link a Supabase Storage
  config JSONB, -- Coordenadas de impresión y lógica extra
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Habilitar RLS
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Templates are viewable by everyone" ON public.templates FOR SELECT USING (true);

-- Crear Bucket de Storage (via SQL)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('legal-assets', 'legal-assets', true)
ON CONFLICT (id) DO NOTHING;

