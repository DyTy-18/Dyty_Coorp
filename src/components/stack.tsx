import {
  CodeXml,
  Container,
  Database,
  FlaskConical,
  GitBranch,
  Globe,
  MonitorSmartphone,
  ServerCog,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Fragment } from "react";
import { principles, stack } from "@/lib/site";
import { Badge, Line, Node, check } from "./service-scenes";

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

// Ícono de cada área del stack, en el mismo orden que `stack` en site.ts.
const areaIcons: LucideIcon[] = [MonitorSmartphone, ServerCog, Database, Workflow, Container];

// Lo que pasa después de escribir el código. Loop animado (pipeline en scene-timelines.ts).
const pipeline = [
  { icon: GitBranch, label: "Git" },
  { icon: FlaskConical, label: "Tests" },
  { icon: Container, label: "Docker" },
  { icon: Globe, label: "En línea" },
];

const spans = ["lg:col-span-2", "lg:col-span-2", "lg:col-span-2", "lg:col-span-3", "lg:col-span-3"];

export function Stack() {
  return (
    <section id="desarrollo" className="mx-auto max-w-[1200px] px-4 py-20 md:px-6 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label-mono text-slate">Desarrollo</p>
          <h2 data-reveal="title" className="display mt-6 text-[clamp(3rem,7vw,5rem)]">Así lo construimos</h2>
        </div>
        <p className="max-w-sm text-slate">
          Detrás de cada web y cada CRM hay código escrito a medida, versionado y desplegado en tu propio servidor.
        </p>
      </div>

      <div data-reveal="stagger" className="mt-12 flex flex-wrap gap-4">
        <figure data-reveal="code" className="flex min-w-0 flex-[1.4_1_520px] flex-col overflow-hidden rounded-[32px] bg-carbon">
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
                  {i === code.length - 1 && (
                    <span aria-hidden="true" className="cursor-blink ml-1 inline-block h-[1.1em] w-2 translate-y-[3px] bg-mint" />
                  )}
                </span>
              ))}
            </code>
          </pre>
          <div className="border-t border-graphite px-6 py-5">
            <p className="sr-only">Cada cambio pasa por Git, tests y Docker antes de quedar en línea.</p>
            <div aria-hidden="true" data-scene="pipeline">
              <div className="flex items-center gap-2">
                {pipeline.map(({ icon, label }, i) => (
                  <Fragment key={label}>
                    {i > 0 && <Line dark />}
                    <Node
                      dark
                      small
                      tile="bg-graphite text-paper"
                      icon={icon}
                      label={label}
                      badge={i === pipeline.length - 1 ? <Badge>{check}</Badge> : undefined}
                    />
                  </Fragment>
                ))}
              </div>
            </div>
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

      <ul data-reveal="stagger" className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {stack.map((group, i) => (
          <li key={group.area} className={`rounded-[32px] bg-paper p-6 md:p-8 ${spans[i] ?? "lg:col-span-2"}`}>
            <div className="flex items-start justify-between gap-4">
              <h3 className="display text-5xl">{group.area}</h3>
              <AreaIcon icon={areaIcons[i]} />
            </div>
            <p className="mt-3 text-sm leading-[1.3] text-slate">{group.description}</p>
            <ul data-reveal="chips" className="mt-6 flex flex-wrap gap-2">
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

function AreaIcon({ icon: Icon }: { icon?: LucideIcon }) {
  if (!Icon) return null;
  return (
    <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-2xl bg-canvas">
      <Icon size={22} strokeWidth={1.75} />
    </span>
  );
}
