import { Outlet, createFileRoute } from "@tanstack/react-router";

/**
 * Layout de /proyectos. Para una ruta de detalle basta crear
 * `_site.proyectos.$slug.tsx` con `createFileRoute("/_site/proyectos/$slug")`.
 */
export const Route = createFileRoute("/_site/proyectos")({
  component: () => <Outlet />,
});
