import { CodeXml } from "lucide-react";
import { principles, stack } from "@/lib/site";

// Fragmento real del tipo de código que entregamos: webhook de Meta Lead Ads → CRM → WhatsApp.
// Cada línea es una lista de [tipo, texto] para colorearla sin cargar un resaltador.
type Token = [kind: "k" | "s" | "f" | "c" | "p", text: string];

const code: Token[][] = [
  [["c", "// app/api/leads/meta/route.ts"]],
  [["k", "export async function "], ["f", "POST"], ["p", "(req: Request) {"]],
  [["p", "  "], ["k", "const "], ["p", "{ leadgenId, adId } = "], ["k", "await "], ["f", "parseMetaWebhook"], ["p", "(req);"]],
  [["p", "  "], ["k", "const "], ["p", "lead = "], ["k", "await "], ["p", "meta."], ["f", "getLead"], ["p", "(leadgenId);"]],
  [],
  [["p", "  "], ["k", "await "], ["p", "db.lead."], ["f", "create"], ["p", "({"]],
  [["p", "    data: { ...lead, source: "], ["s", "\"meta_ads\""], ["p", ", adId },"]],
  [["p", "  });"]],
  [],
  [["p", "  "], ["k", "await "], ["p", "whatsapp."], ["f", "send"], ["p", "(lead.phone, "], ["s", "\"bienvenida\""], ["p", ");"]],
  [["p", "  "], ["k", "return "], ["p", "Response."], ["f", "json"], ["p", "({ ok: "], ["k", "true"], ["p", " });"]],
  [["p", "}"]],
];

const tokenClass: Record<Token[0], string> = {
  k: "text-smoke",
  s: "text-mint",
  f: "text-paper font-medium",
  c: "text-smoke italic",
  p: "text-paper/85",
};

const spans = ["lg:col-span-2", "lg:col-span-2", "lg:col-span-2", "lg:col-span-3", "lg:col-span-3"];

export function Stack() {
  return (
    <section id="desarrollo" className="mx-auto max-w-[1200px] px-4 py-20 md:px-6 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label-mono text-slate">Desarrollo</p>
          <h2 className="display mt-6 text-[clamp(3rem,7vw,5rem)]">Así lo construimos</h2>
        </div>
        <p className="max-w-sm text-slate">
          Detrás de cada web y cada CRM hay código escrito a medida, versionado y desplegado en tu propio servidor.
        </p>
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <figure className="flex min-w-0 flex-[1.4_1_520px] flex-col overflow-hidden rounded-[32px] bg-carbon">
          <figcaption className="flex items-center justify-between gap-3 border-b border-graphite px-6 py-4">
            <span className="label-mono text-smoke">Lead de Meta → CRM → WhatsApp</span>
            <CodeXml size={18} className="text-smoke" aria-hidden="true" />
          </figcaption>
          <pre className="flex-1 overflow-x-auto p-6 font-mono text-[13px] leading-[1.7]">
            <code>
              {code.map((line, i) => (
                <span key={i} className="block min-h-[1.7em]">
                  <span aria-hidden="true" className="mr-5 inline-block w-5 text-right text-smoke/50 select-none">
                    {i + 1}
                  </span>
                  {line.map(([kind, text], j) => (
                    <span key={j} className={tokenClass[kind]}>
                      {text}
                    </span>
                  ))}
                </span>
              ))}
            </code>
          </pre>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-graphite px-6 py-4">
            <span className="label-mono inline-flex items-center gap-2 text-smoke">
              <span aria-hidden="true" className="size-2 rounded-full bg-mint" />
              Build OK
            </span>
            <span className="label-mono text-smoke">Docker · Dokploy</span>
            <span className="label-mono text-smoke">TypeScript</span>
          </div>
        </figure>

        <ol className="flex min-w-0 flex-[1_1_320px] flex-col gap-4">
          {principles.map((p, i) => (
            <li key={p.title} className="flex flex-1 flex-col justify-center rounded-[32px] bg-paper p-6">
              <span className="label-mono text-slate">[{String(i + 1).padStart(2, "0")}]</span>
              <h3 className="mt-3 text-[28px] leading-[1.1] font-[450] tracking-[-0.03em] uppercase">{p.title}</h3>
              <p className="mt-2 text-slate">{p.detail}</p>
            </li>
          ))}
        </ol>
      </div>

      <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {stack.map((group, i) => (
          <li key={group.area} className={`rounded-[32px] bg-paper p-6 md:p-8 ${spans[i] ?? "lg:col-span-2"}`}>
            <h3 className="display text-5xl">{group.area}</h3>
            <p className="mt-3 text-sm leading-[1.3] text-slate">{group.description}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {group.tools.map((tool) => (
                <li key={tool} className="rounded-full border-[1.5px] border-ash px-3 py-1.5 text-sm font-medium">
                  {tool}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
