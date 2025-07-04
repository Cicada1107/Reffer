import { AuroraBackground } from "@/components/ui/aurora-background";
import FeatureGrid from "@/components/feature_grid";
import GlowingParticlesSection from "@/components/ui/glowing_particles";
import { Hero } from "@/components/hero";
import { MarqueeDemo } from "@/components/ui/marquee";
import GuideSection from "@/components/guide-section";

export default function Home() {
  return (
    <>
      {/* Aurora background for desktop only */}
      <div className="hidden lg:block">
        <AuroraBackground>
          <div className="min-h-screen w-full flex flex-col items-center p-3 bg-black">
            <Hero/>
            <FeatureGrid />
            <GuideSection />
            <GlowingParticlesSection />
            <MarqueeDemo />
          </div>
        </AuroraBackground>
      </div>
      
      {/* Static gradient background for mobile/tablet */}
      <div className="lg:hidden min-h-screen w-full flex flex-col items-center p-3 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        {/* Purple accent overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-purple-800/10"></div>
        <div className="relative z-10 w-full flex flex-col items-center">
          <Hero/>
          <FeatureGrid />
          <GuideSection />
          <GlowingParticlesSection />
          <MarqueeDemo />
        </div>
      </div>
    </>
  );
}
