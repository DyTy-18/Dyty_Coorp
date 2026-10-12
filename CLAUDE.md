@AGENTS.md

# dyty.dev

Sitio de **dyty**: desarrollo y automatización para negocios en LATAM (CRM a medida + WhatsApp, captura de leads,
webs con SEO, dashboards, pagos con Stripe, LMS, hosting). Todo el contenido y la comunicación con el usuario van en
**español**.

## Comandos

```bash
npm run dev      # desarrollo en :3000
npm run build    # build de producción (output standalone)
npm run lint
npx tsc --noEmit
```

Antes de dar algo por terminado: `npm run lint`, `npx tsc --noEmit` y `npm run build` sin errores.

## Stack y estructura

Next.js 16 (App Router, `cacheComponents`) + React 19 + Tailwind CSS 4 + lucide-react + GSAP (ScrollTrigger,
SplitText) + Lenis. Sin shadcn, sin Motion. La animación del hero es CSS; el scroll suave y los reveals son GSAP/Lenis
(ver "GSAP + Lenis").

- `src/lib/site.ts`: **todo el contenido del negocio** (servicios, casos, paquetes, stack, WhatsApp, nav).
  Para cambiar textos se edita aquí, no en los componentes.
- `src/components/`: una sección por archivo (`hero`, `lead-flow`, `sections`, `stack`, `contact`, `header`).
  `ui.tsx` tiene `ButtonLink`, `buttonClass` y `Tag`: úsalos en lugar de repetir clases.
- `src/app/actions.ts`: Server Action del formulario de contacto.
- `src/app/globals.css`: tokens del diseño (`@theme`), utilidades `display` y `label-mono`, keyframes.
- `docs/`: listas de revisión de rendimiento y accesibilidad.

## Sistema de diseño: "brutalist editorial"

Fuente de verdad: los tokens de `globals.css`. Reglas:

- **Superficies:** lienzo `canvas` #e5e5e5 (nunca blanco como fondo de página), tarjetas `paper` #fff,
  bloques `carbon` #000. Profundidad por contraste de superficies: **sin sombras, sin degradados, sin bordes grises
  en tarjetas**. Única excepción: el halo `shadow-[0_0_0_6px_…]` del punto del hero (`lead-flow.tsx`).
- **Acentos:** `mint` #d1ffca solo en etiquetas (`Tag`) y detalles; `volt` #fff100 solo en micro-acentos (punto del
  logo, correo, una barra). Nunca como relleno de superficies grandes.
- **Tipografía:**
  - Display: clase `display` (Barlow Condensed 700, mayúsculas, interlineado 0.9, tracking -0.03em),
    de 48 a 130px. Nunca por debajo de 48px. Excepciones intencionales: el logo (`logo.tsx`, 34px) y la palabra
    gigante del footer (`contact.tsx`, hasta 30rem, `aria-hidden`).
  - Subtítulos: Geist 450 en mayúsculas, 28–40px.
  - Cuerpo: Geist 16px.
  - Etiquetas: `label-mono` (Geist Mono 12px, mayúsculas).
- **Radios:** tarjetas 32px (`rounded-[32px]`), secciones que abren con arco `rounded-t-[64px]`,
  menú en cápsula 48px, botones 4–8px, etiquetas redondas.
- **Contraste (WCAG AA):** `smoke` #979797 **solo sobre negro**. Texto secundario sobre claro = `slate` #444.
  Errores = `error`. Revisa contraste de cualquier color nuevo (4.5:1 texto normal, 3:1 desde 24px).
- **Layout:** contenedor `max-w-[1200px] px-4 md:px-6`, secciones `py-20 md:py-24`. Debe funcionar a 375px sin
  scroll horizontal.
- Los íconos son de lucide. No uses emojis como íconos.

## Movimiento

Lo que manda en movimiento: `animate` → `emil-design-eng`. Reglas fijas:

