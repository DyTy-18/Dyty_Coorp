import { GoogleTagManager } from "@next/third-parties/google";

// Solo las páginas públicas: /panel queda fuera para no medir visitas de administración.
const GTM_ID = "GTM-NRN3CLR9";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <GoogleTagManager gtmId={GTM_ID} />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
      {children}
    </>
  );
}
