// Logo provisional: wordmark condensado + punto amarillo. Reemplazar cuando exista el definitivo.
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-1 ${className}`}>
      <span className="display text-[34px]">dyty</span>
      <span aria-hidden="true" className="size-2.5 rounded-full bg-volt ring-1 ring-carbon" />
    </span>
  );
}
