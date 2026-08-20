import type { ReactNode } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthorSheetProvider } from "@/context/AuthorSheetContext";
import { AuthorSheet } from "@/components/AuthorSheet";

/**
 * Contexto compartido por todas las rutas del sitio (tema, idioma, sheet del autor).
 * Vive en el layout `_site`, así cualquier ruta nueva o anidada lo hereda sin cambios.
 */
export function SiteProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthorSheetProvider>
          {children}
          <AuthorSheet />
        </AuthorSheetProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
