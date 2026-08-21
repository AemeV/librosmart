import { createContext, useCallback, useContext, useEffect, type ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "system";

type ThemeContextValue = {
  mode: ThemeMode;
  resolved: "light" | "dark";
  setMode: (mode: ThemeMode) => void;
  cycle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Modo oscuro deshabilitado por ahora. El provider mantiene la API para los
 * componentes que leen `resolved`, pero siempre devuelve "light".
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset["theme"] = "light";
  }, []);

  const noop = useCallback(() => {}, []);

  return (
    <ThemeContext.Provider
      value={{ mode: "light", resolved: "light", setMode: noop, cycle: noop }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
