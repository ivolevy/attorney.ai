-- 1. Arreglamos la tabla de suscripciones para permitir ON CONFLICT
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);

-- 2. Cargamos los datos del administrador
INSERT INTO public.profiles (id, email, full_name) 
VALUES ('c82d7e72-a432-4e1a-b7fe-198759e2001b', 'lexia@admin.com', 'Lexia Admin')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.subscriptions (user_id, status, plan) 
VALUES ('c82d7e72-a432-4e1a-b7fe-198759e2001b', 'active', 'premium')
ON CONFLICT (user_id) DO NOTHING;
