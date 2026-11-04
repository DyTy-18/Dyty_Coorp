// Datos del negocio en un solo lugar. Los valores entre [corchetes] son pendientes.

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "59162356328";

export const site = {
  name: "dyty",
  domain: "dyty.dev",
  url: "https://dyty.dev",
  email: "dylanlara@dyty.dev",
  description:
    "Webs rápidas, captura de leads, CRM a medida y automatización con WhatsApp para negocios en Bolivia y Latinoamérica.",
  whatsappNumber,
};

// Programa de socios de Hostinger: `url` es nuestro link de referido.
export const hostinger = {
  url: "https://www.hostinger.com/es?REFERRALCODE=JTDLARA12VDK",
  badge: "/img/hostinger/partner-640x240.png",
  alt: "Hostinger Partner",
};

export function whatsappLink(text = "Hola dyty, quiero información sobre sus servicios.") {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export const nav = [
  { href: "/#servicios", label: "Servicios" },
  { href: "/#webs", label: "Webs" },
  { href: "/#paquetes", label: "Paquetes" },
  { href: "/#casos", label: "Casos" },
  { href: "/#desarrollo", label: "Desarrollo" },
  { href: "/#contacto", label: "Contacto" },
];

export type Scene = "crm" | "leads" | "web" | "dashboard" | "payments" | "lms" | "hosting" | "projects";

export type Service = {
  title: string;
  scene: Scene; // animación de la tarjeta (service-scenes.tsx)
  description: string;
  cases: string[];
  wide?: boolean;
  href?: string; // página propia con demo (ver servicePages)
};

export const services: Service[] = [
  {
    title: "CRM a medida + WhatsApp",
    scene: "crm",
    description:
      "Reservas, clientes, comisiones, inventario, bot de WhatsApp y envíos masivos automatizados.",
    cases: ["Cristina Spa"],
    wide: true,
  },
  {
    title: "Captura y seguimiento de leads",
    scene: "leads",
    description:
      "Meta Lead Ads que llegan solos al CRM, Pixel + Conversions API y UTMs para saber qué anuncio vende.",
    cases: [],
  },
  {
    title: "Sitios web que cargan rápido y posicionan",
    scene: "web",
    description:
      "Webs corporativas con SEO técnico, Search Console y Core Web Vitals en verde.",
    cases: ["Otium", "MarKual"],
  },
  {
    title: "Dashboards y reportes de negocio",
    scene: "dashboard",
    description:
      "Excel, CRM y plataformas en un solo panel: ventas, alumnos y rendimiento por sucursal. Todo en un dashboard web propio.",
    cases: ["Otium", "Cristina Spa"],
  },
  {
    title: "Software de gestión de proyectos",
    scene: "projects",
    description:
      "Tableros para tu equipo: quién hace qué, en qué estado va cada tarea y notas en cada una. Hecho a la medida de cómo trabajan.",
    cases: ["Otium"],
    href: "/servicios/gestion-de-proyectos",
  },
  {
    title: "Hosting y mantenimiento",
    scene: "hosting",
    description:
      "Somos partners de Hostinger: tu sitio o sistema alojado ahí, con actualizaciones, respaldos y monitoreo cada mes.",
    cases: [],
    wide: true,
  },
  {
    title: "Plataformas educativas",
    scene: "lms",
    description: "Integración y seguimiento de alumnos en LMS como LearnWorlds.",
    cases: [],
  },
];

export const cases = [
  {
    client: "Cristina Spa",
    summary: "CRM multi-sucursal con reservas, comisiones, inventario y bot de WhatsApp.",
    tag: "CRM + WhatsApp",
  },
  {
    client: "Otium",
    summary: "Web corporativa rápida, Search Console y reportes de negocio.",
    tag: "Web + Datos",
  },
  {
    client: "MarKual",
    summary: "Portafolio de fotografía de expediciones: galería por categorías, mapa de rutas y licencias de imágenes por WhatsApp.",
    tag: "Web + Portafolio",
  },
];

export type Plan = {
  name: string;
  audience: string;
  price: string;
  delivery?: string;
  maintenance?: string;
  features: string[];
  featured?: boolean;
  note?: string; // aclaración corta bajo el precio
  cta?: string; // texto del botón; por defecto "Me interesa"
};

// Una sola escalera de precios en bolivianos, partida en dos secciones:
// webPlans en "Páginas web" ([01]–[02]) y plans en "Paquetes" ([03]–[04]).
export const webPlans: Plan[] = [
  {
    name: "Express",
    audience: "Para el negocio que quiere estar en internet y aparecer en Google.",
    price: "Desde Bs 1.500",
    maintenance: "Mantenimiento opcional · Bs 120/mes",
    features: [
      "Web de una página: servicios, ubicación y contacto",
      "Carga rápida, también en el celular",
      "Botón de WhatsApp y formulario",
      "Perfil de Google Business para aparecer en Maps",
      "Tu web preparada para que Google la encuentre y la muestre",
      "Te ayudamos a contratar y configurar tu hosting",
    ],
  },
  {
    name: "Presencia",
    audience: "Para negocios que quieren verse profesionales.",
    price: "Desde Bs 2.500",
    maintenance: "Mantenimiento · desde Bs 150/mes",
    delivery: "2–3 semanas",
    features: [
      "Todo lo de Express",
      "Hasta 5 secciones: Inicio, Servicios, Nosotros, Galería, Contacto",
      "Google Analytics: cuánta gente te visita",
      "2 rondas de cambios",
    ],
  },
];

export const plans: Plan[] = [
  {
    name: "Ventas",
    audience: "Para negocios que quieren crecer en Facebook e Instagram.",
    price: "Desde Bs 5.000",
    maintenance: "Mantenimiento · desde Bs 300/mes",
    delivery: "4–6 semanas",
    note: "Gestión mensual de anuncios: se cotiza aparte",
    featured: true,
    features: [
      "Todo lo de Presencia",
      "Conectamos tu web con Meta Business",
      "Configuramos tu cuenta publicitaria de Meta",
      "Meta Pixel + Conversions API",
      "Reporte mensual simple",
    ],
  },
  {
    name: "Sistema a medida",
    audience: "Para operaciones con sucursales, inventario y comisiones.",
    price: "Desde Bs 15.000",
    maintenance: "Mantenimiento · desde Bs 600/mes",
    delivery: "Según alcance",
    cta: "Pedir cotización",
    features: [
      "CRM completo a medida",
      "Bot de WhatsApp, reservas y recordatorios",
      "Dashboards de ventas por sucursal",
      "Integración con tus herramientas actuales",
    ],
  },
];

// Opciones de "¿Qué necesitas?" del formulario. `short` es la etiqueta del panel de leads.
export const leadNeeds = [
  { value: "express", label: "Una web sencilla de una página (Express)", short: "Express" },
  { value: "presencia", label: "Una web completa de varias secciones (Presencia)", short: "Presencia" },
  { value: "ventas", label: "Vender más en Facebook e Instagram (Ventas)", short: "Ventas" },
  { value: "sistema", label: "Un CRM o sistema a medida", short: "Sistema a medida" },
  { value: "no-se", label: "No estoy seguro, quiero asesoría", short: "Asesoría" },
] as const;

export const tools = ["Meta Ads", "WhatsApp", "Google", "LearnWorlds"];

// Stack técnico. Basado en los proyectos actuales (CRM en Next.js + Prisma, sistemas en Laravel).
export const stack = [
  {
    area: "Frontend",
    description: "Interfaces rápidas, accesibles y que se ven bien en el celular.",
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui", "Vite"],
  },
  {
    area: "Backend",
    description: "APIs, autenticación, colas y la lógica de tu negocio.",
    tools: ["Node.js", "Laravel", "PHP", "Next.js API", "NextAuth"],
  },
  {
    area: "Datos",
    description: "Bases de datos ordenadas y reportes que salen de ellas.",
    tools: ["MySQL / MariaDB", "Prisma ORM"],
  },
  {
    area: "Integraciones",
    description: "Conectamos lo que ya usas para que los datos fluyan solos.",
    tools: ["WhatsApp API", "Meta Lead Ads", "Conversions API", "LearnWorlds", "Google Search Console"],
  },
  {
    area: "Infraestructura",
    description: "Tu sistema en tu servidor, con respaldos y monitoreo.",
    tools: ["Docker", "Dokploy", "VPS Linux", "Git", "CI/CD"],
  },
];

export const principles = [
  { title: "Código a medida", detail: "Nada de plantillas: se construye para cómo opera tu negocio." },
  { title: "Tuyo desde el día uno", detail: "El código y los datos son tuyos. Sin amarres a una plataforma." },
  { title: "Rápido por defecto", detail: "Medimos Core Web Vitals y tiempos de respuesta antes de entregar." },
];

// Páginas propias de cada servicio, con demo. La demo usa datos de ejemplo y solo muestra la interfaz:
// nada se guarda ni se envía.
export type ServicePage = {
  slug: string;
  service: string; // nombre corto, para la miga de pan y el título de la pestaña
  title: string; // h1
  titleAccent?: string; // remate del h1, en gris
  metaDescription: string;
  intro: string;
  price: string;
  includes: { title: string; detail: string }[];
  caseStudy?: { client: string; summary: string };
  faqs: { q: string; a: string }[];
  whatsappText: string;
};

export const servicePages = {
  projects: {
    slug: "gestion-de-proyectos",
    service: "Gestión de proyectos",
    title: "Menos seguimiento, más resultados.",
    titleAccent: "Cada tarea en su lugar.",
    metaDescription:
      "Software de gestión de proyectos a medida para negocios en Bolivia: tareas con responsable, estado y notas. Prueba la demo con datos de ejemplo.",
    intro:
      "Un tablero hecho para tu negocio. Cada tarea tiene su responsable, su estado y sus notas, y nadie tiene que preguntar en el grupo de WhatsApp en qué va cada cosa.",
    price: "Desde Bs 6.000",
    includes: [
      {
        title: "Tableros a tu medida",
        detail: "Por proyecto, por cliente o por área, con las columnas que usa tu equipo y no las de una plantilla.",
      },
      {
        title: "Responsable y fecha",
        detail: "Cada tarea tiene dueño y fecha de entrega. Lo atrasado se ve de un vistazo.",
      },
      {
        title: "Notas en cada tarea",
        detail: "Avances, pendientes y acuerdos quedan escritos en la tarea, no perdidos en un chat.",
      },
      {
        title: "Desde el celular",
        detail: "Funciona en el navegador, en la compu o en el teléfono. No hay que instalar nada.",
      },
      {
        title: "Una cuenta por persona",
        detail: "Cada uno entra con su usuario y ve lo que le toca.",
      },
      {
        title: "En tu servidor",
        detail: "El sistema y los datos son tuyos. Lo alojamos en Hostinger, a tu nombre.",
      },
    ],
    faqs: [
      {
        q: "¿Por qué no usar Trello o Asana?",
        a: "Para empezar sirven. Conviene uno propio cuando necesitas que el tablero siga los pasos de tu negocio, que se conecte con tu CRM o tu WhatsApp, o cuando ya no quieres pagar una licencia por cada usuario.",
      },
      {
        q: "¿Cuánto tarda?",
        a: "Depende de cuántos tableros y pasos tenga tu proceso. Antes de empezar lo revisamos juntos y te damos una fecha de entrega.",
      },
      {
        q: "¿Se puede usar desde el celular?",
        a: "Sí. Es una web, así que funciona en cualquier navegador sin instalar nada.",
      },
      {
        q: "¿De quién son los datos?",
        a: "Tuyos. El sistema corre en un servidor a tu nombre y puedes llevarte el código y los datos cuando quieras.",
      },
    ],
    whatsappText: "Hola dyty, vi la demo de gestión de proyectos y quiero algo así para mi negocio.",
  },
} satisfies Record<string, ServicePage>;