- Nunca `ease-in` en UI. Curva base `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`.
- UI < 300ms (botones 100–160ms). Hero y reveals de marketing pueden durar 500–800ms.
- Nunca `scale(0)`; empieza en `scale(0.95)` + `opacity: 0`. Nunca `transition: all`.
- Anima solo `transform` y `opacity` (y la variable `--on` del hero).
- Todo movimiento respeta `prefers-reduced-motion` (ver el bloque al final de `globals.css`).
- La animación del hero (`lead-flow.tsx`) es CSS puro: `@property --on` de 0 a 1 por paso, ciclo de 8s.
  Si cambias el número de pasos, ajusta los keyframes `flow-step-*` y `flow-dot`.

### GSAP + Lenis

- Todo vive en `src/components/motion.tsx` (`"use client"`, renderiza `null`, montado al final de
  `page.tsx`). **No lo pases al layout:** ahí corre antes de que la página hidrate y SplitText provoca un hydration
  mismatch. Las secciones siguen siendo de servidor y solo marcan atributos:
  - `data-reveal="title"`: título que sube línea por línea (SplitText con máscara).
  - `data-reveal="stagger"`: sus hijos directos aparecen escalonados (y 40px + opacidad, 60ms entre cada uno).
  - `data-reveal="words"`: el texto se enciende palabra por palabra ligado al scroll (frase de `Statement`).
  - `data-reveal="code"`: las líneas del `<code>` se escriben una por una (termina en un cursor `.cursor-blink`).
  - `data-reveal="chips"`: sus hijos aparecen en cascada rápida (chips de herramientas del stack).
  - `data-scene`: escena de servicio en loop (ver abajo).
  Para animar algo nuevo, agrega el atributo; no crees otro componente cliente.
- **Escenas de servicios:** cada servicio tiene `scene` en `site.ts`. `service-scenes.tsx` (servidor) dibuja el
  **último cuadro** de cada escena y marca las piezas con `data-s`; `scene-timelines.ts` las anima en loop desde ahí
  (sostiene ~2.2s y se desvanece). `Node`, `Line` y `Badge` se exportan para reusar el mismo lenguaje visual: el
  pipeline Git → Tests → Docker → En línea de `stack.tsx` es una escena más (`data-scene="pipeline"`). Solo corren mientras la escena está en pantalla. Son `aria-hidden` y sus cifras
  son ilustrativas: no las presentes como resultados de clientes.
- **Hero:** entrada CSS al cargar (`.hero-in` en `globals.css`, retraso con `[--d:…]`). El `h1` solo sube, sin
  opacidad, para no retrasar el LCP.
- Botones: `active:scale-[0.97]` en `buttonClass`. Paquetes: `motion-safe:hover:-translate-y-1`.
- Reveals: 700–800ms, curva `dyty-out` (CustomEase del mismo `--ease-out`), `once: true`, disparan al 85% del
  viewport. Lo que ya está visible al cargar no se anima (evita parpadeo y no retrasa el LCP).
- Usa `useGSAP` (de `@gsap/react`) y `gsap.matchMedia` para que todo se limpie solo. Plugins registrados a nivel de
  módulo. La curva `dyty-out` se exporta como `ease` desde `scene-timelines.ts`.
- Lenis y `scroll-behavior: smooth` chocan: `globals.css` lo apaga con `html.lenis { scroll-behavior: auto }`.
- Lenis se mueve con `gsap.ticker` (`autoRaf: false`, `lagSmoothing(0)`) y avisa a ScrollTrigger en cada scroll.
- Los enlaces `#ancla` los maneja Lenis (`anchors: { offset: -96 }`, igual al `scroll-padding-top: 6rem`).
- Con `prefers-reduced-motion: reduce` no se activa Lenis y los reveals se muestran sin animar.
- El contenido debe verse sin JavaScript: los estados iniciales ocultos los pone GSAP, nunca el CSS o el HTML.

