// Datos del negocio en un solo lugar. Los valores entre [corchetes] son pendientes.

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5210000000000";

export const site = {
  name: "dyty",
  domain: "dyty.dev",
  url: "https://dyty.dev",
  email: "hola@dyty.dev",
  description:
    "Webs rápidas, captura de leads, CRM a medida y automatización con WhatsApp para negocios en Latinoamérica.",
  whatsappNumber,
};

export function whatsappLink(text = "Hola dyty, quiero información sobre sus servicios.") {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export const nav = [
  { href: "#servicios", label: "Servicios" },
  { href: "#casos", label: "Casos" },
  { href: "#desarrollo", label: "Desarrollo" },
  { href: "#paquetes", label: "Paquetes" },
  { href: "#contacto", label: "Contacto" },
];

export type Service = {
  title: string;
  description: string;
  cases: string[];
  wide?: boolean;
};

export const services: Service[] = [
  {
    title: "CRM a medida + WhatsApp",
    description:
      "Reservas, clientes, comisiones, inventario, bot de WhatsApp y envíos masivos automatizados.",
    cases: ["Cristina Spa"],
    wide: true,
  },
  {
    title: "Captura y seguimiento de leads",
    description:
      "Meta Lead Ads que llegan solos al CRM, Pixel + Conversions API y UTMs para saber qué anuncio vende.",
    cases: [],
  },
  {
    title: "Sitios web que cargan rápido y posicionan",
    description:
      "Webs corporativas con SEO técnico, Search Console y Core Web Vitals en verde.",
    cases: ["Otium"],
  },
  {
    title: "Dashboards y reportes de negocio",
    description:
      "Excel, CRM y plataformas en un solo panel: ventas, alumnos y rendimiento por sucursal. Power BI o dashboard web propio.",
    cases: ["Otium", "Cristina Spa"],
    wide: true,
  },
  {
    title: "Pagos en línea",
    description: "Cobros con tarjeta vía Stripe, integrados a tu sitio o sistema, también para clientes internacionales.",
    cases: [],
  },
  {
    title: "Plataformas educativas",
    description: "Integración y seguimiento de alumnos en LMS como LearnWorlds.",
    cases: [],
  },
  {
    title: "Hosting y mantenimiento",
    description: "Alojamiento, actualizaciones, respaldos y monitoreo de tu sitio o sistema cada mes.",
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
];

export type Plan = {
  name: string;
  audience: string;
  price: string;
  delivery: string;
  features: string[];
  featured?: boolean;
};

export const plans: Plan[] = [
  {
    name: "Presencia",
    audience: "Para negocios sin web o con una web lenta o desactualizada.",
    price: "[Desde $X USD]",
    delivery: "2–3 semanas",
    features: [
      "Sitio de 4 a 6 secciones, responsive y rápido",
      "SEO técnico + Google Search Console",
      "Perfil de Google Business",
      "Botón y enlaces de WhatsApp",
      "Meta Pixel + Analytics configurados",
    ],
  },
  {
    name: "Ventas",
    audience: "Para negocios que ya invierten en anuncios pero pierden leads.",
    price: "[Desde $X USD]",
    delivery: "4–6 semanas",
    featured: true,
    features: [
      "Todo lo de Presencia",
      "Leads desde Meta Lead Ads, web y WhatsApp",
      "CRM básico: pipeline, estados y seguimiento",
      "Conversions API + UTMs por anuncio",
      "Reporte mensual simple",
    ],
  },
  {
    name: "Sistema a medida",
    audience: "Para operaciones complejas: sucursales, inventario, comisiones.",
    price: "Cotización",
    delivery: "Según alcance",
    features: [
      "CRM o plataforma completa a medida",
      "Bot de WhatsApp, reservas y envíos automáticos",
      "Dashboards de negocio",
      "Pagos en línea con Stripe",
      "Integraciones con tus herramientas actuales",
    ],
  },
];

export const tools = ["Meta Ads", "WhatsApp", "Stripe", "Google", "Power BI", "LearnWorlds"];

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
    tools: ["MySQL / MariaDB", "Prisma ORM", "Power BI"],
  },
  {
    area: "Integraciones",
    description: "Conectamos lo que ya usas para que los datos fluyan solos.",
    tools: ["WhatsApp API", "Meta Lead Ads", "Conversions API", "Stripe", "LearnWorlds", "Google Search Console"],
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
