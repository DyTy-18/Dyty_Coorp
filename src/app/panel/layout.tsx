import type { Metadata } from "next";

// Panel privado: no se enlaza desde el sitio y no se indexa.
export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export default function PanelLayout({ children }: LayoutProps<"/panel">) {
  return <div className="min-h-dvh bg-canvas">{children}</div>;
}
