# Bloque 5 — El libro en móvil + Bloque 6 — Auditoría tipográfica

## Bloque 5 — El libro en móvil: objeto pasivo

En `BookObject.tsx` el libro es hoy un `<button>` con `onClick`, `onHoverStart/End`, `aria-expanded`, y en móvil abre un sheet arrastrable (`drag="y"`, `onDragEnd`). Ese `drag` es lo que captura el gesto vertical.

Cambios (solo rama móvil, <768px):

- El objeto 3D se renderiza en un `<div aria-hidden>` sin `onClick`, sin `onHover*`, sin `tabIndex`, sin `aria-expanded/aria-controls`. Nada de touch/pointer/drag.
- Se elimina por completo el `mobileSheet` arrastrable y su overlay, junto con el focus trap y el listener de Escape en móvil.
- Se conservan las cuatro caras, el grosor derivado de `pages` y la postura de reposo (rotateY -12°, rotateX 4°).
- Balanceo por scroll: `useScroll({ target, offset: ["start end","end start"] })` + `useTransform` a `rotateY` entre -18° y -6°, aplicado como motion value (sin `useState`, sin re-render por frame).
- Banda especular sobre la tapa: overlay con degradado lineal diagonal blanco (opacidad máx. 0.18), estrecho, cuya posición se deriva del mismo progreso de scroll y barre la portada de lado a lado.
- La sombra proyectada mueve su `x`/`scaleX` desde el mismo progreso, coherente con la rotación.
- Con `prefers-reduced-motion` el libro queda estático.

Índice en móvil (nuevo acordeón, en `BookEntry.tsx` bajo el libro):

- Botón de texto "Ver índice" / "View contents" con clase `.label` (bilingüe, se añaden las claves a `src/i18n/strings.ts`).
- Expande con `motion` `height: auto` la lista de capítulos (número + título + resumen) y, al final, la contratapa como párrafo.
- Solo visible en móvil; sin 3D, sin gestos, sin pantalla completa. `aria-expanded` va en este botón, que es el control real.

Desktop (≥768px): apertura 3D, hover, clic en la tapa, revelación del índice, Escape, focus trap y clic fuera se conservan sin cambios.

Verificación: script Playwright con viewport móvil que comprueba (a) que no hay handlers touch/drag ni `aria-expanded` en el libro, y (b) que un gesto de swipe vertical sobre el libro desplaza la página.

## Bloque 6 — Auditoría tipográfica

Inventario ya realizado sobre `src/components/` y `src/routes/` (se excluye `src/components/ui/`, primitivas shadcn no usadas por el sitio; ver nota):

| Archivo | Línea | Encontrado | Reemplazo |
|---|---|---|---|
| `BookEntry.tsx` | 67 | `featured ? "display-xl" : "display-m"` (tamaño condicional) | `display-m` fijo para todos los títulos de libro |
| `BookObject.tsx` | 284 | `fontSize: 8` inline (lomo) | clase de lomo dedicada en `styles.css`, fuera de los componentes |
| `AuthorSheet.tsx` | 157 | `text-[28px] leading-none` | `display-m` (o token numeral en CSS global) |
| `RetailerButton.tsx` | 33-34 | `text-sm font-medium` (×2) | `label` |
| `SkyBodyCard.tsx` | 89 | `text-sm font-medium` | `label` |
| `__root.tsx` | 19,20,21,27,47,50,59,65 | `text-7xl font-bold`, `text-xl font-semibold`, `text-sm`, `font-medium` | `display-xl` / `display-m` / `body` / `label` |

Total: 14 declaraciones fuera del sistema, en 6 archivos. No se encontró ningún `CardTitle`/`DialogTitle`/`SheetTitle` en uso en el sitio, ni familias declaradas fuera del sistema en componentes propios.

Acciones:

1. Aplicar los reemplazos de la tabla; el destacado se distingue solo por tamaño de portada y aire (ya lo hace `BookObject` vía `featured`), nunca por tipografía.
2. Revisar cada elemento que ya usa una clase del sistema para que no conviva con una `text-*` de tamaño en el mismo `className`.
3. Añadir en `styles.css` la única utilidad extra necesaria (texto del lomo) para que ningún componente declare `font-size`.
4. Normalizar espaciados de sección a múltiplos de 8 (`mt-4/mt-8/mt-10/mt-14/py-16/py-24`), eliminando valores impares tipo `mt-3`, `pb-36`, `sm:pt-20` donde rompan la escala.
5. Candado: `rg` final sobre `src/` (excluyendo `src/components/ui/`) confirmando cero `text-<size>`, cero `font-size`/`fontSize`, y cero tamaños condicionales.

Nota sobre `src/components/ui/`: son primitivas shadcn del template con decenas de `text-sm`/`text-xs` internos. Ninguna se usa en las páginas del sitio. Propongo dejarlas intactas y excluirlas del candado; si prefieres, en su lugar borro las primitivas no usadas para que el candado pase sobre todo `src/`.

## Reporte final

Al terminar entrego: número de lugares corregidos por archivo, resultado del candado `rg`, y confirmación del scroll fluido en móvil sobre el libro.
