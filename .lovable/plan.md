# Ajustes: logo centrado, menú arriba, Orion y tarjetas limpias

## 1. Logo Sm@rt centrado en el banner
El logo grande deja de estar anclado con un padding superior fijo y pasa a centrarse de verdad, horizontal y verticalmente, dentro del banner. Así se ve siempre en el mismo sitio, sin importar la altura de la pantalla. El botón "Nuevo" y el indicador "Desliza" siguen abajo, dentro del círculo del planeta.

## 2. Menú flotante arriba
- Pasa de la parte inferior a la parte superior de la pantalla, justo debajo de la franja del header, y sigue fijo al scrollear.
- Los cuatro botones tienen exactamente el mismo ancho (rejilla de 4 columnas iguales).
- Opciones nuevas: **Libros · Autor · Orion · Contacto**. Se retiran "Reseñas" y "Otros proyectos" del menú; la sección de reseñas y la página de proyectos siguen existiendo, solo dejan de estar en el menú.
- Se conserva la animación de entrada escalonada al cargar el sitio.

## 3. Página Orion (próximamente)
Nueva página en `/orion` con el mismo layout del sitio: título "Orion" y un mensaje de "Muy pronto" en español e inglés, con enlace de vuelta al inicio. Lista para desarrollarse más adelante.

## 4. Tarjetas de "Qué vas a encontrar"
- Se elimina la sombra inferior dura que se ve hoy en las tarjetas de cristal oscuro; queda un halo suave y parejo.
- Se elimina el icono de check: cada tarjeta queda solo con título y párrafo.
- Siempre 4 tarjetas por libro, en rejilla (2 columnas en móvil, 4 en escritorio) en lugar del carrusel horizontal, para que todas se vean a la vez.
- Los libros que hoy tienen menos de 4 puntos reciben tarjetas de relleno con texto provisional, editables desde el panel de administración.

## Detalles técnicos
- `src/components/Hero.tsx`: el bloque del logo se centra con flex (`flex-1`, `items-center`) en vez de `pt-[8vh]`.
- `src/components/FloatingNav.tsx`: contenedor `fixed top-*` con `z` por debajo del header; `<ul>` con `grid grid-cols-4` y pills `w-full justify-center`; nueva lista de items (`navBooks`, `navAuthor`, `navOrion`, `navContact`), con "Autor" abriendo el sheet y "Orion" como `<Link to="/orion">`.
- `src/i18n/strings.ts`: nuevas claves `navOrion`, `orionTitle`, `orionSoon`, y placeholders de puntos clave.
- Nueva ruta `src/routes/_site.orion.tsx` con su propio `head()` (título, descripción, og/twitter).
- `src/styles.css`: se ajusta `box-shadow` de `glass-card-dark` (quitar el desplazamiento `-4px 14px 28px` por una sombra centrada y suave).
- `src/components/BookEntry.tsx`: se quita el import de `Check`, la lista pasa a `grid grid-cols-2 lg:grid-cols-4` y se normaliza a 4 puntos rellenando con texto provisional.
- Migración: `UPDATE books` para completar `key_points` hasta 4 elementos con textos provisionales, de modo que el panel de administración los muestre y permita editarlos.
