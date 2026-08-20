# Paleta morada, logo metalizado, cielo navegable y libro sin fondo

## Diagnóstico del fondo gris del libro (bloque 4) — confirmado antes de tocar nada

Son **dos causas encadenadas, la 1 y la 3** de tu lista:

1. **Las imágenes no existen.** `public/` sólo contiene `favicon.svg` y `robots.txt`. No hay carpeta `public/covers/`. Cinco de los seis libros tienen `coverUrl: "/covers/…jpg"` (marcados con TODO en `src/data/books.ts`), así que `BookObject` entra por la rama `isPlaceholder` y dibuja a propósito un bloque con `bg-surface-alt` y la etiqueta "PORTADA PENDIENTE": ese es el rectángulo gris grande.
2. **Clases de superficie en las caras del objeto 3D.** La contratapa y el lomo llevan `bg-surface-alt`, y la única portada real (Sexta Extinción, PNG con transparencia) se dibuja con `object-contain`, así que por los márgenes de la imagen se ve la contratapa gris justo detrás. No es `preserve-3d` ni `backface-visibility`, que están correctos.

No es un skeleton, ni clases shadcn heredadas, ni un ancestro con overflow/filter.

**Corrección:** el objeto 3D pasa a fondo transparente (contratapa y lomo pintados con el color del papel/tapa del libro, no con tokens de superficie de UI) y el placeholder deja de ser un bloque gris: pasa a ser una tapa dibujada con el color de marca (Midnight Purple sólido en oscuro / Seashell en claro) con el título en serif, sin recuadro ni borde alrededor. La única sombra que queda es la proyectada en el suelo.

## Bloque 1 — Paleta de marca morada

- `src/styles.css`: reemplazo la escala de grises por los tokens que diste (oscuro canónico y claro), añadiendo `--accent` y `--action` al mapa `@theme inline` para tener `bg-action`, `text-accent`, etc.
- Repaso header, subheader, libros, reseñas, autor, contacto, footer, proyectos y el sheet del autor: superficies casi neutras (Midnight Purple / Seashell), morado sólo en enlaces, estados activos, indicadores de selección y foco.
- Sin degradados decorativos, sin glow ni sombras moradas. Hover y estados activos con Lavender Indigo, nunca como fondo grande.
- **Banda "dónde comprarlo":** pasa a `#4E2BCC` sólido a todo el ancho, texto y logos en `#EFEFEF`, igual en ambos temas (hoy es una tarjeta de cristal centrada).
- El cielo del hero conserva sus colores reales, como siempre.

## Bloque 2 — Logo metalizado

El logo **es SVG** (`src/components/LogoSmart.tsx`, trazos vectoriales), así que el enmascarado es directo: no necesito que me mandes nada.

- El logo del header crece ×1.8; en el hero se mantiene al 55 % del viewport.
- Dentro del SVG defino un `<linearGradient>` (#EFEFEF → #905BF4 → #4E2BCC → #EFEFEF, con paradas apretadas al centro) y una `<mask>` con los propios trazos, de modo que el degradado sólo pinta el logo.
- El ángulo del degradado lo controla un `useMotionValue` suavizado con `useSpring {120, 20}`: en desktop se mapea con `useTransform` la posición horizontal del cursor sobre el header a −25°…+25°; en mobile, el progreso de scroll de la página.
- Brillo especular: banda blanca estrecha de baja opacidad que recorre el logo en bucle de ~4 s, enmascarada al mismo trazo.
- Con `prefers-reduced-motion`: ángulo fijo agradable, sin reacción ni recorrido.

## Bloque 3 — Cielo navegable

- **Proyección panorámica** en `SkyLayer`: X = azimut 0–360°, Y = altitud horizonte→cenit, sustituyendo la proyección de domo.
- Arrastre horizontal con envolvente continua en 360° (sin salto), inercia con desaceleración al soltar, mouse y táctil. El gesto compara desplazamiento X vs Y: si predomina el vertical, se libera para que la página siga haciendo scroll.
- Al cargar, la vista se centra en el azimut con más planetas visibles.
- Brújula discreta abajo (N · NE · E · SE · S · SO · O · NO) en `.label`, y línea de horizonte visible.
- **Planetas:** radio ≥ 4× la estrella más brillante, halo suave, sin titileo (sólo titilan las estrellas), colores dados (Mercurio, Venus, Marte, Júpiter, Saturno), nombre siempre debajo en `.label`, anillo sutil al pasar el cursor.
- **Planetas clicables:** foco por teclado con `role="button"` y `aria-label` descriptivo; al activar se abre una tarjeta de cristal anclada junto al cuerpo en desktop, o un sheet desde abajo en mobile. Contiene nombre en `.display-m`, altitud, azimut y distancia a la Tierra en millones de km calculados en vivo con astronomy-engine, tres o cuatro datos característicos del nuevo `src/data/bodies.ts` (bilingüe, con TODO en los valores que no pueda verificar), el blurb y un botón "Leer más" en Purple Heart.
- Cierre con X, Escape, clic fuera y arrastre hacia abajo en mobile.
- `src/data/bodies.ts` con el tipo `BodyInfo` que definiste; mapeo inicial de Marte, Venus, Júpiter, Saturno, Mercurio y Luna a `colonizacion`, campo editable.
- El botón necesita destino: creo la ruta **`/libros/$slug`** (hoy no existe) como página de libro reutilizando `BookObject`, ficha técnica y banda de compra, con `head()` propio por libro.

## Notas técnicas

- Nuevos/tocados: `src/styles.css`, `LogoSmart.tsx`, `Header.tsx`, `Hero.tsx`, `MigratingLogo.tsx`, `SkyLayer.tsx`, `RealSky.tsx`, `BookObject.tsx`, `BookEntry.tsx`, `ContactSection.tsx`, `BooksSection.tsx`, `ReviewsSection.tsx`, `AuthorSheet.tsx`, `_site.proyectos.index.tsx`, más `src/data/bodies.ts`, `src/components/SkyBodyCard.tsx` y `src/routes/_site.libros.$slug.tsx`.
- Textos nuevos (brújula, datos de cuerpos, ficha de libro) al sistema i18n existente.
- Verificación con navegador real: capturas del hero (logo grande y metalizado), del cielo arrastrado con tarjeta de planeta abierta, del libro sin fondo, y en ambos temas, revisando consola sin errores.
