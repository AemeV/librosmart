export type Lang = "es" | "en";
export type Localized = { es: string; en: string };

export const strings = {
  brand: { es: "Librosmart", en: "Librosmart" },
  brandTagline: {
    es: "Editorial de divulgación científica",
    en: "Science writing imprint",
  },

  navBooks: { es: "Libros", en: "Books" },
  navAuthor: { es: "El autor", en: "The author" },
  navReviews: { es: "Reseñas", en: "Reviews" },
  navProjects: { es: "Otros proyectos", en: "Other projects" },
  navContact: { es: "Contacto", en: "Contact" },
  menu: { es: "Menú", en: "Menu" },
  close: { es: "Cerrar", en: "Close" },
  viewContents: { es: "Ver índice", en: "View contents" },
  hideContents: { es: "Ocultar índice", en: "Hide contents" },

  themeLight: { es: "Tema claro", en: "Light theme" },
  themeDark: { es: "Tema oscuro", en: "Dark theme" },
  themeSystem: { es: "Tema del sistema", en: "System theme" },
  langLabel: { es: "Idioma de la interfaz", en: "Interface language" },

  heroKicker: { es: "Librosmart presenta", en: "Librosmart presents" },
  heroTitle: {
    es: "La ciencia, contada para que no se olvide",
    en: "Science, told so it stays with you",
  },
  heroSubtitle: {
    es: "Los libros de David Mauricio Guerrero Vélez: biodiversidad, espacio y los descubrimientos que están redefiniendo nuestro siglo.",
    en: "Books by David Mauricio Guerrero Vélez: biodiversity, space and the discoveries redefining our century.",
  },
  skyCityLabel: { es: "Ciudad del cielo", en: "Sky city" },
  skyVisible: { es: "visible", en: "visible" },

  heroScroll: { es: "Desliza", en: "Scroll" },

  readersTitle: { es: "Muro de lectores", en: "Readers wall" },
  readersSubtitle: {
    es: "Lectores con los libros, en Colombia y fuera de ella.",
    en: "Readers with the books, in Colombia and beyond.",
  },

  booksTitle: { es: "Los libros", en: "The books" },
  booksSubtitle: {
    es: "Elige tu formato, tu idioma de edición y tu librería.",
    en: "Pick your format, your edition language and your store.",
  },
  featured: { es: "Novedad", en: "New" },
  openBook: { es: "Abrir el libro", en: "Open the book" },
  closeBook: { es: "Cerrar el libro", en: "Close the book" },
  newBook: { es: "Nuevo libro", en: "New book" },
  keyPoints: { es: "Qué vas a encontrar", en: "What you'll find" },
  viewIndex: { es: "Ver índice y contraportada", en: "Index and back cover" },
  indexTitle: { es: "Índice", en: "Table of contents" },
  backCoverTitle: { es: "Contraportada", en: "Back cover" },
  buyTitle: { es: "Dónde comprarlo", en: "Where to buy" },
  physical: { es: "Físico", en: "Print" },
  digital: { es: "Digital", en: "Digital" },
  editionLabel: { es: "Edición", en: "Edition" },
  editionEs: { es: "Español", en: "Spanish" },
  editionEn: { es: "Inglés", en: "English" },
  soonRetailers: {
    es: "Links de compra en camino.",
    en: "Purchase links coming soon.",
  },
  metaYear: { es: "Año", en: "Year" },
  metaLangs: { es: "Idiomas", en: "Languages" },
  metaFormats: { es: "Formatos", en: "Formats" },
  coverAlt: { es: "Portada de", en: "Cover of" },

  reviewsTitle: { es: "Lo que dicen los lectores", en: "What readers say" },
  reviewsSubtitle: {
    es: "Reseñas de lectores, prensa e instituciones.",
    en: "Reviews from readers, press and institutions.",
  },
  goodreadsCta: { es: "Perfil en Goodreads", en: "Goodreads profile" },

  authorTitle: { es: "El autor", en: "The author" },
  authorBio1: {
    es: "David Mauricio Guerrero Vélez es divulgador científico colombiano. Escribe sobre biodiversidad, exploración espacial y los descubrimientos que cambian la forma en que entendemos el mundo, con un principio fijo: rigor sin jerga.",
    en: "David Mauricio Guerrero Vélez is a Colombian science writer. He writes about biodiversity, space exploration and the discoveries reshaping how we understand the world, with one fixed principle: rigor without jargon.",
  },
  authorBio2: {
    es: "Librosmart es su editorial personal, desde donde publica la colección Sm@rt y los títulos monográficos.",
    en: "Librosmart is his personal imprint, home to the Sm@rt collection and his monographic titles.",
  },

  projectsTitle: { es: "Otros proyectos", en: "Other projects" },
  projectsSubtitle: {
    es: "Charlas, contenidos y colaboraciones alrededor de los libros.",
    en: "Talks, content and collaborations around the books.",
  },
  projectsEyebrow: { es: "Librosmart", en: "Librosmart" },
  projectsIntro: {
    es: "Lo que ocurre alrededor de los libros: una cerveza artesanal, un podcast, expediciones de campo y talleres para colegios.",
    en: "Everything that happens around the books: a craft beer, a podcast, field expeditions and school workshops.",
  },
  projectsVisit: { es: "Ver el proyecto", en: "Visit the project" },
  backHome: { es: "Volver al inicio", en: "Back home" },

  contactTitle: { es: "Contacto", en: "Contact" },
  contactSubtitle: {
    es: "Prensa, ferias, charlas o pedidos al por mayor.",
    en: "Press, book fairs, talks or wholesale orders.",
  },
  formName: { es: "Nombre", en: "Name" },
  formEmail: { es: "Correo", en: "Email" },
  formMessage: { es: "Mensaje", en: "Message" },
  formSend: { es: "Enviar mensaje", en: "Send message" },
  formSuccess: {
    es: "Gracias, tu mensaje quedó registrado. Te responderemos pronto.",
    en: "Thank you, your message was recorded. We'll reply soon.",
  },
  errName: { es: "Escribe tu nombre.", en: "Please enter your name." },
  errEmail: { es: "Escribe un correo válido.", en: "Enter a valid email." },
  errMessage: {
    es: "Cuéntanos algo más (mínimo 10 caracteres).",
    en: "Tell us a bit more (10 characters minimum).",
  },
  rights: { es: "Todos los derechos reservados.", en: "All rights reserved." },
  follow: { es: "Redes", en: "Social" },

  authorSheetOpen: { es: "Conoce al autor", en: "Meet the author" },
  authorSheetRole: { es: "Divulgador científico", en: "Science writer" },
  authorSheetDrag: { es: "Desliza hacia abajo para cerrar", en: "Drag down to close" },
  authorPortraitAlt: {
    es: "Retrato de David Mauricio Guerrero Vélez",
    en: "Portrait of David Mauricio Guerrero Vélez",
  },
  authorSheetBio1: {
    es: "David Mauricio Guerrero Vélez nació en Colombia y lleva más de una década contando ciencia: biodiversidad, extinciones, exploración espacial y los descubrimientos que están redefiniendo la forma en que entendemos el planeta.",
    en: "David Mauricio Guerrero Vélez was born in Colombia and has spent over a decade telling science stories: biodiversity, extinctions, space exploration and the discoveries redefining how we understand the planet.",
  },
  authorSheetBio2: {
    es: "Su trabajo parte de un principio fijo: rigor sin jerga. Cada libro nace de fuentes revisadas por pares y se escribe para que un lector de quince años y un profesor universitario puedan leerlo con el mismo gusto.",
    en: "His work follows one fixed principle: rigor without jargon. Every book starts from peer-reviewed sources and is written so a fifteen-year-old and a university professor can both enjoy it.",
  },
  authorSheetBio3: {
    es: "Desde Librosmart, su editorial personal, publica la colección Sm@rt y sus títulos monográficos, y acompaña cada lanzamiento con charlas, videos y material educativo para colegios y universidades.",
    en: "Through Librosmart, his personal imprint, he publishes the Sm@rt collection and his monographic titles, pairing every launch with talks, videos and educational material for schools and universities.",
  },
  authorTrackTitle: { es: "Trayectoria", en: "Track record" },
  trackBooks: { es: "Libros publicados", en: "Published books" },
  trackBooksDetail: {
    es: "Títulos de divulgación en español e inglés, en formato físico y digital.",
    en: "Science titles in Spanish and English, in print and digital.",
  },
  trackVideos: { es: "Videos de divulgación", en: "Science videos" },
  trackVideosDetail: {
    es: "Cápsulas y series que amplían los temas de cada libro.",
    en: "Short explainers and series expanding each book's topics.",
  },
  trackTalks: { es: "Charlas", en: "Talks" },
  trackTalksDetail: {
    es: "Colegios, universidades y ferias del libro en Colombia y América Latina.",
    en: "Schools, universities and book fairs across Colombia and Latin America.",
  },
  trackConferences: { es: "Conferencias", en: "Conferences" },
  trackConferencesDetail: {
    es: "Participación en encuentros de ciencia, educación y medio ambiente.",
    en: "Appearances at science, education and environment gatherings.",
  },
  authorSocialTitle: { es: "Redes personales", en: "Personal channels" },
  authorSocialDetail: {
    es: "Viajes, ciencia y detrás de cámaras de cada libro.",
    en: "Travel, science and the making of each book.",
  },
  authorCtaTitle: { es: "¿Quieres invitarlo a una conferencia?", en: "Want to book a talk?" },
  authorCtaDetail: {
    es: "Charlas para colegios, universidades, empresas y ferias del libro, en español o inglés.",
    en: "Talks for schools, universities, companies and book fairs, in Spanish or English.",
  },
  authorCtaButton: { es: "Escribir para conferencias", en: "Get in touch for talks" },

  // Cielo interactivo
  skyDragHint: { es: "Arrastra para girar el horizonte", en: "Drag to turn the horizon" },
  skyCompass: { es: "Dirección", en: "Heading" },
  skyAltitude: { es: "Altitud", en: "Altitude" },
  skyAzimuth: { es: "Azimut", en: "Azimuth" },
  skyDistance: { es: "Distancia a la Tierra", en: "Distance from Earth" },
  skyLivePosition: { es: "Posición ahora", en: "Position now" },
  skyReadMore: { es: "Leer más", en: "Read more" },
  skyOpenBody: { es: "Ver información de", en: "See information about" },

  bookNotFound: { es: "Libro no encontrado", en: "Book not found" },
  backToBooks: { es: "Volver a los libros", en: "Back to books" },

} satisfies Record<string, Localized>;

export type StringKey = keyof typeof strings;
