"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { nav, whatsappLink } from "@/lib/site";
import { Logo } from "./logo";
import { ButtonLink } from "./ui";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-canvas/90 backdrop-blur-sm">
      <div className="mx-auto flex h-24 max-w-[1200px] items-center justify-between gap-4 px-4 md:px-6">
        <a href="#inicio" aria-label="dyty, ir al inicio">
          <Logo />
        </a>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-1 rounded-[48px] bg-paper p-1.5">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block rounded-[48px] px-5 py-2.5 font-medium text-slate transition-colors duration-150 hover:bg-mist hover:text-carbon"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href={whatsappLink()} target="_blank" rel="noopener">
            Escríbenos
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="grid size-12 place-items-center rounded-full bg-paper md:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-movil" aria-label="Móvil" className="mx-4 mb-4 rounded-[32px] bg-paper p-6 md:hidden">
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setOpen(false)} className="display block py-3 text-5xl">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <ButtonLink href={whatsappLink()} target="_blank" rel="noopener" className="mt-6 w-full">
            Escríbenos por WhatsApp
          </ButtonLink>
        </nav>
      )}
    </header>
  );
}
