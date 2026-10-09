import { Check, ChartColumn, Megaphone, MessageCircle, SquareKanban } from "lucide-react";
import { Tag } from "./ui";

// Recorrido de un lead por el sistema. Solo CSS (keyframes en globals.css), sin JS.
const steps = [
  { icon: Megaphone, title: "Anuncio en Meta", detail: "Alguien toca “Enviar mensaje”" },
  { icon: MessageCircle, title: "WhatsApp o formulario", detail: "El lead llega solo, con su UTM" },
  { icon: SquareKanban, title: "CRM", detail: "Se asigna y se le da seguimiento" },
  { icon: ChartColumn, title: "Dashboard", detail: "La venta se atribuye al anuncio" },
];

const ROW = 88; // alto de cada paso en px; el punto se mueve en múltiplos de esto

export function LeadFlow() {
  return (
    <div className="rounded-[32px] bg-carbon p-6 text-paper md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="label-mono text-smoke">Así viaja un lead</span>
        <span className="label-mono inline-flex items-center gap-2 text-smoke">
          <span className="pulse-dot size-2 rounded-full bg-volt [animation:pulse-dot_1.6s_ease-in-out_infinite]" />
          En vivo
        </span>
      </div>

      <ol className="relative mt-6" style={{ ["--row" as string]: `${ROW}px` }}>
        {/* Riel vertical que une los pasos */}
        <span
          aria-hidden="true"
          className="absolute left-6 w-px -translate-x-1/2 bg-graphite"
          style={{ top: ROW / 2, height: ROW * (steps.length - 1) }}
        />
        {/* El lead: un punto que recorre el riel */}
        <span
          aria-hidden="true"
          className="flow-dot absolute left-6 z-0 size-3 -translate-x-1/2 rounded-full bg-mint shadow-[0_0_0_6px_rgb(209_255_202/0.18)] [animation:flow-dot_8s_cubic-bezier(0.65,0,0.35,1)_infinite]"
          style={{ top: ROW / 2 - 6 }}
        />

        {steps.map(({ icon: Icon, title, detail }, i) => (
          <li
            key={title}
            className="flow-step flex items-center gap-4"
            style={{ height: ROW, animation: `flow-step-${i} 8s linear infinite` }}
          >
            <span
              className="relative z-10 grid size-12 shrink-0 place-items-center rounded-2xl"
              style={{
                background: "color-mix(in srgb, var(--color-mint) calc(var(--on) * 100%), var(--color-graphite))",
                color: "color-mix(in srgb, var(--color-carbon) calc(var(--on) * 100%), var(--color-smoke))",
              }}
            >
              <Icon size={20} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium">{title}</span>
              <span className="block text-sm text-smoke">{detail}</span>
            </span>
            <span
              aria-hidden="true"
              className="grid size-6 shrink-0 place-items-center rounded-full bg-mint text-carbon"
              style={{ opacity: "var(--on)", transform: "scale(calc(0.95 + var(--on) * 0.05))" }}
            >
              <Check size={14} strokeWidth={3} />
            </span>
          </li>
        ))}
      </ol>

      <div
        className="flow-step mt-4 flex flex-wrap items-center gap-2 border-t border-graphite pt-5"
        style={{ animation: "flow-step-3 8s linear infinite" }}
      >
        <span className="text-sm text-smoke">Resultado:</span>
        <span style={{ opacity: "calc(0.25 + var(--on) * 0.75)" }}>
          <Tag>Venta atribuida · Campaña de Meta</Tag>
        </span>
      </div>
    </div>
  );
}
