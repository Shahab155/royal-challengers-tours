import AboutSection from "@/components/AboutSection";
import CTASection from "@/components/CallToAction";
import ContactSection from "@/components/ContactForm";
import FAQSection from "@/components/FAQSection";
import FeaturedTours from "@/components/FeaturedTours";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import OurServicesSection from "@/components/OurServicesSection";
import Testimonials from "@/components/Testimonials";
import WhyChooseUs from "@/components/WhyChoose";


export default function Home() {
   
  
  return (
   <>
  
   <Hero />
   {/* <AboutSection/> */}
   <OurServicesSection/>
   <FeaturedTours />
   <Gallery/>
   
   <WhyChooseUs
  variant="home"
  title="The Royal Challengers Difference"
  subtitle="We craft unforgettable Dubai experiences with precision, luxury, and care."
/>
   <Testimonials />
   <FAQSection />
   <ContactSection />
   <CTASection/>
   </>
  );
}
