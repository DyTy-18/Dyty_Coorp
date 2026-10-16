"use client";

import { useActionState } from "react";
import { buttonClass } from "@/components/ui";
import { login, type LoginState } from "../actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-10 flex flex-col gap-5 rounded-[32px] bg-paper p-6 md:p-8">
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="label-mono">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={!!state.error}
          aria-describedby="password-error"
          className="min-h-12 w-full rounded-lg border-[1.5px] border-transparent bg-canvas px-4 py-3 text-carbon outline-none transition-colors duration-150 focus:border-carbon aria-[invalid=true]:border-error"
        />
        {state.error && (
          <p id="password-error" role="alert" className="text-sm text-error">
            {state.error}
          </p>
        )}
      </div>
      <button type="submit" disabled={pending} className={buttonClass("dark", "disabled:opacity-60")}>
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
