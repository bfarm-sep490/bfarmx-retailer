import { HelpSection } from './HelpSection';
import { HeroGeometric } from './shape-landing-hero';

export const Home = () => {
  return (
    <div className="page home flex flex-col gap-12">
      {/* Hero Section */}
      <HeroGeometric
        badge="Notification"
        title1="BFarmX"
        title2=""
      />

      {/* How It Works Section */}
      <HelpSection />
    </div>
  );
};
