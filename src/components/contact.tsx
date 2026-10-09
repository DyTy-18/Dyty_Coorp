import { MessageCircle } from "lucide-react";
import { nav, site, whatsappLink } from "@/lib/site";
import { ContactForm } from "./contact-form";
import { ButtonLink } from "./ui";

export function Contact() {
  return (
    <section id="contacto" className="rounded-t-[64px] bg-paper">
      <div className="mx-auto flex max-w-[1200px] flex-wrap gap-12 px-4 py-20 md:px-6 md:py-24">
        <div className="flex-[1_1_320px]">
          <p className="label-mono text-slate">Contacto</p>
          <h2 className="display mt-6 text-[clamp(3rem,7vw,5rem)]">Cuéntanos qué necesita tu negocio</h2>
          <p className="mt-6 max-w-sm text-slate">
            Lo más rápido es WhatsApp. Si prefieres, deja tus datos y te escribimos nosotros.
          </p>
          <div className="mt-10 flex flex-col items-start gap-4">
            <ButtonLink href={whatsappLink()} target="_blank" rel="noopener">
              <MessageCircle size={18} aria-hidden="true" />
              Escribir por WhatsApp
            </ButtonLink>
            <a href={`mailto:${site.email}`} className="bg-volt px-1.5 py-0.5 font-medium hover:underline">
              {site.email}
            </a>
          </div>
        </div>
        <div className="flex-[1.3_1_380px]">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="overflow-hidden bg-carbon text-paper">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-start justify-between gap-8 px-4 pt-16 md:px-6">
        <p className="max-w-xs text-sm text-smoke">{site.description}</p>
        <nav aria-label="Pie de página">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-smoke transition-colors duration-150 hover:text-paper">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p aria-hidden="true" className="display mt-10 text-center text-[clamp(8rem,38vw,30rem)] leading-[0.8] select-none">
        dyty
      </p>

      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-4 border-t border-graphite px-4 py-6 md:px-6">
        <span className="label-mono text-smoke">© 2026 {site.domain}</span>
        <span className="label-mono text-smoke">Hecho en LATAM</span>
      </div>
    </footer>
  );
}
