import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[1200px] flex-col justify-center px-4 py-20 md:px-6">
      <div className="mx-auto w-full max-w-md">
        <Logo />
        <h1 className="display mt-10 text-[clamp(3rem,10vw,5rem)]">Panel</h1>
        <p className="mt-4 text-slate">Solo para el equipo de dyty.</p>
        <LoginForm />
      </div>
    </main>
  );
}
