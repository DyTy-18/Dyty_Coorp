import {
  BadgeCheck,
  Bot,
  CalendarCheck,
  Check,
  CreditCard,
  DatabaseBackup,
  GraduationCap,
  Inbox,
  Lock,
  Megaphone,
  MessageCircle,
  RefreshCw,
  Server,
  ShieldCheck,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Scene } from "@/lib/site";

// Ilustración animada de cada servicio: íconos que muestran la acción, casi sin texto.
// Aquí se dibuja el último cuadro (lo que se ve sin JS o con movimiento reducido); scene-timelines.ts lo anima en
// loop desde ahí. Los data-s marcan las piezas que se mueven.

type Tone = { dark: boolean };

type NodeProps = Tone & {
  icon: LucideIcon;
  label?: string;
  badge?: React.ReactNode;
  small?: boolean;
  tile?: string; // fondo del bloque si el de por defecto no contrasta con la superficie
};

export function Node({ icon: Icon, label, dark, badge, small, tile }: NodeProps) {
  const surface = tile ?? (dark ? "bg-carbon text-paper" : "bg-canvas text-carbon");
  return (
    <div data-s="node" className="flex shrink-0 flex-col items-center gap-2">
      <span className={`relative grid place-items-center rounded-2xl ${small ? "size-10" : "size-14"} ${surface}`}>
        <Icon size={small ? 18 : 24} strokeWidth={1.75} />
        {badge}
      </span>
      {label && <span className={`label-mono ${dark ? "text-ash" : "text-slate"}`}>{label}</span>}
    </div>
  );
}

// Insignia menta en la esquina de un nodo.
export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      data-s="badge"
      className="label-mono absolute -top-2 -right-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-mint px-1.5 whitespace-nowrap text-carbon"
    >
      {children}
    </span>
  );
}

export const check = <Check size={14} strokeWidth={3} />;

// Conector entre nodos. El punto vive en un riel del mismo ancho que la línea: mover el riel de xPercent 0 a 100
// lleva el punto de un extremo al otro.
export function Line({ dark }: Tone) {
  return (
    <div className="relative mb-6 h-px min-w-4 flex-1">
      <span className={`absolute inset-0 ${dark ? "bg-slate" : "bg-ash"}`} />
      <span data-s="rail" className="absolute inset-0 opacity-0">
        <span className={`absolute top-1/2 left-0 size-2.5 -translate-1/2 rounded-full ${dark ? "bg-mint" : "bg-carbon"}`} />
      </span>
    </div>
  );
}

function Flow({ children }: { children: React.ReactNode }) {
  return <div className="flex w-full max-w-md items-center gap-3">{children}</div>;
}

function CrmScene({ dark }: Tone) {
  return (
    <Flow>
      <Node dark={dark} icon={MessageCircle} label="WhatsApp" />
      <Line dark={dark} />
      <Node dark={dark} icon={Bot} label="Bot" />
      <Line dark={dark} />
      <Node dark={dark} icon={CalendarCheck} label="Agenda" badge={<Badge>{check}</Badge>} />
    </Flow>
  );
}

function LeadsScene({ dark }: Tone) {
  return (
    <Flow>
      <Node dark={dark} icon={Megaphone} label="Anuncio" />
      <Line dark={dark} />
      <Node
        dark={dark}
        icon={Inbox}
        label="CRM"
        badge={
          <Badge>
            +<span data-s="count">3</span>
          </Badge>
        }
      />
    </Flow>
  );
}

function PaymentsScene({ dark }: Tone) {
  return (
    <Flow>
      <Node dark={dark} icon={CreditCard} label="Tarjeta" />
      <Line dark={dark} />
      <Node dark={dark} icon={Lock} label="Stripe" />
      <Line dark={dark} />
      <Node dark={dark} icon={BadgeCheck} label="Pagado" badge={<Badge>{check}</Badge>} />
    </Flow>
  );
}

