import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import type { Scene } from "@/lib/site";

gsap.registerPlugin(CustomEase);

// Mismo --ease-out de globals.css; el in-out es para lo que se mueve dentro de la escena (el punto que viaja).
export const ease = CustomEase.create("dyty-out", "0.23,1,0.32,1");
const easeInOut = CustomEase.create("dyty-in-out", "0.77,0,0.175,1");

// Entrada estándar de una pieza: nunca desde scale(0).
const pop = { opacity: 0, y: 8, scale: 0.95, duration: 0.4 };
const badgeIn = { opacity: 0, scale: 0.9, duration: 0.3 };

type Q = (name: string) => HTMLElement[];
type Tl = gsap.core.Timeline;

// El punto recorre la línea (ver Line en service-scenes.tsx).
function travel(tl: Tl, rail: HTMLElement, at: gsap.Position = "+=0.2") {
  tl.fromTo(
    rail,
    { xPercent: 0, opacity: 1 },
    { xPercent: 100, duration: 0.8, ease: easeInOut, immediateRender: false },
    at,
  ).to(rail, { opacity: 0, duration: 0.15 });
}

// El nodo que recibe el punto se "enciende".
function arrive(tl: Tl, node: HTMLElement) {
  tl.to(node, { scale: 1.08, duration: 0.12 }, "<").to(node, { scale: 1, duration: 0.3 });
}

// Nodo → nodo → nodo, y la insignia del último confirma.
function chain(tl: Tl, q: Q) {
  const nodes = q("node");
  tl.from(nodes, { ...pop, stagger: 0.1 });
  q("rail").forEach((rail, i) => {
    travel(tl, rail);
    arrive(tl, nodes[i + 1]);
  });
  tl.from(q("badge"), badgeIn, "-=0.1");
}

const builds: Record<Scene | "pipeline", (tl: Tl, q: Q) => void> = {
  crm: chain,
  pipeline: chain,
  payments: chain,

  leads(tl, q) {
    const [, inbox] = q("node");
    const [rail] = q("rail");
    const counter = q("count")[0];
    tl.from(q("node"), { ...pop, stagger: 0.1 }).call(() => void (counter.textContent = "1"), undefined, 0);
    // El primer lead hace aparecer la insignia; los siguientes la incrementan.
    [1, 2, 3].forEach((n) => {
      travel(tl, rail, n > 1 ? "+=0.1" : "+=0.2");
      arrive(tl, inbox);
      if (n === 1) tl.from(q("badge"), badgeIn, "<");
      else tl.call(() => void (counter.textContent = String(n)), undefined, "<");
    });
  },

  web(tl, q) {
    const score = q("score")[0];
    tl.from(q("window"), { opacity: 0, y: 8, scale: 0.97, duration: 0.4 })
      .from(q("line"), { scaleX: 0, duration: 0.5, stagger: 0.12 })
      .from(q("box"), { ...pop, stagger: 0.08 }, "-=0.2")
      .from(q("badge"), badgeIn, "+=0.1")
      .call(() => void (score.textContent = "0"), undefined, 0)
      .to({}, { duration: 0.8, onUpdate() { score.textContent = String(Math.round(this.ratio * 100)); } }, "<");
  },

  dashboard(tl, q) {
    tl.from(q("bar"), { scaleY: 0, duration: 0.6, stagger: 0.06 }).from(q("badge"), badgeIn, "-=0.1");
  },

  lms(tl, q) {
    const [progress] = q("progress");
    const checks = q("check");
    tl.from(q("node"), pop)
      .set(progress, { scaleX: 0 }, 0)
      .from(checks[0], badgeIn);
    checks.slice(1).forEach((el, i, rest) => {
      tl.to(progress, { scaleX: (i + 1) / rest.length, duration: 0.6, ease: easeInOut }, "+=0.15").from(el, badgeIn, "-=0.1");
    });
    arrive(tl, q("node")[0]);
    tl.from(q("badge"), badgeIn, "<");
  },

  hosting(tl, q) {
    tl.from(q("node"), pop)
      .fromTo(q("ring"), { scale: 1, opacity: 0.6 }, { scale: 1.5, opacity: 0, duration: 1, repeat: 1, immediateRender: false })
      .from(q("task"), { ...pop, stagger: 0.35 }, "-=1.6")
      .from(q("badge"), badgeIn);
  },
};

// Loop pausado: lo reproduce y pausa motion.tsx según la escena esté en pantalla.
export function sceneTimeline(root: HTMLElement) {
  const q: Q = (name) => gsap.utils.toArray<HTMLElement>(`[data-s="${name}"]`, root);
  const tl = gsap.timeline({ paused: true, repeat: -1, defaults: { ease } });
  builds[root.dataset.scene as keyof typeof builds](tl, q);
  // Se sostiene el último cuadro y se desvanece antes de empezar de nuevo.
  return tl.to(root.firstElementChild, { opacity: 0, duration: 0.3 }, "+=2.2");
}
