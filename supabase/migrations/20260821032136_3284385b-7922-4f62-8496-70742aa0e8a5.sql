
-- Rol de administrador (tabla aparte, nunca en perfiles)
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "roles readable by authenticated" on public.user_roles
  for select to authenticated using (true);
create policy "admins manage roles" on public.user_roles
  for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Perfiles (para listar editores por correo)
create table public.profiles (
  id uuid primary key,
  email text,
  created_at timestamptz not null default now()
);
grant select on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles readable by authenticated" on public.profiles
  for select to authenticated using (true);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Textos del sitio (ES/EN)
create table public.site_texts (
  key text primary key,
  value_es text not null default '',
  value_en text not null default '',
  updated_at timestamptz not null default now()
);
grant select on public.site_texts to anon, authenticated;
grant insert, update, delete on public.site_texts to authenticated;
grant all on public.site_texts to service_role;
alter table public.site_texts enable row level security;
create policy "site_texts public read" on public.site_texts for select to anon, authenticated using (true);
create policy "site_texts admin write" on public.site_texts for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Imágenes sueltas del sitio (retrato del autor, etc.)
create table public.site_images (
  key text primary key,
  image_url text not null default '',
  updated_at timestamptz not null default now()
);
grant select on public.site_images to anon, authenticated;
grant insert, update, delete on public.site_images to authenticated;
grant all on public.site_images to service_role;
alter table public.site_images enable row level security;
create policy "site_images public read" on public.site_images for select to anon, authenticated using (true);
create policy "site_images admin write" on public.site_images for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Galería de lectores
create table public.reader_photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null default '',
  caption_es text not null default '',
  caption_en text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.reader_photos to anon, authenticated;
grant insert, update, delete on public.reader_photos to authenticated;
grant all on public.reader_photos to service_role;
alter table public.reader_photos enable row level security;
create policy "reader_photos public read" on public.reader_photos for select to anon, authenticated using (true);
create policy "reader_photos admin write" on public.reader_photos for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Libros
create table public.books (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null default '',
  subtitle_es text not null default '',
  subtitle_en text not null default '',
  description_es text not null default '',
  description_en text not null default '',
  year integer not null default 2026,
  featured boolean not null default false,
  position integer not null default 0,
  cover_url text not null default '',
  back_cover_url text,
  back_cover_es text not null default '',
  back_cover_en text not null default '',
  publisher text not null default '',
  release_date text not null default '',
  pages integer not null default 0,
  dimensions text not null default '',
  isbn text not null default '',
  illustrated boolean not null default true,
  key_points jsonb not null default '[]'::jsonb,
  chapters jsonb not null default '[]'::jsonb,
  retailers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.books to anon, authenticated;
grant insert, update, delete on public.books to authenticated;
grant all on public.books to service_role;
alter table public.books enable row level security;
create policy "books public read" on public.books for select to anon, authenticated using (true);
create policy "books admin write" on public.books for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger books_touch before update on public.books for each row execute function public.touch_updated_at();
create trigger site_texts_touch before update on public.site_texts for each row execute function public.touch_updated_at();
create trigger site_images_touch before update on public.site_images for each row execute function public.touch_updated_at();

-- Almacenamiento de imágenes (bucket "media" ya creado)
create policy "media admin read" on storage.objects for select to authenticated
  using (bucket_id = 'media');
create policy "media admin write" on storage.objects for all to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'))
  with check (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));

