# Librosmart Portal

Construye un sitio web de una sola página para Librosmart, la editorial personal del
divulgador científico colombiano David Mauricio Guerrero Vélez. El objetivo es uno solo: que
el visitante descubra los libros y llegue al link de compra correcto según su país, idioma y
formato. No es un e-commerce — la compra ocurre en Amazon, Kobo, Barnes & Noble y Librería
Nacional.

═══════════════════════════════════════
STACK
═══════════════════════════════════════
- React + Vite + TypeScript
- Tailwind CSS
- `motion` (imports desde "motion/react") para TODAS las animaciones. No uses otra librería
  de animación. Si el template trae `framer-motion`, sirve igual: la API es idéntica, solo
  cambia la ruta del import.
- lucide-react para iconografía
- Sin librería de i18n: el volumen de contenido no la justifica.
- Todo el contenido en `src/data/`. Cero texto hardcodeado dentro de los componentes.

═══════════════════════════════════════
DIRECCIÓN DE ARTE
═══════════════════════════════════════
Cruce entre editorial científico y sistema de interfaz iOS. La referencia es una app de
astronomía bien diseñada, no un sitio de autor. Materiales translúcidos, movimiento con
física, tipografía grande y confiada, mucho aire.

REGLA ESTRUCTURAL — respétala en todo el sitio:
El cristal es para lo que FLOTA sobre el contenido: header, botones de librería, chips,
controles, sheets, overlays. El contenido en sí (portadas, títulos, descripciones, índices,
reseñas) vive sobre superficies sólidas, con jerarquía tipográfica clara y sin translucidez.
Si todo es cristal, nada lo es.

--- Paleta ---
Modo claro:
  --bg:          #E8EAE4   (salvia muy pálido, cálido, nunca blanco puro)
  --surface:     #F4F5F1
  --text:        #16181A
  --text-muted:  #6B7069
  --accent:      #D4F55A   (lima neón)
  --accent-text: #16181A
  --border:      rgba(22,24,26,0.10)

Modo oscuro:
  --bg:          #14171A
  --surface:     #1C2023
  --text:        #F0F2ED
  --text-muted:  #878D86
  --accent:      #D4F55A
  --accent-text: #16181A
  --border:      rgba(240,242,237,0.10)

El acento lima ocupa máximo el 5% de la superficie visual. Si aparece en más de dos
elementos por viewport, está de más. El texto sobre el acento es SIEMPRE oscuro.

--- Material de cristal ---
Define UNA clase `.glass` reutilizable con variantes por tema:

Claro:  background: rgba(255,255,255,0.55);
        border: 1px solid rgba(255,255,255,0.70);
        backdrop-filter: blur(20px) saturate(180%);
        box-shadow: 0 1px 2px rgba(22,24,26,0.04), 0 8px 24px rgba(22,24,26,0.06);

Oscuro: background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.10);
        backdrop-filter: blur(24px) saturate(140%);
        box-shadow: 0 1px 2px rgba(0,0,0,0.30), 0 8px 32px rgba(0,0,0,0.25);

Incluye siempre `-webkit-backdrop-filter` y un fallback opaco vía
`@supports not (backdrop-filter: blur(1px))`.

LÍMITE DE RENDIMIENTO: máximo 6 elementos con backdrop-filter simultáneos en pantalla. Es la
propiedad más cara del navegador y en móviles de gama media tumba el framerate del scroll.
Si necesitas más superficies, usa color sólido con opacidad.

--- Radios ---
Estilo iOS: 20px en contenedores grandes, 14px en tarjetas, 999px en chips y botones. Nada de
esquinas rectas. Los botones de acción son pills.

--- Tipografía (Google Fonts) ---
Primaria (títulos y UI): Inter Tight, pesos 400/500/600. Tracking -0.03em a partir de 40px.
Datos y metadatos: Geist Mono, 11px, uppercase, tracking 0.08em, color muted.
Acento editorial: Instrument Serif — RESERVADA. Solo en el titular del hero y en los títulos
de los libros. En ningún otro lugar.

Escala generosa: títulos de sección desde 48px desktop / 32px mobile.

═══════════════════════════════════════
MOVIMIENTO
═══════════════════════════════════════
Física, no duraciones. Todo hover, tap y cambio de estado usa spring.
  Interacciones rápidas: { type: 'spring', stiffness: 400, damping: 30 }
  Sheets y paneles:      { type: 'spring', stiffness: 260, damping: 30 }
  Entradas al scroll:    ease [0.16, 1, 0.3, 1], 0.6s

