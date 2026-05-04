-- Seed initial templates
INSERT INTO public.templates (id, title, description, category, type, fields, background_url, config)
VALUES 
(
  'telegrama-laboral', 
  'Telegrama Ley 23.789', 
  'Formulario oficial para comunicaciones laborales (+30 palabras).', 
  'Laboral', 
  'official',
  '[
    {"id": "dest_nombre", "name": "Nombre Destinatario", "placeholder": "Empresa S.A."},
    {"id": "dest_ramo", "name": "Rama", "placeholder": "Comercio"},
    {"id": "dest_domicilio", "name": "Domicilio", "placeholder": "Av. Corrientes 1234"},
    {"id": "dest_cp", "name": "Código Postal", "placeholder": "1414"},
    {"id": "dest_localidad", "name": "Localidad", "placeholder": "CABA"},
    {"id": "dest_provincia", "name": "Provincia", "placeholder": "Buenos Aires"},
    {"id": "rem_nombre", "name": "Tu Nombre", "placeholder": "Juan Pérez"},
    {"id": "rem_dni", "name": "Tu DNI", "placeholder": "12.345.678"},
    {"id": "rem_fecha", "name": "Fecha", "placeholder": "DD/MM/AAAA"},
    {"id": "rem_domicilio", "name": "Tu Domicilio", "placeholder": "Calle Falsa 123"},
    {"id": "rem_cp", "name": "Tu Código Postal", "placeholder": "1870"},
    {"id": "rem_localidad", "name": "Tu Localidad", "placeholder": "Avellaneda"},
    {"id": "rem_provincia", "name": "Tu Provincia", "placeholder": "Buenos Aires"},
    {"id": "texto", "name": "Cuerpo", "prompt": "Dictame el texto del telegrama.", "placeholder": "Por medio de la presente..."}
  ]'::jsonb,
  'https://gxjkdthevlrehjwepbam.supabase.co/storage/v1/object/public/legal-assets/tcl30web.png',
  '{
    "isOfficialForm": "TCL30",
    "richTemplate": {
      "title": "TELEGRAMA LABORAL LEY N° 23.789 (TCL +30 PALABRAS)",
      "header": "DESTINATARIO: {{dest_nombre}}\nADDR: {{dest_domicilio}}",
      "body": ["{{texto}}"],
      "footer": "REMITENTE: {{rem_nombre}}"
    }
  }'::jsonb
),
(
  'sucesiones-3003',
  'Sucesiones (3003/56)',
  'Formulario de Juicios Universales para inicio de sucesiones.',
  'Civil',
  'official',
  '[
    {"id": "causante_nombre", "name": "Nombre del Causante", "placeholder": "Juan Domingo Pérez"},
    {"id": "causante_dni", "name": "DNI del Causante", "placeholder": "12.345.678"},
    {"id": "fecha_fallecimiento", "name": "Fecha Fallecimiento", "placeholder": "DD/MM/AAAA"},
    {"id": "lugar_fallecimiento", "name": "Lugar", "placeholder": "CABA"},
    {"id": "ultimo_domicilio", "name": "Último Domicilio", "placeholder": "Calle Falsa 123"},
    {"id": "abogado_nombre", "name": "Abogado", "placeholder": "Dr. Lucas García"}
  ]'::jsonb,
  'https://gxjkdthevlrehjwepbam.supabase.co/storage/v1/object/public/legal-assets/sucesiones-3003.png',
  '{
    "isOfficialForm": "3003_SUCESIONES",
    "richTemplate": {
      "title": "FORMULARIO DECRETO-LEY 3003/56 (SUCESIONES)",
      "header": "REGISTRO DE JUICIOS UNIVERSALES",
      "body": [
          "Nombre del Causante: {{causante_nombre}}",
          "DNI: {{causante_dni}}",
          "Fallecido en: {{lugar_fallecimiento}} el día {{fecha_fallecimiento}}"
      ],
      "footer": "Presentado por: {{abogado_nombre}}"
    }
  }'::jsonb
),
(
  'inicio-comercial',
  'Inicio Demanda Comercial',
  'Formulario de inicio de causas para el fuero comercial.',
  'Comercial',
  'official',
  '[
    {"id": "actor_nombre", "name": "Actor", "placeholder": "Empresa S.A."},
    {"id": "demandado_nombre", "name": "Demandado", "placeholder": "Juan Pérez"},
    {"id": "objeto", "name": "Objeto", "placeholder": "Ejecutivo / Quiebra"},
    {"id": "monto", "name": "Monto", "placeholder": "$1.000.000"}
  ]'::jsonb,
  'https://gxjkdthevlrehjwepbam.supabase.co/storage/v1/object/public/legal-assets/inicio-comercial.png',
  '{
    "isOfficialForm": "INICIO_COMERCIAL",
    "richTemplate": {
      "title": "FORMULARIO DE INICIO - FUERO COMERCIAL",
      "header": "CÁMARA NACIONAL DE APELACIONES EN LO COMERCIAL",
      "body": [
          "Actor: {{actor_nombre}}",
          "Demandado: {{demandado_nombre}}",
          "Objeto: {{objeto}}"
      ]
    }
  }'::jsonb
)
ON CONFLICT (id) DO UPDATE SET 
  fields = EXCLUDED.fields,
  background_url = EXCLUDED.background_url,
  config = EXCLUDED.config;
