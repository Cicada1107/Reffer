'use client'

import { Button } from "@/components/ui/button";
import FeatureGrid from "@/components/ui/feature_grid";
import GlowingParticlesSection from "@/components/ui/glowing_particles";
import Image from "next/image";

export default function Home() {
  return (
    <div className="pt-40 min-h-screen w-full flex flex-col items-center bg-black">
      {/*Hero Section*/}
      <section>
      <div className="text-center space-y-5 max-w-2xl z-10">
        <p className="py-1 px-2 bg-zinc-900/40 backdrop-blur-sm font-light rounded-full text-white inline-block">Reffer</p>
        <div className="space-y-3 ">
          <h1 className="text-7xl tracking-tight bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-blue-500 text-transparent h-20 font-semibold">Get Referrals. Fast.</h1>
          <h3 className="text-xl tracking-tight bg-clip-text bg-gradient-to-r from-purple-500 via-pink-400 to-blue-500 text-transparent h-20 font-semibold">Save your time. And your sanity.</h3>
        </div>

        <p className="text-gray-400 text-lg text-pretty">
          Stop wasting your time running behind referrals. Invest it in upskilling. Leave the rest to us.
        </p>

        <div className="space-x-3">
          <Button variant="default" className="rounded-lg">Start Now</Button>
          <Button variant="secondary" className="rounded-lg">Search Referrals</Button>
        </div>
      </div>
      </section>

      {/* Features Section */}
      <section className="mt-30 w-full h-full px-auto">
        <FeatureGrid />
      </section>

      {/* Call To Action */}
      <section className="mt-30 w-full h-full px-auto">
        <GlowingParticlesSection/>
      </section>
    </div>
  );
}
