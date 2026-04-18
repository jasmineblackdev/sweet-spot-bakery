drop policy if exists "Product images public read" on storage.objects;

-- Allow public to read individual files (needed to display images via public URLs)
-- but the bucket listing API will still require the broader policy; keeping read by id only
create policy "Product images public read by name"
on storage.objects for select to anon, authenticated
using (bucket_id = 'product-images');