import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Cases, Plans, Services, Statement } from "@/components/sections";
import { Contact, Footer } from "@/components/contact";
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
    </>
  );
}
