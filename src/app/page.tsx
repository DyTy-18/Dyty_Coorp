import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Cases, Plans, Services, Statement } from "@/components/sections";
import { Contact, Footer } from "@/components/contact";
import { Motion } from "@/components/motion";
import { Stack } from "@/components/stack";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Statement />
        <Services />
        <Cases />
        <Stack />
        <Plans />
        <Contact />
      </main>
      <Footer />
      {/* Al final de la página: corre cuando todo lo de arriba ya hidrató (SplitText modifica el DOM) */}
      <Motion />
    </>
  );
}
