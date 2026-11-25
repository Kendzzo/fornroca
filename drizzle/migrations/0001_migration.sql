create policy "Worker reads own folder" on storage.objects for select to authenticated
  using (bucket_id = 'worker-files' and (storage.foldername(name))[1] = public.current_worker_id()::text);
create policy "Worker uploads own folder" on storage.objects for insert to authenticated
  with check (bucket_id = 'worker-files' and (storage.foldername(name))[1] = public.current_worker_id()::text);
create policy "Admin all worker files" on storage.objects for all to authenticated
  using (bucket_id = 'worker-files' and public.has_role(auth.uid(), 'admin'))
  with check (bucket_id = 'worker-files' and public.has_role(auth.uid(), 'admin'));