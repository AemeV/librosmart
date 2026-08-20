import { motion } from "motion/react";
import { childVariants } from "@/lib/motion-config";

/** Encabezado de sección: siempre centrado. El subtítulo respeta la medida de lectura. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div variants={childVariants} className="mx-auto max-w-3xl text-center">
      {eyebrow ? <p className="label">{eyebrow}</p> : null}
      <h2 className="display-m mt-3">{title}</h2>
      {subtitle ? (
        <p className="body-s mx-auto mt-4 max-w-[52ch]">{subtitle}</p>
      ) : null}
    </motion.div>
  );
}