function WebScene({ dark }: Tone) {
  const surface = dark ? "bg-carbon" : "bg-canvas";
  return (
    <div data-s="window" className={`relative w-full max-w-60 rounded-xl ${surface}`}>
      <div className="flex gap-1.5 px-3 py-2.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className={`size-2 rounded-full ${dark ? "bg-slate" : "bg-ash"}`} />
        ))}
      </div>
      <div className="flex flex-col gap-2 px-3 pb-3">
        <span data-s="line" className={`h-2.5 w-2/3 origin-left rounded-full ${dark ? "bg-paper" : "bg-carbon"}`} />
        <span data-s="line" className={`h-2 w-1/2 origin-left rounded-full ${dark ? "bg-slate" : "bg-ash"}`} />
        <div className="mt-1 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <span key={i} data-s="box" className={`h-9 rounded-md ${dark ? "bg-graphite" : "bg-paper"}`} />
          ))}
        </div>
      </div>
      <span
        data-s="badge"
        className="label-mono absolute -top-3 -right-3 flex items-center gap-1 rounded-full bg-mint px-2 py-1 text-carbon"
      >
        <Zap size={12} strokeWidth={2.5} />
        <span data-s="score">100</span>
      </span>
    </div>
  );
}

const bars = [30, 42, 36, 52, 48, 64, 58, 76, 70, 92];

function DashboardScene({ dark }: Tone) {
  return (
    <div className="relative flex h-24 w-full max-w-md items-end gap-2">
      {bars.map((h, i) => (
        <span
          key={i}
          data-s="bar"
          className={`flex-1 origin-bottom rounded-md ${i === bars.length - 1 ? "bg-mint" : dark ? "bg-slate" : "bg-ash"}`}
          style={{ height: `${h}%` }}
        />
      ))}
      <span data-s="badge" className="absolute -top-6 left-0 grid size-9 place-items-center rounded-full bg-mint text-carbon">
        <TrendingUp size={18} strokeWidth={2.25} />
      </span>
    </div>
  );
}

function LmsScene({ dark }: Tone) {
  const steps = [0, 1, 2, 3];
  return (
    <div className="flex w-full max-w-md items-center gap-4">
      <div className="relative flex flex-1 items-center justify-between">
        <span className={`absolute inset-x-3 top-1/2 h-0.5 -translate-y-1/2 ${dark ? "bg-slate" : "bg-ash"}`} />
        <span
          data-s="progress"
          className={`absolute inset-x-3 top-1/2 h-0.5 origin-left -translate-y-1/2 ${dark ? "bg-mint" : "bg-carbon"}`}
        />
        {steps.map((i) => (
          <span
            key={i}
            className={`relative size-7 rounded-full border-[1.5px] ${dark ? "border-slate bg-graphite" : "border-ash bg-paper"}`}
          >
            <span
              data-s="check"
              className={`absolute -inset-[1.5px] grid place-items-center rounded-full ${
                dark ? "bg-mint text-carbon" : "bg-carbon text-paper"
              }`}
            >
              <Check size={14} strokeWidth={3} />
            </span>
          </span>
        ))}
      </div>
      <Node dark={dark} icon={GraduationCap} badge={<Badge>{check}</Badge>} />
    </div>
  );
}

const tasks = [DatabaseBackup, ShieldCheck, RefreshCw];

function HostingScene({ dark }: Tone) {
  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <span data-s="ring" className={`absolute inset-0 rounded-2xl border-2 opacity-0 ${dark ? "border-mint" : "border-carbon"}`} />
        <Node dark={dark} icon={Server} badge={<Badge>{check}</Badge>} />
      </div>
      <ul className="flex flex-col gap-2">
        {tasks.map((Icon, i) => (
          <li
            key={i}
            data-s="task"
            className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 ${dark ? "bg-carbon text-paper" : "bg-canvas text-carbon"}`}
          >
            <Icon size={16} strokeWidth={1.75} />
            <span className="grid size-4 place-items-center rounded-full bg-mint text-carbon">
              <Check size={10} strokeWidth={3} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const scenes: Record<Scene, (props: Tone) => React.JSX.Element> = {
  crm: CrmScene,
  leads: LeadsScene,
  web: WebScene,
  dashboard: DashboardScene,
  payments: PaymentsScene,
  lms: LmsScene,
  hosting: HostingScene,
};

export function ServiceScene({ scene, dark = false }: { scene: Scene; dark?: boolean }) {
  const Scene = scenes[scene];
  return (
    <div
      aria-hidden="true"
      data-scene={scene}
      className={`grid h-44 place-items-center rounded-[20px] px-6 select-none ${dark ? "bg-graphite" : "bg-paper"}`}
    >
      <Scene dark={dark} />
    </div>
  );
}
