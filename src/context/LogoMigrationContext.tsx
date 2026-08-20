import { useReducedMotion } from "motion/react";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";


/**
 * Un solo logo en pantalla. El hero registra su hueco (grande, centrado) y el
 * header su hueco de destino; <MigratingLogo /> dibuja el ÚNICO logo real y lo
 * interpola entre ambos según el progreso de scroll.
 */
type LogoMigrationValue = {
  heroSlot: HTMLElement | null;
  headerSlot: HTMLElement | null;
  setHeroSlot: (el: HTMLElement | null) => void;
  setHeaderSlot: (el: HTMLElement | null) => void;
  /** true cuando hay hero en pantalla: el logo migra en vez de duplicarse. */
  migrating: boolean;
};

const LogoMigrationContext = createContext<LogoMigrationValue | null>(null);

export function LogoMigrationProvider({ children }: { children: ReactNode }) {
  const [heroSlot, setHeroSlot] = useState<HTMLElement | null>(null);
  const [headerSlot, setHeaderSlot] = useState<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  const value = useMemo<LogoMigrationValue>(
    () => ({
      heroSlot,
      headerSlot,
      setHeroSlot,
      setHeaderSlot,
      migrating: Boolean(heroSlot && headerSlot && !reduced),
    }),
    [heroSlot, headerSlot, reduced],
  );


  return <LogoMigrationContext.Provider value={value}>{children}</LogoMigrationContext.Provider>;
}

export function useLogoMigration() {
  const ctx = useContext(LogoMigrationContext);
  if (!ctx) throw new Error("useLogoMigration debe usarse dentro de LogoMigrationProvider");
  return ctx;
}
