import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import Image from "next/image";

export default function Home() {
  const slidesData = [
    {
      title: "Mystic Mountains",
      button: "Explore Component",
      src: "https://images.unsplash.com/photo-1494806812796-244fe51b774d?q=80&w=3534&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Urban Dreams",
      button: "Explore Component",
      src: "https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Neon Nights",
      button: "Explore Component",
      src: "https://images.unsplash.com/photo-1590041794748-2d8eb73a571c?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Desert Whispers",
      button: "Explore Component",
      src: "https://images.unsplash.com/photo-1679420437432-80cfbf88986c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];


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
      <section className="w-full mt-30 bg-black">
        <Carousel slides={slidesData}/>
      </section>
    </div>
  );
}
