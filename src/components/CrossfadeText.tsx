import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Crossfade rápido del texto al cambiar de idioma o de edición. */
export function CrossfadeText({
  k,
  children,
  className,
  as = "div",
}: {
  k: string;
  children: ReactNode;
  className?: string;
  as?: "div" | "span" | "p";
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as];
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Tag
        key={k}
        className={className}
        initial={{ opacity: 0, y: reduced ? 0 : 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduced ? 0 : -4 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {children}
      </Tag>
    </AnimatePresence>
  );
}
