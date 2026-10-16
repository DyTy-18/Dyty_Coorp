import type { Metadata } from "next";
import { Barlow_Condensed, Geist, Geist_Mono } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "dyty — Páginas web, leads y CRM en Bolivia",
    template: "%s · dyty",
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_419",
    url: site.url,
    siteName: site.name,
    title: "dyty — Páginas web, leads y CRM en Bolivia",
    description: site.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${barlowCondensed.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
