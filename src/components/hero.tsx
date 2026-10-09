import { ArrowDown, MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site";
import { LeadFlow } from "./lead-flow";
import { ButtonLink } from "./ui";

export function Hero() {
  return (
    <section id="inicio" className="mx-auto max-w-[1200px] px-4 pt-10 pb-20 md:px-6 md:pt-16 md:pb-24">
      <div className="flex flex-wrap items-center gap-x-10 gap-y-12">
        <div className="min-w-0 flex-[1_1_520px]">
          <p className="label-mono text-slate">Desarrollo y automatización · LATAM</p>
          <h1 className="display mt-6 text-[clamp(3.5rem,10vw,8.125rem)]">
            Web, leads y CRM en un solo sistema
          </h1>
          <p className="mt-8 max-w-md text-lg leading-[1.33] text-slate">
            Conectamos tus anuncios, tu WhatsApp y tus datos para que ningún cliente se pierda y sepas qué está
            vendiendo.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={whatsappLink()} target="_blank" rel="noopener">
              <MessageCircle size={18} aria-hidden="true" />
              Hablemos por WhatsApp
            </ButtonLink>
            <ButtonLink href="#paquetes" variant="ghost">
              Ver paquetes
              <ArrowDown size={18} aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>

        <div className="min-w-0 flex-[1_1_400px]">
          <LeadFlow />
        </div>
      </div>
    </section>
  );
}
