import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import RealtimeCards from "@/components/sections/RealtimeCards";
import HowItWorks from "@/components/sections/HowItWorks";
import Stats from "@/components/sections/Stats";
import Features from "@/components/sections/Features";
import Comparison from "@/components/sections/Comparison";
import Testimonial from "@/components/sections/Testimonial";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import Blog from "@/components/sections/Blog";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <RealtimeCards />
        <Stats />
        <Features />
        <Comparison />
        <Testimonial />
        <Pricing />
        <FAQ />
        <Blog />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