- Estado presionado (crítico para la sensación iOS): todo elemento interactivo lleva
  `whileTap={{ scale: 0.97 }}`. También en desktop.
- Entradas de sección: `whileInView` con `viewport={{ once: true, margin: '-80px' }}`,
  translateY de 24px a 0 + opacity, con `staggerChildren: 0.08` entre hijos.
- Parallax de portadas: `useScroll` + `useTransform`, máximo 40px de desplazamiento.
- Sheets y modales: entran desde abajo con `drag="y"`, `dragConstraints={{ top: 0 }}`,
  `dragElastic={0.2}`, y se cierran si el usuario arrastra más de 100px o supera cierta
  velocidad.
- `useReducedMotion` de motion: cuando esté activo, desactiva parallax, marquee, tilt 3D y
  drag. Las opacidades pueden quedarse.
- Regla general: si una animación no comunica jerarquía o estado, no va.

═══════════════════════════════════════
BILINGÜE ES / EN
═══════════════════════════════════════
- Contexto de React (`LanguageProvider`) con hook `useLang()`.
- Strings de interfaz en `src/i18n/strings.ts` como { clave: { es: '...', en: '...' } }.
- Todo contenido de libro (título, subtítulo, descripción, puntos clave, capítulos,
  contraportada) tiene ambas versiones dentro del objeto del libro.
- Detección inicial por `navigator.language`; si empieza por 'es', español, si no, inglés.
  Persiste en localStorage. Actualiza `<html lang>` al cambiar.
- El toggle es un segmented control de cristal, ES · EN, con el indicador deslizándose entre
  ambas opciones usando `layoutId` de motion. Va en el header.
- Al cambiar de idioma, el texto hace crossfade rápido (opacidad + 4px de desplazamiento,
  200ms), no un salto.

DISTINCIÓN CRÍTICA — no las mezcles:
El idioma de la INTERFAZ (este toggle) es independiente del idioma de EDICIÓN de cada libro.
Un lector puede navegar el sitio en inglés y comprar la edición en español. El toggle global
NO filtra ni oculta ediciones.

═══════════════════════════════════════
TEMA CLARO / OSCURO
═══════════════════════════════════════
- Colores como CSS custom properties en `:root` y `[data-theme="dark"]`.
  Tailwind: darkMode: ['class', '[data-theme="dark"]'].
- Tres estados: claro, oscuro, sistema. Por defecto, sistema. Persiste en localStorage.
- Aplica `data-theme` con un script inline en el `<head>` ANTES de que React monte, para
  evitar el flash de tema incorrecto al cargar.
- Transición de 300ms solo en background-color, color y border-color. NUNCA `transition: all`
  — provoca parpadeos en los elementos de cristal.
- El toggle es un botón de cristal circular, con el icono cambiando vía `AnimatePresence`
  (rotación + escala), junto al selector de idioma.

═══════════════════════════════════════
ESTRUCTURA
═══════════════════════════════════════

1. HEADER FIJO, DOS NIVELES
   Superior: logo Librosmart a la izquierda (placeholder de texto por ahora); a la derecha,
   toggle de idioma, toggle de tema e iconos de redes (Instagram, YouTube, TikTok, Facebook).
   Inferior (subheader): menú horizontal — Libros · El autor · Reseñas · Otros proyectos ·
   Contacto.
   Comportamiento: el subheader se oculta al hacer scroll hacia abajo y reaparece al hacer
   scroll hacia arriba (translateY + opacity, spring). El nivel superior siempre visible,
   ganando cristal y borde inferior a partir de 80px de scroll.
   En mobile el menú se convierte en un overlay full-screen animado.

2. HERO
   Casi el viewport completo. Titular grande en Instrument Serif, subtítulo breve, indicador
   de scroll discreto. Por ahora, fondo con un degradado sólido — el cielo en tiempo real
   viene en un prompt posterior, así que deja el fondo como un componente aislado
   `<SkyBackground />` fácil de reemplazar.

3. MURO DE LECTORES
   Tira horizontal de fotos de gente leyendo los libros, desplazándose de forma continua e
   infinita (marquee) a velocidad lenta. Se pausa al hover; en mobile sigue sola. 8-10
   placeholders. Clic abre un lightbox simple.