insert into public.site_texts (key, value_es, value_en) values
('brand', 'Sm@rt', 'Sm@rt'),
('navBooks', 'Libros', 'Books'),
('navAuthor', 'El autor', 'The author'),
('navReviews', 'Reseñas', 'Reviews'),
('navProjects', 'Otros proyectos', 'Other projects'),
('navContact', 'Contacto', 'Contact'),
('menu', 'Menú', 'Menu'),
('close', 'Cerrar', 'Close'),
('viewContents', 'Ver índice', 'View contents'),
('hideContents', 'Ocultar índice', 'Hide contents'),
('themeLight', 'Tema claro', 'Light theme'),
('themeDark', 'Tema oscuro', 'Dark theme'),
('themeSystem', 'Tema del sistema', 'System theme'),
('langLabel', 'Idioma de la interfaz', 'Interface language'),
('heroKicker', 'Sm@rt presenta', 'Sm@rt presents'),
('heroTitle', 'La ciencia, contada para que no se olvide', 'Science, told so it stays with you'),
('heroSubtitle', 'Los libros de David Mauricio Guerrero Vélez: biodiversidad, espacio y los descubrimientos que están redefiniendo nuestro siglo.', 'Books by David Mauricio Guerrero Vélez: biodiversity, space and the discoveries redefining our century.'),
('skyCityLabel', 'Ciudad del cielo', 'Sky city'),
('skyVisible', 'visible', 'visible'),
('heroNew', 'Nuevo', 'New'),
('heroCta', 'Explorar libros', 'Explore books'),
('heroScroll', 'Desliza', 'Scroll'),
('readersTitle', 'Muro de lectores', 'Readers wall'),
('readersSubtitle', 'Lectores con los libros, en Colombia y fuera de ella.', 'Readers with the books, in Colombia and beyond.'),
('booksTitle', 'Los libros', 'The books'),
('booksSubtitle', 'Elige tu formato, tu idioma de edición y tu librería.', 'Pick your format, your edition language and your store.'),
('featured', 'Novedad', 'New'),
('openBook', 'Abrir el libro', 'Open the book'),
('closeBook', 'Cerrar el libro', 'Close the book'),
('newBook', 'Nuevo libro', 'New book'),
('keyPoints', 'Qué vas a encontrar', 'What you''ll find'),
('viewIndex', 'Ver índice y contraportada', 'Index and back cover'),
('indexTitle', 'Índice', 'Table of contents'),
('backCoverTitle', 'Contraportada', 'Back cover'),
('buyTitle', 'Dónde comprarlo', 'Where to buy'),
('physical', 'Físico', 'Print'),
('digital', 'Digital', 'Digital'),
('editionLabel', 'Edición', 'Edition'),
('editionEs', 'Español', 'Spanish'),
('editionEn', 'Inglés', 'English'),
('soonRetailers', 'Links de compra en camino.', 'Purchase links coming soon.'),
('metaYear', 'Año', 'Year'),
('metaLangs', 'Idiomas', 'Languages'),
('metaFormats', 'Formatos', 'Formats'),
('coverAlt', 'Portada de', 'Cover of'),
('reviewsTitle', 'Lo que dicen los lectores', 'What readers say'),
('reviewsSubtitle', 'Reseñas de lectores, prensa e instituciones.', 'Reviews from readers, press and institutions.'),
('goodreadsCta', 'Perfil en Goodreads', 'Goodreads profile'),
('goodreadsBookCta', 'Leer las reseñas en Goodreads', 'Read the reviews on Goodreads'),
('goodreadsRatings', 'valoraciones', 'ratings'),
('goodreadsReviews', 'reseñas', 'reviews'),
('authorTitle', 'El autor', 'The author'),
('authorBio1', 'David Mauricio Guerrero Vélez es el autor de la colección de libros Sm@rt: Los Más Recientes e Importantes Descubrimientos Científicos. Economista, escritor, máster en Comunicación de la Ciencia y la Tecnología, fotógrafo aficionado y apasionado por la historia.', 'David Mauricio Guerrero Vélez is the author of the Sm@rt collection: The Most Recent and Important Scientific Discoveries. Economist, writer, master''s in Science and Technology Communication, amateur photographer and history enthusiast.'),
('authorBio2', 'Su principal objetivo es generar interés por la ciencia y la tecnología e inspirar a niños, jóvenes y adultos para que no pierdan el interés por el conocimiento.', 'His main goal is to spark interest in science and technology, and to inspire children, young people and adults never to lose their curiosity for knowledge.'),
('projectsTitle', 'Otros proyectos', 'Other projects'),
('projectsSubtitle', 'Charlas, contenidos y colaboraciones alrededor de los libros.', 'Talks, content and collaborations around the books.'),
('projectsEyebrow', 'Sm@rt', 'Sm@rt'),
('projectsIntro', 'Lo que ocurre alrededor de los libros: una cerveza artesanal, un podcast, expediciones de campo y talleres para colegios.', 'Everything that happens around the books: a craft beer, a podcast, field expeditions and school workshops.'),
('projectsVisit', 'Ver el proyecto', 'Visit the project'),
('backHome', 'Volver al inicio', 'Back home'),
('contactTitle', 'Contacto', 'Contact'),
('contactSubtitle', 'Prensa, ferias, charlas o pedidos al por mayor.', 'Press, book fairs, talks or wholesale orders.'),
('formName', 'Nombre', 'Name'),
('formEmail', 'Correo', 'Email'),
('formMessage', 'Mensaje', 'Message'),
('formSend', 'Enviar mensaje', 'Send message'),
('formSuccess', 'Gracias, tu mensaje quedó registrado. Te responderemos pronto.', 'Thank you, your message was recorded. We''ll reply soon.'),
('errName', 'Escribe tu nombre.', 'Please enter your name.'),
('errEmail', 'Escribe un correo válido.', 'Enter a valid email.'),
('errMessage', 'Cuéntanos algo más (mínimo 10 caracteres).', 'Tell us a bit more (10 characters minimum).'),
('rights', 'Todos los derechos reservados.', 'All rights reserved.'),
('follow', 'Redes', 'Social'),
('authorSheetOpen', 'Conoce al autor', 'Meet the author'),
('authorSheetRole', 'Economista · Escritor · Divulgador científico', 'Economist · Writer · Science communicator'),
('authorSheetDrag', 'Desliza hacia abajo para cerrar', 'Drag down to close'),
('authorPortraitAlt', 'Retrato de David Mauricio Guerrero Vélez', 'Portrait of David Mauricio Guerrero Vélez'),
('authorSheetBio1', 'Autor de la colección de libros Sm@rt: Los Más Recientes e Importantes Descubrimientos Científicos.', 'Author of the Sm@rt book collection: The Most Recent and Important Scientific Discoveries.'),
('authorSheetBio2', 'Economista, escritor, máster en Comunicación de la Ciencia y la Tecnología, fotógrafo aficionado y apasionado por la historia.', 'Economist, writer, master''s in Science and Technology Communication, amateur photographer and history enthusiast.'),
('authorSheetBio3', 'Su principal objetivo es generar interés por la ciencia y la tecnología e inspirar a niños, jóvenes y adultos para que no pierdan el interés por el conocimiento.', 'His main goal is to spark interest in science and technology, and to inspire children, young people and adults never to lose their curiosity for knowledge.'),
('authorTrackTitle', 'Trayectoria', 'Track record')
on conflict (key) do nothing;