## Contenido

- No inventes cifras, testimonios ni clientes. Lo que falte va como placeholder entre corchetes: `[Desde $X USD]`.
- Casos actuales: Cristina Spa y Otium. EXED y Rocket se quitaron a pedido del usuario: no los vuelvas a poner.
- Pasa los textos nuevos por `humanizer` (que no suenen a IA).
- Contacto principal: WhatsApp (`whatsappLink()`); el formulario es secundario.

## Formulario y leads

`submitLead` valida en el servidor, devuelve `values` para no vaciar el formulario si hay errores (React 19
resetea el form tras la acción) y manda el lead en JSON a `LEAD_WEBHOOK_URL`. Sin esa variable solo lo registra en
los logs. Adjunta `utm_source`, `utm_medium` y `utm_campaign` de la URL. Tiene un campo trampa (`company_website`)
contra bots.

## Deploy (Dokploy)

- `output: "standalone"` + `Dockerfile` multi-etapa (node:22-alpine), puerto **3000**.
- `NEXT_PUBLIC_WHATSAPP_NUMBER` se incrusta al compilar: va como **Build Arg**, no solo como env.
- `LEAD_WEBHOOK_URL` va como variable de entorno.
- `public/` puede no existir en git (carpeta vacía); el Dockerfile la crea con `mkdir -p public`.
- `.dockerignore` excluye `.claude`, `docs`, `CLAUDE.md` y `AGENTS.md` de la imagen.
- Dominio `dyty.dev` (DNS en otra cuenta de Hostinger) apuntando con un registro A a `2.25.121.251`; HTTPS con
  Let's Encrypt en Dokploy.
- No uses `vercel-deploy` ni publiques en servicios de terceros.

## Skills del proyecto (`.claude/skills/`)

Vienen de claude-webkit; ver `.claude/skills/ATTRIBUTION.md`. Son herramientas de conocimiento: no cambian tu rol
ni te hacen pausar el trabajo.

| Skill | Cuándo |
|---|---|
| `frontend-design` | Al diseñar o rediseñar secciones (evitar look genérico de IA) |
| `humanizer` | Al escribir o editar cualquier texto visible |
| `seo-audit` | Antes de publicar y al tocar metadata, headings o estructura |
| `vercel-react-best-practices` | Al escribir o revisar componentes React/Next |
| `web-design-guidelines` | Revisión de UI y accesibilidad |
| `animate` | Al construir cualquier animación (empieza por `RECIPES.md`) |
| `emil-design-eng` | Detalles de pulido: estados `:active`, easing, duraciones |
| `review-animations` | Revisión estricta del movimiento (solo manual) |
| `find-animation-opportunities` | Buscar dónde sí conviene animar (solo propone) |

**Precedencia** cuando dos fuentes chocan:
1. Sistema de diseño de este archivo.
2. `frontend-design` y la skill global `ui-ux-pro-max`, solo para lo que este archivo no define.

En movimiento manda `animate` / `emil-design-eng` sobre `frontend-design/reference/motion-design.md`.

## Antes de entregar

- [ ] lint, tsc y build sin errores
- [ ] Responsive a 375, 768, 1024 y 1440px, sin scroll horizontal
- [ ] Un solo `<h1>`; headings en orden; `alt` en imágenes; `aria-label` en botones solo-ícono
- [ ] Foco visible con teclado; objetivos táctiles ≥ 44px
- [ ] Contraste AA; `smoke` solo sobre negro
- [ ] `prefers-reduced-motion` respetado
- [ ] Sin sombras, degradados ni colores fuera de los tokens

## Pendientes

- Número real de WhatsApp (Build Arg en Dokploy), precios de Presencia y Ventas, confirmar `hola@dyty.dev`.
- "Plataformas educativas" se quedó sin caso tras quitar EXED.
- Logo definitivo (el actual en `logo.tsx` es provisional).
