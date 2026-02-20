-- Add pdf_url column to lessons
ALTER TABLE public.lessons ADD COLUMN pdf_url text;

-- Create storage bucket for course materials
INSERT INTO storage.buckets (id, name, public) VALUES ('course-materials', 'course-materials', true);

-- Allow public read access to course-materials bucket
CREATE POLICY "Public read access for course materials"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-materials');

-- Allow admins to upload to course-materials
CREATE POLICY "Admins can upload course materials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'course-materials' AND public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete from course-materials
CREATE POLICY "Admins can delete course materials"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'course-materials' AND public.has_role(auth.uid(), 'admin'));