UPDATE public.site_texts
SET value_es = 'Ver tabla de contenidos', value_en = 'View table of contents'
WHERE key = 'viewContents';

UPDATE public.site_texts
SET value_es = 'Ocultar tabla de contenidos', value_en = 'Hide table of contents'
WHERE key = 'hideContents';

UPDATE public.site_texts
SET value_es = 'Tabla de contenidos', value_en = 'Table of contents'
WHERE key = 'indexTitle';

UPDATE public.site_texts
SET value_es = '', value_en = ''
WHERE key = 'backCoverTitle';