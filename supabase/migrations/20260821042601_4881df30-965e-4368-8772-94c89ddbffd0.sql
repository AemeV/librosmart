UPDATE public.books
SET key_points = (
  SELECT COALESCE(jsonb_agg(elem), '[]'::jsonb)
  FROM (
    SELECT elem FROM jsonb_array_elements(books.key_points) AS elem
    LIMIT 4
  ) kept
) || (
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'title_es', 'Próximamente',
    'title_en', 'Coming soon',
    'text_es', 'Texto provisional. Reemplázalo desde el panel de administración.',
    'text_en', 'Placeholder text. Replace it from the admin panel.'
  )), '[]'::jsonb)
  FROM generate_series(1, GREATEST(0, 4 - jsonb_array_length(books.key_points)))
)
WHERE jsonb_array_length(key_points) <> 4;