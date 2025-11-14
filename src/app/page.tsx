import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import CareerPathSelector from '@/components/CareerPathSelector';
import QuickStartOptions from '@/components/QuickStartOptions';
import SuccessStories from '@/components/SuccessStories';
import LiveFeed from '@/components/LiveFeed';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <CareerPathSelector />
      <QuickStartOptions />
      <SuccessStories />
      <LiveFeed />
      <Footer />
    </main>
  );
}