import { motion } from "motion/react";
import { childVariants } from "@/lib/motion-config";

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
    <motion.div variants={childVariants} className="max-w-2xl">
      {eyebrow ? <p className="meta">{eyebrow}</p> : null}
      <h2 className="tight mt-3 text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1.05]">
        {title}
      </h2>
      {subtitle ? <p className="mt-4 text-base text-text-muted sm:text-lg">{subtitle}</p> : null}
    </motion.div>
  );
}
