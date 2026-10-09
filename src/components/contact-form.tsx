"use client";

import { useActionState } from "react";
import { submitLead, type LeadState } from "@/app/actions";
import { buttonClass } from "./ui";

const initialState: LeadState = { ok: false, message: "" };
const utmKeys = ["utm_source", "utm_medium", "utm_campaign"] as const;

const field =
  "w-full min-h-12 rounded-lg border-[1.5px] border-transparent bg-paper px-4 py-3 text-carbon outline-none transition-colors duration-150 placeholder:text-slate/70 focus:border-carbon aria-[invalid=true]:border-error";

export function ContactForm() {
  // Adjunta las UTMs de la visita para saber qué anuncio trajo el lead
  const [state, formAction, pending] = useActionState((prev: LeadState, formData: FormData) => {
    const params = new URLSearchParams(window.location.search);
    for (const k of utmKeys) formData.set(k, params.get(k) ?? "");
    return submitLead(prev, formData);
  }, initialState);

  if (state.ok) {
    return (
      <div role="status" className="rounded-[32px] bg-mint p-8 text-[28px] leading-[1.3] tracking-[-0.03em]">
        {state.message}
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5 rounded-[32px] bg-canvas p-6 md:p-8">
      <div className="flex flex-wrap gap-5">
        <div className="flex flex-[1_1_220px] flex-col gap-2">
          <label htmlFor="name" className="label-mono">Nombre</label>
          <input id="name" name="name" defaultValue={state.values?.name} autoComplete="name" required aria-invalid={!!state.errors?.name} aria-describedby="name-error" className={field} />
          {state.errors?.name && <p id="name-error" className="text-sm text-error">{state.errors.name}</p>}
        </div>
        <div className="flex flex-[1_1_220px] flex-col gap-2">
          <label htmlFor="phone" className="label-mono">WhatsApp</label>
          <input id="phone" name="phone" defaultValue={state.values?.phone} type="tel" autoComplete="tel" placeholder="+52 55 1234 5678" required aria-invalid={!!state.errors?.phone} aria-describedby="phone-error" className={field} />
          {state.errors?.phone && <p id="phone-error" className="text-sm text-error">{state.errors.phone}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="business" className="label-mono">Negocio <span className="text-slate">(opcional)</span></label>
        <input id="business" name="business" defaultValue={state.values?.business} autoComplete="organization" className={field} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="need" className="label-mono">¿Qué necesitas?</label>
        <select id="need" name="need" defaultValue={state.values?.need ?? ""} required aria-invalid={!!state.errors?.need} aria-describedby="need-error" className={field}>
          <option value="" disabled>Elige una opción</option>
          <option value="presencia">Una web nueva o más rápida (Presencia)</option>
          <option value="ventas">Dejar de perder leads de mis anuncios (Ventas)</option>
          <option value="sistema">Un CRM o sistema a medida</option>
          <option value="no-se">No estoy seguro, quiero asesoría</option>
        </select>
        {state.errors?.need && <p id="need-error" className="text-sm text-error">{state.errors.need}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="label-mono">Cuéntanos un poco <span className="text-slate">(opcional)</span></label>
        <textarea id="message" name="message" defaultValue={state.values?.message} rows={4} maxLength={2000} className={field} />
      </div>

      <div aria-hidden="true" className="hidden">
        <label htmlFor="company_website">No llenar</label>
        <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.message && (
        <p role="alert" className="text-sm text-error">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className={buttonClass("dark", "w-full disabled:opacity-60")}
      >
        {pending ? "Enviando…" : "Enviar"}
      </button>
    </form>
  );
}
