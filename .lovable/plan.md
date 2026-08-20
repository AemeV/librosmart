# Bloques 1–4: escala tipográfica, correcciones estructurales, datos y cielo

Los bloques 6–8 no llegaron en el mensaje (se cortó a mitad del bloque 5, sin los SVGs de librerías). Este plan cubre 1–4; el 5 y los siguientes entran cuando reenvíes ese contenido.

## Bloque 1 — Escala tipográfica cerrada

En `src/styles.css`, definir seis utilidades (`@utility`) como única fuente de tamaño/peso/familia:

- `.display-xl` — Instrument Serif 400, 36px mobile / 64px desktop, tracking -0.03em
- `.display-m` — Instrument Serif 400, 28px / 40px, tracking -0.02em
- `.body-lead` — Inter Tight 400, 18px / 20px, cursiva, line-height 1.5
- `.body` — Inter Tight 400, 16px / 17px, line-height 1.65
- `.body-s` — Inter Tight 400, 14px / 15px, color muted
- `.label` — Inter Tight 500, 10px, uppercase, tracking 0.12em, muted (ya existe; se conserva)

Retirar las utilidades sueltas `display` y `meta` (alias histórico) una vez migrados sus usos, y aplicar la escala retroactivamente eliminando todo `text-*`, `font-*` y `text-[clamp(...)]` de los componentes: `SectionHeading`, `BookEntry`, `BookObject`, `BooksSection`, `ReviewsSection`, `ContactSection` + `Footer`, `AuthorSection`, `AuthorSheet`, `Sheet`, `Header`, `RealSky`, `ReaderWall`, `RetailerButton`, ruta `/proyectos`.

Reglas de uso: un solo `.display-xl` por página (título del libro destacado en `/`, título de la página en `/proyectos`); todos los títulos de sección con `.display-m` al mismo tamaño; un solo `.body-lead` por página.

## Bloque 2 — Correcciones estructurales

**A. Header imantado.** Ya está: dos barras `fixed top-0 z-50`, la superior siempre visible, el subheader oculto al bajar, y `--header-height` medida en runtime con `scroll-padding-top` / `[id] { scroll-margin-top }`. Solo se revisa que la altura se recalcule al cambiar de idioma y en móvil.

**B. Logo único que migra.** Ya está mediante `LogoMigrationContext` + `MigratingLogo` (interpola posición y ancho ligado al progreso de scroll, spring 200/28, crossfade de color, desactivado con `prefers-reduced-motion`). Se ajusta el hueco del hero a 80vw mobile / 55vw desktop exactos y se verifica en navegador que no haya dos logos visibles a la vez.

**C. Fondo detrás de los libros.** Causa confirmada: `BookObject` mantiene `bg-surface-alt` en el wrapper (línea 53) y en la cara frontal (línea 81), más `border border-line` en varias caras. Correcciones:

- Wrapper del objeto: totalmente transparente (sin background, border ni box-shadow).
- Cara frontal: sin relleno de superficie; se respeta la transparencia del PNG. El fallback "portada pendiente" mantiene su propio fondo solo cuando no hay imagen.
- Quitar los `border border-line` que dibujan un recuadro alrededor del rectángulo de la portada; el bloque de hojas y la contratapa conservan su papel crema porque son caras físicas del objeto, no fondo.
- Revisar ancestros (`BookEntry`, `BooksSection`) por `overflow`, `filter` o `backdrop-filter` que aplanen `preserve-3d`, y reposicionar contratapa/bloque de hojas si asoman por detrás de la tapa.
- Única sombra: la proyectada debajo del libro sobre el fondo de página.

## Bloque 3 — Modelo de datos

En `src/data/books.ts`:

- Añadir `type BookSpecs = { publisher; releaseDate; pages; dimensions; isbn; illustrated; ageRange? }` y un campo `specs` en cada `Edition` (no en `Book`), rellenando con placeholders comentados `// TODO`. `pages` pasa a vivir dentro de `specs` y el cálculo de grosor del libro lee de ahí.
- Cambiar `keyPoints: Localized[]` por `keyPoints: { title: Localized; text: Localized }[]`, partiendo el contenido actual en título corto + texto, máximo 4 por libro. Actualizar `BookEntry` para renderizar título (`.body`, peso normal) y texto (`.body-s`). Si algún libro supera 4 puntos, se recortan a los 4 más fuertes y te digo cuáles.

## Bloque 4 — El cielo

**A. Composición centrada.** Ya está: logo, chips de ciudad y panel de datos en el eje central, con `.label` y salto a dos líneas en móvil. Solo se revisa que el panel quepa en una línea en desktop.

**B. Legibilidad de planetas.** Ya está en `SkyLayer`: parpadeo exclusivo de estrellas, planetas con luz fija, mayor radio, halo radial, colores propios (Mercurio/Venus/Marte/Júpiter/Saturno), etiqueta permanente (móvil solo >15°), Luna grande con fase real, Sol con halo amplio y línea de horizonte tenue. Se verifica visualmente con captura del hero en desktop y móvil.

## Verificación

Typecheck, y recorrido con navegador real de `/` y `/proyectos`: un solo logo en pantalla, anclas que no quedan bajo el header, libro sin recuadro, y captura del hero para confirmar planetas etiquetados. Al final te confirmo punto por punto qué quedó hecho y qué no.
