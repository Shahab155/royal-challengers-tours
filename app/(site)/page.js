import ContactSection from "@/components/ContactForm";
import FAQSection from "@/components/FAQSection";
import FeaturedPackages from "@/components/FeaturedPakages";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import WhyChooseUs from "@/components/WhyChoose";
import bcrypt from 'bcryptjs';

export default function Home() {
   
  
  return (
   <>
   <Hero />
   <Gallery />
   <FeaturedPackages />
   
   <WhyChooseUs
  variant="home"
  title="The Royal Challengers Difference"
  subtitle="We craft unforgettable Dubai experiences with precision, luxury, and care."
/>
   <Testimonials />
   <FAQSection />
   <ContactSection />
   </>
  );
}
