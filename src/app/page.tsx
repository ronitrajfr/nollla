import { CTA } from "@/components/cta";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { FAQ } from "@/components/faq";
import Image from "next/image";

export default function Home() {
  return (
    <main className="">
      <Hero />
      <Features />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
