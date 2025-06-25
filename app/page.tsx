import { AuroraBackground } from "@/components/ui/aurora-background";
import FeatureGrid from "@/components/ui/feature_grid";
import GlowingParticlesSection from "@/components/ui/glowing_particles";
import { Hero } from "@/components/ui/hero";
import { MarqueeDemo } from "@/components/ui/marquee";

export default function Home() {
  return (
    //the problem is in aurora background.
    //<AuroraBackground> 
    <div className="min-h-screen w-full flex flex-col items-center p-3 bg-black">
      <Hero/>
      <FeatureGrid/>
      <GlowingParticlesSection />
      <MarqueeDemo/>
    </div>
  );
}
