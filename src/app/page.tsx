import { Access } from "@/components/Access";
import { Architect } from "@/components/Architect";
import { Concept } from "@/components/Concept";
import { Facts } from "@/components/Facts";
import { FeaturedProperty } from "@/components/FeaturedProperty";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { News } from "@/components/News";
import { Voices } from "@/components/Voices";
import { Works } from "@/components/Works";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Concept />
        <Architect />
        <Facts />
        <Works />
        <FeaturedProperty />
        <Voices />
        <News />
        <Access />
      </main>
      <Footer />
    </>
  );
}
