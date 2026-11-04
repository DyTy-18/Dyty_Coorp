import Image from "next/image";
import type { ComponentProps } from "react";
import { hostinger } from "@/lib/site";

// Botones del sistema: planos, radio pequeño (4–8px), sin sombras.
const variants = {
  dark: "rounded-lg bg-carbon text-paper hover:bg-graphite",
  light: "rounded-lg bg-paper text-carbon hover:bg-mist",
  ghost: "rounded-[4px] border-[1.5px] border-slate text-slate hover:bg-carbon hover:text-paper hover:border-carbon",
};

type Variant = keyof typeof variants;

export function buttonClass(variant: Variant = "dark", extra = "") {
  return `inline-flex min-h-12 items-center justify-center gap-2 px-6 text-base font-medium transition-[color,background-color,border-color,scale] duration-150 ease-out active:scale-[0.97] ${variants[variant]} ${extra}`;
}

export function ButtonLink({ variant = "dark", className = "", ...props }: ComponentProps<"a"> & { variant?: Variant }) {
  return <a className={buttonClass(variant, className)} {...props} />;
}

// Sello de Hostinger Partner: siempre enlaza a nuestro link de referido.
export function HostingerBadge({ className = "", imageClassName = "" }: { className?: string; imageClassName?: string }) {
  return (
    <a
      href={hostinger.url}
      target="_blank"
      rel="noopener sponsored"
      className={`inline-block rounded-xl transition-[scale] duration-150 ease-out active:scale-[0.97] ${className}`}
    >
      <Image src={hostinger.badge} alt={hostinger.alt} width={160} height={60} className={`h-auto ${imageClassName}`} />
    </a>
  );
}

export function Tag({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`label-mono inline-flex rounded-full bg-mint px-3 py-1.5 text-carbon ${className}`}>{children}</span>;
}
