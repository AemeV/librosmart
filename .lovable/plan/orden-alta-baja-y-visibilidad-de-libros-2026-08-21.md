# Orden, alta, baja y visibilidad de libros

## Qué pasa hoy

- El panel ya permite **añadir** y **borrar** libros, y tiene un campo numérico "Orden en el sitio".
- Pero el home **ignora ese orden**: `BooksSection` reordena con una lista fija de slugs escrita en el código (`sexta-extincion`, `colonizacion`, `smart-3`, ...). Cambiar el número en el panel no se ve reflejado.
- No existe forma de **ocultar** un libro sin borrarlo: la tabla no tiene un campo de visibilidad.

## Qué haremos

1. **Reordenar arrastrando (o con flechas) en el panel**
   - En la lista de libros del panel, cada fila tendrá botones subir/bajar y se guardará el nuevo orden de inmediato.
   - El orden guardado es el que manda en el home.

2. **El home respeta el orden del panel**
   - Se elimina la lista fija de slugs: los libros se muestran en el orden definido en el panel (el destacado ya no salta a la fuerza; si se quiere primero, se pone primero).

3. **Ocultar / mostrar un libro**
   - Nuevo interruptor "Visible en el sitio" en el editor del libro y un indicador ("oculto") en la lista.
   - Un libro oculto no aparece en el home, ni en el botón "NUEVO" del banner, ni en su página propia (`/libros/slug` responde "no encontrado").
   - En el panel siguen visibles y editables todos los libros, ocultos incluidos.

4. **Añadir y eliminar**
   - Se conserva "Añadir libro" y "Borrar libro", con dos mejoras: el libro nuevo se crea al final del orden automáticamente, y borrar pide confirmación (ya lo hace) recomendando ocultar en su lugar.

## Detalles técnicos

- **Migración**: `ALTER TABLE public.books ADD COLUMN published boolean NOT NULL DEFAULT true;` (sin cambios de RLS; las políticas actuales de lectura pública y escritura de admin siguen sirviendo).
- **`src/lib/site-content.ts`**: `BookRow` gana `published`; `mapBookRow` propaga `published` al tipo `Book` (`src/data/books.ts` añade `published?: boolean`, con `true` por defecto en los datos estáticos).
- **`src/lib/site-content.functions.ts`**: sigue ordenando por `position` ascendente; no filtra, el filtro se hace en la vista para que el panel y las páginas usen la misma consulta.
- **`src/components/BooksSection.tsx`**: se borra el arreglo `ORDER` y `rank`; se usa el orden que llega del servidor filtrando `published !== false`.
- **`src/components/Hero.tsx`**: el libro del botón "NUEVO" se elige entre los publicados.
- **`src/routes/_site/libros.$slug.tsx`**: si el libro no está publicado, `notFound()`.
- **`src/routes/_authenticated/admin.tsx`** (`BooksAdmin`):
  - botones ↑/↓ por fila que reescriben `position` secuencialmente (0..n) y hacen `update` de las filas afectadas, luego recargan;
  - `emptyBook()` toma `position` = número de filas actuales y `published: true`;
  - casilla "Visible en el sitio" en el editor; etiqueta "oculto" en la lista;
  - el campo numérico de orden se retira para evitar dos fuentes de verdad.
