import { motion } from "motion/react";
import { childVariants } from "@/lib/motion-config";

/**
 * Encabezado de sección: siempre centrado. Todos los títulos de sección usan
 * .display-m; sólo el titular mayor de una página puede pedir size="xl".
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  size = "m",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  size?: "m" | "xl";
}) {
  return (
    <motion.div variants={childVariants} className="mx-auto max-w-3xl text-center">
      {eyebrow ? <p className="label">{eyebrow}</p> : null}
      <h2 className={`mt-4 ${size === "xl" ? "display-xl" : "display-m"}`}>{title}</h2>
      {subtitle ? <p className="body-s mx-auto mt-4 max-w-[52ch]">{subtitle}</p> : null}
    </motion.div>
  );
}
