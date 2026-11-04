import { ArrowDown, ChevronDown, MessageCircle } from "lucide-react";
import Link from "next/link";
import { whatsappLink, type ServicePage as Page } from "@/lib/site";
import { Contact, Footer } from "./contact";
import { Header } from "./header";
import { Motion } from "./motion";
import { ButtonLink, Tag } from "./ui";

const pad = (n: number) => String(n + 1).padStart(2, "0");

// Molde de las páginas de servicio: portada, demo, qué incluye, caso (opcional), preguntas y contacto.
// El contenido sale de servicePages en site.ts; la demo es un componente cliente que se pasa como `demo`.
export function ServicePage({ page, demo }: { page: Page; demo: React.ReactNode }) {
  const cta = whatsappLink(page.whatsappText);

  return (
    <>
      <Header />
      <main>
        <section id="inicio" className="mx-auto max-w-[1200px] px-4 pt-10 pb-20 md:px-6 md:pt-16 md:pb-24">
          <nav aria-label="Ruta" className="hero-in label-mono text-slate">
            <Link href="/#servicios" className="hover:text-carbon hover:underline">
              Servicios
            </Link>{" "}
            / <span aria-current="page">{page.service}</span>
          </nav>
          <h1 className="hero-in hero-title display mt-6 max-w-5xl [--d:80ms] text-[clamp(3.5rem,9vw,7.5rem)]">
            {page.title}
            {page.titleAccent && <span className="block text-slate">{page.titleAccent}</span>}
          </h1>
          <p className="hero-in mt-8 max-w-xl text-lg [--d:200ms] leading-[1.33] text-slate">{page.intro}</p>
          <div className="hero-in mt-10 flex flex-wrap gap-3 [--d:280ms]">
            <ButtonLink href={cta} target="_blank" rel="noopener">
              <MessageCircle size={18} aria-hidden="true" />
              Quiero uno así
            </ButtonLink>
            <ButtonLink href="#demo" variant="ghost">
              Probar la demo
              <ArrowDown size={18} aria-hidden="true" />
            </ButtonLink>
          </div>
        </section>

        <section id="demo" className="rounded-t-[64px] bg-paper">
          <div className="mx-auto max-w-[1200px] px-4 pt-20 md:px-6 md:pt-24">
            <p className="label-mono text-slate">Demo</p>
            <h2 data-reveal="title" className="display mt-6 text-[clamp(3rem,7vw,5rem)]">
              Pruébalo
            </h2>
          </div>
          {/* La demo usa más ancho que el resto del contenido */}
          <div className="mx-auto mt-12 max-w-[1440px] px-4 pb-20 md:px-6 md:pb-24">{demo}</div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 py-20 md:px-6 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 data-reveal="title" className="display text-[clamp(3rem,7vw,5rem)]">
              Qué incluye
            </h2>
            <div>
              <p className="label-mono text-slate">Precio</p>
              <p className="mt-1 text-[28px] leading-[1.3] font-medium tracking-[-0.03em]">{page.price}</p>
            </div>
          </div>
          <ul data-reveal="stagger" className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {page.includes.map((item, i) => (
              <li key={item.title} className="rounded-[32px] bg-paper p-6 md:p-8">
                <span className="label-mono text-slate">[{pad(i)}]</span>
                <h3 className="mt-4 text-[28px] leading-[1.1] font-[450] tracking-[-0.03em] uppercase">{item.title}</h3>
                <p className="mt-3 text-slate">{item.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        {page.caseStudy && (
          <section className="bg-carbon text-paper">
            <div className="mx-auto flex max-w-[1200px] flex-wrap items-end justify-between gap-8 px-4 py-20 md:px-6 md:py-24">
              <div className="max-w-2xl">
                <p className="label-mono text-smoke">Caso real</p>
                <h2 data-reveal="title" className="display mt-6 text-[clamp(3rem,7vw,5rem)]">
                  {page.caseStudy.client}
                </h2>
                <p className="mt-6 text-lg text-smoke">{page.caseStudy.summary}</p>
              </div>
              <Tag>{page.service}</Tag>
            </div>
          </section>
        )}

        <section className="mx-auto grid max-w-[1200px] gap-12 px-4 py-20 md:px-6 md:py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <h2 data-reveal="title" className="display text-[clamp(3rem,7vw,5rem)]">
            Preguntas frecuentes
          </h2>
          <div className="flex flex-col gap-3">
            {page.faqs.map((f) => (
              <details key={f.q} className="group rounded-[32px] bg-paper">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-[32px] p-6 text-lg font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown
                    size={20}
                    aria-hidden="true"
                    className="shrink-0 transition-transform duration-200 ease-out group-open:rotate-180"
                  />
                </summary>
                <p className="px-6 pb-6 text-slate">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
      <Motion />
    </>
  );
}
