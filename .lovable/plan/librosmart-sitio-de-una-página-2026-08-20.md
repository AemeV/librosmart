# Librosmart — sitio de una página

Sitio bilingüe (ES/EN) de una sola página para la editorial personal de David Mauricio Guerrero Vélez, con un único objetivo: que el visitante encuentre el libro y el link de compra correcto según formato, idioma y librería.

## Dirección de arte

Cruce entre editorial científico y sistema de interfaz iOS: cristal solo en lo que flota (header, chips, botones de librería, sheets), contenido sobre superficies sólidas.

- Paleta clara: fondo salvia pálido `#E8EAE4`, superficie `#F4F5F1`, texto `#16181A`, acento lima `#D4F55A` (máximo ~5% de la superficie).
- Paleta oscura: fondo `#14171A`, superficie `#1C2023`, texto `#F0F2ED`, mismo acento.
- Tipografía: Inter Tight (títulos y UI), Geist Mono 11px uppercase para metadatos, Instrument Serif reservada al titular del hero y a los títulos de libros.
- Radios iOS: 20px contenedores, 14px tarjetas, 999px chips y botones.
- Movimiento con física (springs), estado presionado `scale 0.97` en todo lo interactivo, entradas al scroll con stagger, parallax de portadas ≤40px, sheets arrastrables, respeto total a `prefers-reduced-motion`.

## Secciones (en este orden, todo en la página `/`)

1. **Header fijo de dos niveles** — logo, toggle ES·EN (segmented control con indicador deslizante), toggle de tema claro/oscuro/sistema, redes. Subheader con el menú (Libros · El autor · Reseñas · Otros proyectos · Contacto) que se oculta al bajar y reaparece al subir. En mobile, overlay full-screen.
2. **Hero** — casi viewport completo, titular en serif, fondo aislado en `<SkyBackground />` (degradado por ahora, listo para reemplazar por el cielo en tiempo real).
3. **Muro de lectores** — marquee infinito de 8-10 fotos de gente leyendo, pausa al hover, lightbox al tocar.
4. **Libros** — el corazón: cada libro es una unidad grande, portada alternando lado en desktop y apilada en mobile, tilt 3D al cursor, metadatos, descripción, puntos clave, sheet de "Ver índice y contraportada", bloque de compra agrupado por Físico/Digital con `<RetailerButton>` tipo pill de cristal, y toggle ES/EN **local** de edición cuando el libro tiene versión en inglés.
5. **Reseñas** — datos curados en `src/data/reviews.ts`, carrusel en mobile y grid asimétrico en desktop, enlace al perfil de Goodreads (sin API, está descontinuada).
6. **El autor / Otros proyectos** — bloque breve de biografía y enlaces, sobre superficie sólida.
7. **Contacto y footer** — +57 317 404 2430, coleccionsmart@gmail.com, redes y formulario (nombre, email, mensaje) con validación y estado de éxito, sin envío real por ahora.

## Contenido y datos

- `src/data/books.ts` con los 6 libros y la estructura de tipos indicada (`Localized`, `Retailer`, `Edition`, `Chapter`, `Book`).
- Capítulos y contraportadas quedan como placeholders con comentarios `TODO:` en cada campo por completar; también los retailers cuyas URLs no tengo.
- Cero texto dentro de componentes: strings de interfaz en `src/i18n/strings.ts`.

## Dos decisiones que necesitas saber

**Portadas:** `/public/covers/` no existe todavía en el proyecto. Voy a usar la portada de *La Sexta Extinción* que subiste (servida vía CDN de Lovable) y dejar el resto como marcos de portada con el título, listos para que subas los archivos reales. El código lee las rutas desde `books.ts`, así que reemplazarlas es cambiar una línea por libro.

**Muro de lectores:** sin fotos reales todavía, uso placeholders neutros con la proporción correcta; el marquee ya queda funcional.

## Notas técnicas

- El proyecto corre sobre TanStack Start (React 19 + Vite 7 + Tailwind v4), no Vite/React pelado. Todo se implementa en la ruta `src/routes/index.tsx` con componentes en `src/components/`; el menú del subheader usa anclas internas porque es una página única.
- Instalo `motion` y uso `motion/react` para todas las animaciones.
- Tailwind v4 es CSS-first: los tokens y la clase `.glass` (con variantes por tema, fallback `@supports` y sin escribir `-webkit-backdrop-filter` a mano, que Lightning CSS lo genera) van en `src/styles.css`. El tema oscuro se activa con `data-theme="dark"` mediante `@custom-variant`.
- Script inline en el head de `__root.tsx` para aplicar `data-theme` antes de que React monte y evitar el flash.
- Fuentes por `<link>` a Google Fonts en el head del root.
- `LanguageProvider` + `useLang()` con detección por `navigator.language`, persistencia en localStorage y `<html lang>` sincronizado. El toggle global **no** filtra ediciones de libro.
- Presupuesto de rendimiento: máximo 6 superficies con `backdrop-filter` simultáneas; el resto usa color sólido con opacidad.
- Accesibilidad: targets ≥44px, HTML semántico con un solo H1, alt descriptivo en portadas, sheets con focus trap y cierre con Escape, contraste AA en ambos temas.
- Metadatos de la página (title, description, og/twitter) en el `head()` de la ruta index.
