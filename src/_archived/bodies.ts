import type { Localized } from "@/i18n/strings";

/**
 * Ficha de divulgación de cada cuerpo del cielo. Los datos de posición NO viven
 * aquí: se calculan en vivo con astronomy-engine. Aquí sólo los datos
 * característicos, el blurb y el libro relacionado (campo editable).
 */
export type BodyInfo = {
  id: "mercury" | "venus" | "mars" | "jupiter" | "saturn" | "moon" | "sun";
  name: Localized;
  facts: { label: Localized; value: Localized }[];
  /** Dos frases de divulgación */
  blurb: Localized;
  /** Libro que habla de este cuerpo. Editable. */
  relatedBookSlug: string;
};

export const bodies: BodyInfo[] = [
  {
    id: "mercury",
    name: { es: "Mercurio", en: "Mercury" },
    facts: [
      {
        label: { es: "Diámetro", en: "Diameter" },
        value: { es: "4.879 km", en: "4,879 km" },
      },
      {
        label: { es: "Duración del día", en: "Day length" },
        value: { es: "176 días terrestres", en: "176 Earth days" },
      },
      {
        label: { es: "Temperatura", en: "Temperature" },
        value: { es: "−180 °C a 430 °C", en: "−180 °C to 430 °C" },
      },
      {
        label: { es: "Gravedad", en: "Gravity" },
        value: { es: "3,7 m/s²", en: "3.7 m/s²" },
      },
    ],
    blurb: {
      es: "El planeta más pequeño y el más cercano al Sol, sin atmósfera que reparta el calor. Por eso pasa del hielo al horno en el mismo mundo.",
      en: "The smallest planet and the closest to the Sun, with no atmosphere to spread the heat. That is why the same world swings from ice to furnace.",
    },
    relatedBookSlug: "colonizacion",
  },
  {
    id: "venus",
    name: { es: "Venus", en: "Venus" },
    facts: [
      {
        label: { es: "Diámetro", en: "Diameter" },
        value: { es: "12.104 km", en: "12,104 km" },
      },
      {
        label: { es: "Duración del día", en: "Day length" },
        value: { es: "243 días terrestres", en: "243 Earth days" },
      },
      {
        label: { es: "Temperatura media", en: "Mean temperature" },
        value: { es: "464 °C", en: "464 °C" },
      },
      {
        label: { es: "Gravedad", en: "Gravity" },
        value: { es: "8,9 m/s²", en: "8.9 m/s²" },
      },
    ],
    blurb: {
      es: "Casi del tamaño de la Tierra, pero con una atmósfera de dióxido de carbono que atrapa el calor sin descanso. Es el efecto invernadero llevado al extremo.",
      en: "Almost Earth-sized, yet wrapped in a carbon dioxide atmosphere that traps heat relentlessly. It is the greenhouse effect taken to its limit.",
    },
    relatedBookSlug: "colonizacion",
  },
  {
    id: "mars",
    name: { es: "Marte", en: "Mars" },
    facts: [
      {
        label: { es: "Diámetro", en: "Diameter" },
        value: { es: "6.779 km", en: "6,779 km" },
      },
      {
        label: { es: "Duración del día", en: "Day length" },
        value: { es: "24 h 37 min", en: "24 h 37 min" },
      },
      {
        label: { es: "Temperatura media", en: "Mean temperature" },
        value: { es: "−63 °C", en: "−63 °C" },
      },
      {
        label: { es: "Gravedad", en: "Gravity" },
        value: { es: "3,7 m/s²", en: "3.7 m/s²" },
      },
    ],
    blurb: {
      es: "Su día dura casi lo mismo que el nuestro y tiene hielo de agua en los polos, así que es el destino más citado para una base humana. También tiene radiación sin filtrar y un tercio de nuestra gravedad.",
      en: "Its day is almost as long as ours and there is water ice at the poles, which makes it the most cited destination for a human base. It also has unfiltered radiation and a third of our gravity.",
    },
    relatedBookSlug: "colonizacion",
  },
  {
    id: "jupiter",
    name: { es: "Júpiter", en: "Jupiter" },
    facts: [
      {
        label: { es: "Diámetro", en: "Diameter" },
        value: { es: "139.820 km", en: "139,820 km" },
      },
      {
        label: { es: "Duración del día", en: "Day length" },
        value: { es: "9 h 56 min", en: "9 h 56 min" },
      },
      {
        label: { es: "Lunas conocidas", en: "Known moons" },
        value: { es: "95", en: "95" },
      },
      {
        label: { es: "Gravedad", en: "Gravity" },
        value: { es: "24,8 m/s²", en: "24.8 m/s²" },
      },
    ],
    blurb: {
      es: "Un gigante de gas con más masa que todos los demás planetas juntos y una tormenta que lleva siglos girando. Sus lunas heladas, y no el planeta, son las candidatas a albergar vida.",
      en: "A gas giant with more mass than all the other planets combined and a storm that has been spinning for centuries. Its icy moons, not the planet itself, are the candidates for life.",
    },
    relatedBookSlug: "colonizacion",
  },
  {
    id: "saturn",
    name: { es: "Saturno", en: "Saturn" },
    facts: [
      {
        label: { es: "Diámetro", en: "Diameter" },
        value: { es: "116.460 km", en: "116,460 km" },
      },
      {
        label: { es: "Duración del día", en: "Day length" },
        value: { es: "10 h 42 min", en: "10 h 42 min" },
      },
      {
        label: { es: "Anillos", en: "Rings" },
        value: { es: "Hielo y roca, ~280.000 km de ancho", en: "Ice and rock, ~280,000 km across" },
      },
      {
        label: { es: "Gravedad", en: "Gravity" },
        value: { es: "10,4 m/s²", en: "10.4 m/s²" },
      },
    ],
    blurb: {
      es: "Tan poco denso que flotaría en agua, y con un sistema de anillos hecho de trozos de hielo. En su luna Encélado hay un océano bajo la corteza que lanza chorros al espacio.",
      en: "So light it would float on water, ringed by countless chunks of ice. Its moon Enceladus hides an ocean under the crust that sprays jets into space.",
    },
    relatedBookSlug: "colonizacion",
  },
  {
    id: "moon",
    name: { es: "Luna", en: "Moon" },
    facts: [
      {
        label: { es: "Diámetro", en: "Diameter" },
        value: { es: "3.475 km", en: "3,475 km" },
      },
      {
        label: { es: "Duración del día", en: "Day length" },
        value: { es: "29,5 días terrestres", en: "29.5 Earth days" },
      },
      {
        label: { es: "Temperatura", en: "Temperature" },
        value: { es: "−173 °C a 127 °C", en: "−173 °C to 127 °C" },
      },
      {
        label: { es: "Gravedad", en: "Gravity" },
        value: { es: "1,6 m/s²", en: "1.6 m/s²" },
      },
    ],
    blurb: {
      es: "Nos muestra siempre la misma cara y estabiliza el eje de la Tierra, que es una de las razones de nuestro clima. Medio siglo después volvió a ser prioridad: hay hielo en sus cráteres polares.",
      en: "It always shows us the same face and steadies Earth's axis, one of the reasons our climate holds. Half a century later it is a priority again: there is ice in its polar craters.",
    },
    relatedBookSlug: "colonizacion",
  },
  {
    id: "sun",
    name: { es: "Sol", en: "Sun" },
    facts: [
      {
        label: { es: "Diámetro", en: "Diameter" },
        value: { es: "1.392.700 km", en: "1,392,700 km" },
      },
      {
        label: { es: "Temperatura superficial", en: "Surface temperature" },
        value: { es: "5.500 °C", en: "5,500 °C" },
      },
      {
        label: { es: "Edad", en: "Age" },
        value: { es: "4.600 millones de años", en: "4.6 billion years" },
      },
      {
        label: { es: "Gravedad", en: "Gravity" },
        value: { es: "274 m/s²", en: "274 m/s²" },
      },
    ],
    blurb: {
      es: "Concentra el 99,8 % de la masa del sistema solar y fusiona hidrógeno en helio en su núcleo. Toda la energía que sostiene la biosfera salió de ahí.",
      en: "It holds 99.8% of the solar system's mass and fuses hydrogen into helium in its core. Every bit of energy that sustains the biosphere came from there.",
    },
    relatedBookSlug: "colonizacion",
  },
];

export const bodyById = (id: string): BodyInfo | undefined => bodies.find((b) => b.id === id);
