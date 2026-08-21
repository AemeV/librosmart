import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/ContactSection";
import { useLang } from "@/context/LanguageContext";
import { childVariants, sectionVariants } from "@/lib/motion-config";

const title = "Orion — Sm@rt";
const description =
  "Orion, el próximo proyecto de Sm@rt de David Mauricio Guerrero Vélez. Muy pronto más detalles.";

export const Route = createFileRoute("/_site/orion")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrionPage,
});

function OrionPage() {
  const { t } = useLang();

  return (
    <>
      <main className="px-5 pt-24 pb-24 sm:px-6 sm:pt-32">
        <motion.div
          variants={sectionVariants(false)}
          initial="hidden"
          animate="show"
          className="mx-auto flex max-w-[1100px] flex-col items-center text-center"
        >
          <motion.p variants={childVariants} className="label">
            {t("orionSoon")}
          </motion.p>
          <motion.h1 variants={childVariants} className="mt-4 display-xl">
            {t("orionTitle")}
          </motion.h1>
          <motion.p variants={childVariants} className="body mt-6 max-w-[52ch]">
            {t("orionText")}
          </motion.p>
          <motion.div variants={childVariants} className="mt-10">
            <Link
              to="/"
              className="glass label inline-flex min-h-11 items-center gap-2 rounded-full px-5"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              {t("orionBack")}
            </Link>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
