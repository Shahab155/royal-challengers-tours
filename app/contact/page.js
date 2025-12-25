// app/contact/page.jsx
import ContactHero from '@/components/contact/ContactHero';
import ContactInfo from '@/components/contact/ContactInfo';
import ContactSection from '@/components/ContactForm';


export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <ContactHero />
      <ContactInfo />
      <ContactSection/>
    </main>
  );
}