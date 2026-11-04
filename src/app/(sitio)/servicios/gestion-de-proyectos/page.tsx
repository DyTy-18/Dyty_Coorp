import type { Metadata } from "next";
import { ProjectsDemo } from "@/components/demos/projects-demo";
import { ServicePage } from "@/components/service-page";
import { servicePages } from "@/lib/site";

const page = servicePages.projects;
const path = `/servicios/${page.slug}`;
const title = "Software de gestión de proyectos a medida";

export const metadata: Metadata = {
  title,
  description: page.metaDescription,
  alternates: { canonical: path },
  openGraph: { type: "website", url: path, title, description: page.metaDescription },
};

export default function Page() {
  return <ServicePage page={page} demo={<ProjectsDemo />} />;
}
