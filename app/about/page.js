import AboutHero from '@/components/about/AboutHero';
import AboutStory from '@/components/about/AboutStory';

import MeetOurTeam from '@/components/about/MeetOurTeam';
import OurValues from '@/components/about/OurValues';
import WhyChooseUsAbout from '@/components/about/WhyChooseUsAbout';
import CallToAction from '@/components/CallToAction';


export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <AboutHero />
      <AboutStory />
      <WhyChooseUsAbout/>
    <OurValues/>
    <MeetOurTeam />
    <CallToAction/>
   
    </main>
  );
}