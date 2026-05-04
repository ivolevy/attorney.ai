
-- Ensure bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('legal-assets', 'legal-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Ensure RLS policies for storage
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Public Access' AND tablename = 'objects' AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'legal-assets');
    END IF;
END
$$;

