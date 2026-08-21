create schema if not exists private;
revoke all on schema private from anon, authenticated;

create or replace function private.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;
revoke all on function private.has_role(uuid, public.app_role) from public;
grant execute on function private.has_role(uuid, public.app_role) to authenticated, service_role;
grant usage on schema private to authenticated, service_role;

-- Repointar políticas a private.has_role
drop policy if exists "books admin write" on public.books;
create policy "books admin write" on public.books for all to authenticated
  using (private.has_role(auth.uid(), 'admin')) with check (private.has_role(auth.uid(), 'admin'));

drop policy if exists "reader_photos admin write" on public.reader_photos;
create policy "reader_photos admin write" on public.reader_photos for all to authenticated
  using (private.has_role(auth.uid(), 'admin')) with check (private.has_role(auth.uid(), 'admin'));

drop policy if exists "site_images admin write" on public.site_images;
create policy "site_images admin write" on public.site_images for all to authenticated
  using (private.has_role(auth.uid(), 'admin')) with check (private.has_role(auth.uid(), 'admin'));

drop policy if exists "site_texts admin write" on public.site_texts;
create policy "site_texts admin write" on public.site_texts for all to authenticated
  using (private.has_role(auth.uid(), 'admin')) with check (private.has_role(auth.uid(), 'admin'));

drop policy if exists "admins manage roles" on public.user_roles;
create policy "admins manage roles" on public.user_roles for all to authenticated
  using (private.has_role(auth.uid(), 'admin')) with check (private.has_role(auth.uid(), 'admin'));

-- user_roles: solo el propio usuario o administradores
drop policy if exists "roles readable by authenticated" on public.user_roles;
create policy "roles readable by owner or admin" on public.user_roles for select to authenticated
  using (auth.uid() = user_id or private.has_role(auth.uid(), 'admin'));

-- profiles: solo el dueño o administradores
drop policy if exists "profiles readable by authenticated" on public.profiles;
create policy "profiles readable by owner or admin" on public.profiles for select to authenticated
  using (auth.uid() = id or private.has_role(auth.uid(), 'admin'));

-- storage media: lectura solo para administradores
drop policy if exists "media admin read" on storage.objects;
create policy "media admin read" on storage.objects for select to authenticated
  using (bucket_id = 'media' and private.has_role(auth.uid(), 'admin'));

drop policy if exists "media admin write" on storage.objects;
create policy "media admin write" on storage.objects for all to authenticated
  using (bucket_id = 'media' and private.has_role(auth.uid(), 'admin'))
  with check (bucket_id = 'media' and private.has_role(auth.uid(), 'admin'));

-- Quitar la función SECURITY DEFINER expuesta en la API pública
drop function if exists public.has_role(uuid, public.app_role);

-- Comprobación limitada al usuario actual para el panel
create or replace function public.is_admin()
returns boolean language sql stable security invoker set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin') $$;
grant execute on function public.is_admin() to authenticated;