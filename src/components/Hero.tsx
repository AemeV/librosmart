import { motion, useReducedMotion } from "motion/react";
import { RealSky } from "./RealSky";
import { LogoSmart } from "./LogoSmart";
import { useLang } from "@/context/LanguageContext";
import { useLogoMigration } from "@/context/LogoMigrationContext";
import { springSoft } from "@/lib/motion-config";

/**
 * Hero: el cielo real y un único logo, imponente y centrado. Empieza en el
 * borde superior de la ventana: las barras fijas flotan encima, de cristal.
 */
export function Hero() {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const { setHeroSlot, migrating } = useLogoMigration();

  return (
    <section
      id="top"
      aria-label={t("brand")}
      className="sky-scope relative flex min-h-svh flex-col overflow-hidden"
    >
      <RealSky>
        <motion.div
          className="flex w-full justify-center"
          initial={{ opacity: 0, scale: reduced ? 1 : 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={springSoft}
        >
          {/* Hueco del logo grande. Cuando migra, aquí sólo queda el espacio. */}
          <div
            ref={setHeroSlot}
            className="w-[80vw] max-w-[1100px] sm:w-[55vw]"
            style={{ aspectRatio: "237.23 / 54.31" }}
          >
            <LogoSmart
              className={`h-full w-full ${migrating ? "opacity-0" : "opacity-100"}`}
            />
          </div>
        </motion.div>
      </RealSky>
    </section>
  );
}
