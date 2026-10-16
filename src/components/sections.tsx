import { ArrowUpRight, Check } from "lucide-react";
import { cases, plans, services, tools, webPlans, whatsappLink, type Plan } from "@/lib/site";
import { ServiceScene } from "./service-scenes";
import { ButtonLink, Tag } from "./ui";

const pad = (n: number) => String(n + 1).padStart(2, "0");

export function Statement() {
  return (
    <section className="rounded-t-[64px] bg-paper">
      <div className="mx-auto max-w-[1200px] px-4 py-20 md:px-6 md:py-24">
        <div className="flex flex-wrap items-center justify-between gap-6 border-b border-ash pb-10">
          <p className="label-mono text-slate">Trabajamos con lo que ya usas</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-xl font-medium">
            {tools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </div>
        <p data-reveal="words" className="mt-16 max-w-5xl text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.1] font-[450] tracking-[-0.02em] uppercase">
          Convertimos anuncios, chats de WhatsApp y hojas de Excel en un sistema que vende{" "}
          <span className="text-slate">y que puedes medir.</span>
        </p>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section id="servicios" className="bg-paper">
      <div className="mx-auto max-w-[1200px] px-4 pb-20 md:px-6 md:pb-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 data-reveal="title" className="display text-[clamp(3rem,7vw,5rem)]">Servicios</h2>
          <p className="max-w-sm text-slate">Seis piezas que se conectan entre sí. Empieza por una y suma las demás.</p>
        </div>

        <ul data-reveal="stagger" className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const dark = s.wide;
            return (
              <li
                key={s.title}
                className={`flex flex-col gap-8 rounded-[32px] p-6 md:p-8 ${
                  dark ? "bg-carbon text-paper md:col-span-2" : "bg-canvas"
                }`}
              >
                <ServiceScene scene={s.scene} dark={dark} />
                <div className="flex flex-1 flex-col justify-between gap-8">
                  <div>
                    <span className={`label-mono ${dark ? "text-smoke" : "text-slate"}`}>[{pad(i)}]</span>
                    <h3 className="mt-4 text-[28px] leading-[1.1] font-[450] tracking-[-0.03em] uppercase">{s.title}</h3>
                    <p className={`mt-4 max-w-md ${dark ? "text-smoke" : "text-slate"}`}>{s.description}</p>
                  </div>
                  {s.cases.length > 0 && (
                    <p className="flex flex-wrap gap-2">
                      {s.cases.map((c) => (
                        <Tag key={c}>{c}</Tag>
                      ))}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function Cases() {
  return (
    <section id="casos" className="bg-carbon text-paper">
      <div className="mx-auto max-w-[1200px] px-4 py-20 md:px-6 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <h2 data-reveal="title" className="display max-w-3xl text-[clamp(3rem,7vw,5rem)]">Sistemas que ya están operando</h2>
          <ButtonLink
            variant="light"
            href={whatsappLink("Hola dyty, vi sus casos y quiero algo parecido para mi negocio.")}
            target="_blank"
            rel="noopener"
          >
            Quiero algo así
            <ArrowUpRight size={18} aria-hidden="true" />
          </ButtonLink>
        </div>

        <ol data-reveal="stagger" className="mt-14">
          {cases.map((c, i) => (
            <li
              key={c.client}
              className="flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-graphite py-8 last:border-b"
            >
              <span className="label-mono w-10 text-smoke">[{pad(i)}]</span>
              <h3 className="display w-full text-5xl sm:w-64">{c.client}</h3>
              <p className="min-w-0 flex-[1_1_280px] text-smoke">{c.summary}</p>
              <Tag>{c.tag}</Tag>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function PlanCard({ plan: p, index }: { plan: Plan; index?: number }) {
  const dark = p.featured;
  const muted = dark ? "text-smoke" : "text-slate";
  return (
    <li
      className={`flex flex-[1_1_300px] flex-col rounded-[32px] p-6 transition-[translate] duration-200 ease-out motion-safe:hover:-translate-y-1 md:p-8 ${dark ? "bg-carbon text-paper" : "bg-paper"}`}
    >
      {index !== undefined && <span className={`label-mono mb-4 ${muted}`}>[{pad(index)}]</span>}
      <div className="flex items-start justify-between gap-4">
        <h3 className="display text-5xl">{p.name}</h3>
        {dark && <Tag>Recomendado</Tag>}
      </div>
      <p className={`mt-4 text-sm leading-[1.3] ${muted}`}>{p.audience}</p>
      <p className="mt-10 text-[28px] leading-[1.3] font-medium tracking-[-0.03em]">{p.price}</p>
      {p.maintenance && <p className={`label-mono mt-1 ${muted}`}>{p.maintenance}</p>}
      {p.delivery && <p className={`label-mono mt-1 ${muted}`}>Entrega: {p.delivery}</p>}
      {p.note && <p className={`label-mono mt-1 ${muted}`}>{p.note}</p>}

      <ButtonLink
        variant={dark ? "light" : "dark"}
        href={whatsappLink(`Hola dyty, me interesa el paquete ${p.name}.`)}
        target="_blank"
        rel="noopener"
        className="mt-8"
      >
        {p.cta ?? "Me interesa"}
        <ArrowUpRight size={18} aria-hidden="true" />
      </ButtonLink>

      <ul className={`mt-8 flex flex-col gap-3 border-t pt-6 text-sm ${dark ? "border-graphite" : "border-ash"}`}>
        {p.features.map((f) => (
          <li key={f} className="flex gap-3">
            <span
              className={`grid size-5 shrink-0 place-items-center rounded-full ${dark ? "bg-mint text-carbon" : "bg-carbon text-paper"}`}
            >
              <Check size={12} strokeWidth={3} aria-hidden="true" />
            </span>
            {f}
          </li>
        ))}
      </ul>
    </li>
  );
}

export function Webs() {
  return (
    <div className="bg-paper">
      <section id="webs" className="rounded-t-[64px] bg-canvas">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-4 py-20 md:px-6 md:py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="label-mono text-slate">Desarrollo de páginas</p>
            <h2 data-reveal="title" className="display mt-4 text-[clamp(3rem,7vw,5rem)]">Páginas web</h2>
            <p className="mt-6 max-w-sm text-slate">
              Dos formas de empezar. Si más adelante quieres vender por Facebook e Instagram o tener un CRM, se construye
              sobre la misma web.
            </p>
            <ul className="mt-8 flex max-w-sm flex-col gap-3 border-t border-ash pt-6 text-sm text-slate">
              <li>El mantenimiento cubre cambios de texto y fotos, respaldos y actualizaciones.</li>
              <li>El hosting y el dominio se pagan aparte, a tu nombre.</li>
              <li>Precios en bolivianos. Si estás fuera de Bolivia, te cotizamos en dólares.</li>
            </ul>
          </div>

          <ul data-reveal="stagger" className="flex flex-wrap gap-4">
            {webPlans.map((p, i) => (
              <PlanCard key={p.name} plan={p} index={i} />
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export function Plans() {
  return (
    <section id="paquetes" className="mx-auto max-w-[1200px] px-4 pb-20 md:px-6 md:pb-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 data-reveal="title" className="display text-[clamp(3rem,7vw,5rem)]">Paquetes</h2>
        <p className="max-w-sm text-slate">Cuando la web ya no alcanza. Cada paquete crece hacia el siguiente.</p>
      </div>

      <ul data-reveal="stagger" className="mt-12 flex flex-wrap gap-4">
        {plans.map((p, i) => (
          <PlanCard key={p.name} plan={p} index={webPlans.length + i} />
        ))}
      </ul>
    </section>
  );
}
