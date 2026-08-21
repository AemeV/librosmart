# Panel de administración de Sm@rt

Un panel privado en `/admin` para que David (y otros editores) suban imágenes y editen los textos del sitio, en español e inglés, sin tocar código.

## Qué se podrá administrar

1. **Galería de lectores** — subir, reordenar y borrar fotos, con pie de foto ES/EN.
2. **Libros** — por cada libro: portada, contraportada, título, subtítulo, descripción, puntos clave e índice (todo ES/EN), más datos de ficha (año, páginas, ISBN) y enlaces de compra.
3. **El autor** — foto de perfil, biografía y trayectoria (ES/EN).
4. **Textos generales del sitio** — pastilla del hero, encabezados de sección, contacto y pie de página (ES/EN).

Cada pantalla muestra el valor actual, permite editar y guardar; el sitio público refleja el cambio de inmediato.

## Acceso

- Se activa Lovable Cloud (base de datos, almacenamiento de imágenes y usuarios).
- Login con correo y contraseña en `/auth`. `/admin` queda protegido: quien no tenga sesión de administrador es redirigido.
- Roles en tabla aparte (`user_roles`), así puedes invitar más editores luego desde el propio panel (pestaña "Editores": ver lista, dar y quitar rol de admin).
- Tú creas la primera cuenta al registrarte; te indico el paso para marcarla como administradora.

## Cómo se ve el panel

```text
/admin
 ├── Lectores    galería en cuadrícula, arrastrar para reordenar, subir/borrar
 ├── Libros      lista → editor de un libro (portada, contraportada, textos ES/EN)
 ├── Autor       foto + bio + trayectoria
 ├── Textos      campos del sitio agrupados por sección
 └── Editores    invitar / revocar administradores
```

Estética del sitio: cristal `.glass`, tipografías y morados actuales. Formularios simples, con pestañas ES/EN por campo y aviso de guardado.

## Detalles técnicos

- **Backend:** Lovable Cloud. Tablas `reader_photos`, `books`, `book_covers`, `author_profile`, `site_texts`, `user_roles`; textos bilingües como columnas `*_es` / `*_en`. Lectura pública (`anon` SELECT) y escritura solo para `has_role(auth.uid(), 'admin')`, con GRANTs explícitos.
- **Imágenes:** bucket público de storage (`media`), subida desde el panel con validación de tipo y tamaño; se guarda la URL en la fila correspondiente.
- **Lectura en el sitio:** server functions públicas + TanStack Query en los loaders; los archivos actuales de `src/data/*` pasan a ser el respaldo (seed) inicial en la migración, para que el sitio arranque con el contenido que ya tiene.
- **Escritura:** server functions con `requireSupabaseAuth` y validación Zod; el rol se verifica en el servidor, nunca en el cliente.
- **Rutas:** `src/routes/_authenticated/admin.*` bajo el gate de sesión; `/auth` para login.
- **i18n:** `LanguageContext` sigue igual; los textos ahora vienen de la base con fallback a `src/i18n/strings.ts` si un campo está vacío.

## Orden de trabajo

1. Activar Cloud y crear esquema + políticas + seed con el contenido actual.
2. Login y protección de `/admin`.
3. Panel: Lectores → Libros → Autor → Textos → Editores.
4. Conectar el sitio público a los datos de la base.
5. Verificar en el navegador subida de imagen, edición de texto y visibilidad pública.