4. LIBROS — el corazón del sitio
   Cada libro es una unidad grande y espaciosa, no una tarjeta de un grid apretado. En
   desktop alterna la posición de la portada (izquierda / derecha) entre libros consecutivos;
   en mobile siempre apilado.

   Cada libro muestra:
   - Portada grande desde /public/covers/, con hover de rotación 3D siguiendo el cursor
     (perspective + rotateX/rotateY, máximo 8 grados) y sombra proyectada.
   - Título en Instrument Serif, subtítulo, metadatos en Geist Mono (año, idiomas, formatos).
   - Descripción corta y lista de puntos clave.
   - Botón "Ver índice y contraportada" — por ahora abre un sheet simple con el índice.
   - Bloque de compra: links agrupados por formato (Físico / Digital) y dentro de cada grupo
     un botón por librería. Crea un componente `<RetailerButton>` que recibe `logo`
     (ReactNode), `name` y `url`, con la forma de pill de cristal, pensado para alojar un
     logo SVG en monocromo (color muted) que pasa a color de texto pleno en hover. Por ahora
     usa placeholders con el nombre del retailer.
   - Si el libro tiene edición en inglés, un toggle ES/EN LOCAL dentro de la ficha que
     intercambia portada y links de compra con crossfade animado. Este toggle es distinto del
     toggle global de interfaz.

5. RESEÑAS
   Reseñas curadas desde `src/data/reviews.ts`: texto, autor, fuente (Goodreads, prensa,
   institución), rating cuando aplique. Carrusel deslizable en mobile, grid asimétrico en
   desktop. Enlace al perfil del autor en Goodreads.
   NO intentes conectarte a la API de Goodreads: está descontinuada desde 2020 y no emite
   llaves nuevas.

6. CONTACTO Y FOOTER
   Datos de contacto (+57 317 404 2430, coleccionsmart@gmail.com), redes, y un formulario
   simple (nombre, email, mensaje) que por ahora solo valida y muestra estado de éxito.

═══════════════════════════════════════
DATOS
═══════════════════════════════════════
Crea `src/data/books.ts`:

type Localized = { es: string; en: string }
type Retailer = { name: string; url: string; region?: 'CO'|'US'|'UK'|'DE'|'GLOBAL' }
type Edition = {
  language: 'es' | 'en'
  coverUrl: string
  backCover: Localized
  physical: Retailer[]
  digital: Retailer[]
}
type Chapter = { number: number; title: Localized; summary?: Localized }
type Book = {
  slug: string
  title: string
  subtitle: Localized
  year: number
  featured: boolean
  description: Localized
  keyPoints: Localized[]
  chapters: Chapter[]
  editions: Edition[]
}

Los libros:
1. slug "sexta-extincion" — "La Sexta Extinción Masiva de Especies" / "La carrera por salvar
   la Biodiversidad". featured: true (lanzamiento FILBo 2026). Solo español.
2. slug "colonizacion" — "La Colonización del Espacio" / "El camino de la Humanidad hacia la
   conquista espacial". Español e inglés.
3. slug "smart-3" — "Sm@rt 3". Español e inglés.
4. slug "smart-2" — "Sm@rt 2" / "Los más recientes e importantes descubrimientos
   científicos". Español, inglés y ebook. Retailers: Amazon US, Amazon UK, Amazon DE,
   Barnes & Noble, Kobo.
5. slug "smart-1" — "Sm@rt 1". Español. Retailer: Librería Nacional.
6. slug "guia-covid" — "Guía Covid-19". Español.

Las portadas ya están en /public/covers/. Usa placeholders para capítulos y contraportadas, y
marca con comentarios TODO cada campo que yo deba completar.

═══════════════════════════════════════
MOBILE — PRIORIDAD MÁXIMA
═══════════════════════════════════════
La mayoría del tráfico es móvil. Diseña mobile primero y trátalo como la versión principal.
- Targets táctiles mínimo 44x44px, sobre todo los botones de librería.
- Los links de compra alcanzables sin scroll horizontal ni zoom.
- Portadas máximo al 65% del ancho de pantalla, para que título y CTA queden en el mismo
  viewport.
- Nada de hover como único mecanismo: todo funciona con tap.
- Animaciones de scroll más cortas y con menos desplazamiento que en desktop.

═══════════════════════════════════════
CALIDAD
═══════════════════════════════════════
- HTML semántico, jerarquía correcta de headings, alt descriptivo en portadas.
- Contraste mínimo AA en ambos temas.
- Sheets navegables por teclado, con focus trap y cierre con Escape.
- Componentes pequeños y separados en src/components/.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://librosmart.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/92639a9f-4c67-40c2-99f5-de77e5d0c603).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
