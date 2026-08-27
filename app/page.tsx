import Nav from "@/components/nav";
import Hero from "@/components/hero";
import About from "@/components/about";
import Services from "@/components/services";
import Hospitals from "@/components/hospitals";
import Testimonials from "@/components/testimonials";
import Faq from "@/components/faq";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import TradeAxisBadge from "@/components/tradeaxis-badge";

export default function Home() {
  return (
    <main className="bg-bg">
      <Nav />
      <Hero />
      <About />
      <Services />
      <Hospitals />
      <Testimonials />
      <Faq />
      <Contact />
      <Footer />
      <TradeAxisBadge />
    </main>
  );
}
