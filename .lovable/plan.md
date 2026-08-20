# Cinco correcciones: barras fijas, logo migrante, cielo centrado, planetas legibles, libros sin fondo

## A. Header y subheader imantados arriba

Hoy hay **una sola barra** (`sticky top-0`) renderizada *después* del hero. Se reconstruye en dos niveles fijos:

- Contenedor `fixed top-0 left-0 right-0 z-50`, montado en el layout `_site` (no dentro de la landing), para que exista desde el primer frame en `/` y en `/proyectos`.
- **Barra superior (siempre visible):** logo del header (destino del logo migrante), tagline, redes, idioma, tema, botón de menú en móvil. Nunca se oculta.
- **Subbarra (menú de navegación):** se oculta al bajar y reaparece al subir con `translateY` + `opacity` y spring; el estado se calcula con la dirección de scroll ya existente.
- El hero pasa a empezar en el borde superior de la ventana (sin `padding-top` compensatorio): el cielo se ve a través del cristal de las barras.
- Nueva variable `--header-height` en `styles.css` (valor por defecto y actualizado en runtime midiendo la altura real de las dos barras con `ResizeObserver`). Se usa como `scroll-margin-top` en todas las secciones con ancla y reemplaza el `scroll-padding-top: 5.5rem` fijo del `html`.

## B. Un solo logo que migra

El SVG del logo es vectorial (`LogoSmart`), así que **no hay riesgo de pixelación**: no hace falta otro archivo.

- Un único componente compartido con `layoutId="brand-logo"`: se renderiza en el hero o en el header según el progreso de scroll, y motion anima la transición de posición y tamaño.
- Tamaño en reposo: 55vw en desktop, 80vw en móvil, centrado, sin nada más sobre el cielo (se retira el indicador de scroll del hero para dejar el aire pedido).
- El encogimiento va ligado al progreso de scroll del hero (`useScroll` con `offset` sobre el hero → escala y opacidad interpoladas), no a un umbral binario; al final del recorrido el logo queda montado en el header. Spring `{ stiffness: 200, damping: 28 }`.
- Al volver arriba el recorrido se invierte de forma continua.
- Con `prefers-reduced-motion`: dos logos independientes (hero y header) con crossfade por opacidad, sin `layoutId` ni migración.

## C. Cielo con composición centrada

En `RealSky` se eliminan los bloques anclados a las esquinas (`absolute right-4 bottom-4` y `bottom-4 left-4`) y se reemplazan por una columna centrada bajo el logo, dentro del hero:

1. Chips de cristal de ciudad en fila centrada (Bogotá · Madrid · Tokio), con el indicador `layoutId` actual.
2. Debajo, un único panel de datos centrado, en una línea cuando cabe:
   `BOGOTÁ · 4.71°N 74.07°W · 21:47 · LUNA 34% CRECIENTE`
   En móvil se parte en dos líneas centradas (ciudad+coordenadas / hora+luna).

El tooltip de hover de planetas se mantiene anclado al punto del canvas (es posicional, no decorativo de esquina).

## D. Planetas legibles en el canvas

En `SkyLayer`:

- **El parpadeo se aplica solo al catálogo de estrellas.** Los planetas se dibujan con opacidad constante — es el criterio real de identificación a simple vista.
- Radio de planeta claramente mayor que una estrella de magnitud equivalente, más halo suave (degradado radial de baja opacidad) con su propio color.
- Color por planeta: Mercurio `#C9C2B8`, Venus `#FFF4D6`, Marte `#E08A5C`, Júpiter `#F2E2C0`, Saturno `#E6D9A8`.
- **Etiqueta permanente** con el nombre debajo de cada planeta sobre el horizonte: siempre en desktop; en móvil solo con altitud > 15°. Se dibuja en el canvas con la tipografía de interfaz, tamaño pequeño y uppercase, con leve sombra para legibilidad.
- Luna claramente más grande que todo lo demás, conservando el cálculo de fase real actual.
- Sol sobre el horizonte con halo amplio y luminoso.
- Línea de horizonte muy tenue dibujada en el borde del domo como referencia espacial.

## E. Bug del fondo detrás de los libros

Confirmado en `BookObject.tsx`: la cara de la tapa frontal lleva `bg-surface-alt`, `border border-line` y `box-shadow` propios, y la portada es un PNG con transparencia sobre ese relleno; además la contratapa (`inset-0`, `bg-surface-alt`) queda visible por detrás en la postura rotada. El wrapper (`<motion.button>`) también tiene `rounded-[12px]` residual del formato tarjeta.

Correcciones:

- Quitar `background`, `border` y `box-shadow` de la cara frontal: la portada se ve tal cual, respetando su transparencia.
- Wrapper del libro completamente transparente (sin fondo, borde ni sombra); se conserva solo el anillo de `focus-visible` por accesibilidad.
- Revisar la geometría de contratapa y bloque de hojas para que queden estrictamente detrás/al canto y no asomen como recuadro.
- Verificar que ningún ancestro del libro (secciones, wrappers de motion, `BookEntry`) aplique `overflow`, `filter` ni `backdrop-filter`, que aplanarían el `preserve-3d`; si alguno lo hace, se elimina o se aísla.
- Única sombra permitida: la proyectada debajo del libro sobre el fondo de la página (ya existe) — se ajusta para que quede claramente por debajo, no alrededor del rectángulo.

## Notas técnicas

- Archivos tocados: `src/routes/_site.tsx`, `src/routes/_site.index.tsx`, `src/components/Header.tsx`, `src/components/Hero.tsx`, `src/components/RealSky.tsx`, `src/components/SkyLayer.tsx`, `src/components/BookObject.tsx`, `src/components/BookEntry.tsx`, `src/styles.css`, `src/lib/motion-config.ts` (spring de migración), y los `id` de sección para el `scroll-margin-top`.
- Sin cambios de datos ni de i18n salvo etiquetas nuevas si hicieran falta para el panel del cielo.
- Verificación con navegador real: hero a pantalla completa con barras fijas encima, migración del logo al hacer scroll, planetas etiquetados y sin titilar, libro sin recuadro.
