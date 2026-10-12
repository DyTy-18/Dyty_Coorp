"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { ease, sceneTimeline } from "./scene-timelines";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// Algo que ya se ve al cargar no se oculta: evita el parpadeo y no retrasa el LCP.
const belowFold = (el: Element) => el.getBoundingClientRect().top > window.innerHeight;

const once = (trigger: Element) => ({ trigger, start: "top 85%", once: true });

// Scroll suave + animaciones de scroll. No renderiza nada: lee los atributos de las secciones.
//   data-reveal="title"   → título display que sube línea por línea
//   data-reveal="stagger" → sus hijos directos aparecen escalonados
//   data-reveal="words"   → el texto se enciende palabra por palabra con el scroll
//   data-reveal="code"    → las líneas de <code> se escriben una por una
//   data-reveal="chips"   → sus hijos aparecen en cascada rápida (chips de herramientas)
//   data-scene            → escena de servicio en loop, solo mientras está en pantalla
export function Motion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Con movimiento reducido no hay Lenis ni animaciones: todo queda en su estado final y el scroll es nativo.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({ autoRaf: false, anchors: { offset: -96 } });
      const tick = (time: number) => lenis.raf(time * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      gsap.utils.toArray<HTMLElement>('[data-reveal="title"]').filter(belowFold).forEach((el) => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, { yPercent: 100, duration: 0.8, ease, stagger: 0.08, scrollTrigger: once(el) }),
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="stagger"]').filter(belowFold).forEach((el) => {
        gsap.from(el.children, { y: 40, opacity: 0, duration: 0.7, ease, stagger: 0.06, scrollTrigger: once(el) });
      });

      // Ligado a la posición del scroll, así que no hace falta filtrar lo que ya está visible.
      gsap.utils.toArray<HTMLElement>('[data-reveal="words"]').forEach((el) => {
        SplitText.create(el, {
          type: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.words, {
              opacity: 0.15,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
            }),
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="code"]').filter(belowFold).forEach((el) => {
        gsap.from(el.querySelectorAll("code > span"), {
          clipPath: "inset(0 100% 0 0)",
          duration: 0.25,
          ease: "none",
          stagger: 0.12,
          delay: 0.3,
          scrollTrigger: once(el),
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="chips"]').filter(belowFold).forEach((el) => {
        gsap.from(el.children, { opacity: 0, scale: 0.9, duration: 0.3, ease, stagger: 0.04, delay: 0.25, scrollTrigger: once(el) });
      });

      gsap.utils.toArray<HTMLElement>("[data-scene]").forEach((el) => {
        const tl = sceneTimeline(el);
        ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
        });
      });

      return () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });

    return () => mm.revert();
  });

  return null;
}
