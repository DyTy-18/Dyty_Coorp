import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LogOut, MessageCircle } from "lucide-react";
import { Logo } from "@/components/logo";
import { ButtonLink, Tag, buttonClass } from "@/components/ui";
import { getLeads, type Lead } from "@/lib/leads";
import { isLoggedIn } from "@/lib/session";
import { leadNeeds } from "@/lib/site";
import { logout } from "./actions";

const date = new Intl.DateTimeFormat("es-BO", { dateStyle: "medium", timeStyle: "short", timeZone: "America/La_Paz" });

// wa.me necesita el número con código de país; un celular boliviano de 8 dígitos se completa con 591
function waLink(lead: Lead) {
  let digits = lead.phone.replace(/\D/g, "");
  if (digits.length === 8) digits = `591${digits}`;
  const text = `Hola ${lead.name}, te escribo de dyty por el formulario de la web.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export default function PanelPage() {
  return (
    <>
      <header className="mx-auto flex h-24 max-w-[1200px] items-center justify-between gap-4 px-4 md:px-6">
        <Logo />
        <form action={logout}>
          <button type="submit" className={buttonClass("ghost")}>
            <LogOut size={18} aria-hidden="true" />
            Salir
          </button>
        </form>
      </header>
      <main className="mx-auto max-w-[1200px] px-4 pt-6 pb-20 md:px-6 md:pb-24">
        <Suspense fallback={<p className="label-mono text-slate">Cargando…</p>}>
          <Leads />
        </Suspense>
      </main>
    </>
  );
}

async function Leads() {
  if (!(await isLoggedIn())) redirect("/panel/login");
  const leads = await getLeads();

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h1 className="display text-[clamp(3rem,7vw,5rem)]">Leads</h1>
        <p className="label-mono text-slate">
          {leads.length} {leads.length === 1 ? "formulario" : "formularios"}
        </p>
      </div>

      {leads.length === 0 ? (
        <p className="mt-12 rounded-[32px] bg-paper p-6 text-slate md:p-8">
          Todavía no llegó ningún formulario. Cuando alguien lo llene en la web, aparece aquí.
        </p>
      ) : (
        <ol className="mt-12 rounded-[32px] bg-paper px-6 md:px-8">
          {leads.map((lead) => (
            <LeadRow key={lead.id} lead={lead} />
          ))}
        </ol>
      )}
    </>
  );
}

function LeadRow({ lead }: { lead: Lead }) {
  const need = leadNeeds.find((n) => n.value === lead.need)?.short ?? lead.need;
  const utm = [lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(" · ");

  return (
    <li className="flex flex-wrap items-start justify-between gap-x-8 gap-y-5 border-t border-ash py-6 first:border-t-0 md:py-8">
      <div className="min-w-0 flex-[1_1_320px]">
        <div className="flex flex-wrap items-center gap-3">
          <time dateTime={lead.createdAt} className="label-mono text-slate">
            {date.format(new Date(lead.createdAt))}
          </time>
          <Tag>{need}</Tag>
        </div>
        <h2 className="mt-4 text-[28px] leading-[1.1] font-[450] tracking-[-0.03em] break-words uppercase">{lead.name}</h2>
        {lead.business && <p className="mt-1 text-slate">{lead.business}</p>}
        {lead.message && <p className="mt-4 max-w-2xl whitespace-pre-line break-words">{lead.message}</p>}
        {utm && <p className="label-mono mt-4 text-slate">Origen: {utm}</p>}
      </div>

      <div className="flex flex-col items-start gap-2">
        <ButtonLink href={waLink(lead)} target="_blank" rel="noopener">
          <MessageCircle size={18} aria-hidden="true" />
          Escribir por WhatsApp
        </ButtonLink>
        <span className="label-mono text-slate">{lead.phone}</span>
      </div>
    </li>
  );
}
