import { ArrowDown, MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site";
import { LeadFlow } from "./lead-flow";
import { ButtonLink } from "./ui";

export function Hero() {
  return (
    <section id="inicio" className="mx-auto max-w-[1200px] px-4 pt-10 pb-20 md:px-6 md:pt-16 md:pb-24">
      <div className="flex flex-wrap items-center gap-x-10 gap-y-12">
        <div className="min-w-0 flex-[1_1_520px]">
          <p className="hero-in label-mono text-slate">Desarrollo y automatización · Bolivia</p>
          <h1 className="hero-in hero-title display mt-6 [--d:80ms] text-[clamp(3.5rem,10vw,8.125rem)]">
            Web, leads y CRM en un solo sistema
          </h1>
          <p className="hero-in mt-8 max-w-md text-lg [--d:200ms] leading-[1.33] text-slate">
            Hacemos tu web y la conectamos con tus anuncios y tu WhatsApp. Cada cliente queda anotado y sabes qué
            anuncio te trajo cada venta.
          </p>
          <div className="hero-in mt-10 flex flex-wrap gap-3 [--d:280ms]">
            <ButtonLink href={whatsappLink()} target="_blank" rel="noopener">
              <MessageCircle size={18} aria-hidden="true" />
              Hablemos por WhatsApp
            </ButtonLink>
            <ButtonLink href="#webs" variant="ghost">
              Ver precios
              <ArrowDown size={18} aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>

        <div className="hero-in min-w-0 flex-[1_1_400px] [--d:360ms]">
          <LeadFlow />
        </div>
      </div>
    </section>
  );
}
