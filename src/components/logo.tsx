import Image from "next/image";

// Logotipo para fondos claros (public/img/logos/logotipo-claro.png, 1600×605).
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/img/logos/logotipo-claro.png"
      alt="dyty"
      width={85}
      height={32}
      loading="eager"
      className={`h-8 w-auto ${className}`}
    />
  );
}
