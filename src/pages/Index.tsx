import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { IdentitySection } from '@/components/IdentitySection';
import { ProductsSection } from '@/components/ProductsSection';
import { ProcessSection } from '@/components/ProcessSection';
import { CommitmentSection } from '@/components/CommitmentSection';
import { AwardSection } from '@/components/AwardSection';
import { LocationsSection } from '@/components/LocationsSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <IdentitySection />
        <ProductsSection />
        <ProcessSection />
        <CommitmentSection />
        <AwardSection />
        <LocationsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
