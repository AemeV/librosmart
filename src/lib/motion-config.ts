export const springFast = { type: "spring" as const, stiffness: 400, damping: 30 };
export const springSoft = { type: "spring" as const, stiffness: 120, damping: 20 };
export const springSheet = { type: "spring" as const, stiffness: 260, damping: 30 };
export const easeEnter = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

export const tap = { scale: 0.97 };

export function sectionVariants(reduced: boolean | null, mobile = false) {
  const y = reduced ? 0 : mobile ? 12 : 24;
  return {
    hidden: { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        ...easeEnter,
        duration: mobile ? 0.45 : 0.6,
        staggerChildren: 0.08,
      },
    },
  };
}

export const childVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: easeEnter },
};

export const inViewProps = {
  initial: "hidden" as const,
  whileInView: "show" as const,
  viewport: { once: true, margin: "-80px" },
};
