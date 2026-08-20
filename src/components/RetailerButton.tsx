import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { springFast, tap } from "@/lib/motion-config";

/**
 * Pill de cristal para cada librería.
 * `logo` está pensado para un SVG monocromo: hereda currentColor,
 * muted en reposo y color de texto pleno en hover/focus.
 */
export function RetailerButton({
  logo,
  name,
  url,
}: {
  logo?: ReactNode;
  name: string;
  url: string;
}) {
  return (
    <motion.a
      href={url}
      target={url.startsWith("http") ? "_blank" : undefined}
      rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
      whileTap={tap}
      whileHover={{ y: -2 }}
      transition={springFast}
      className="group flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:text-text focus-visible:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {logo ? (
        <span className="flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden="true">
          {logo}
        </span>
      ) : null}
      <span>{name}</span>
      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden="true" />
    </motion.a>
  );
}
