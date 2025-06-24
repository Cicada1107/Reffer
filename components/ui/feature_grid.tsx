"use client";
import { FC } from "react";
import {
  Cloud,
  Share2,
  Lock,
  Calendar,
  Smartphone,
  BookOpen,
  Search,
  Network,
} from "lucide-react"; // Icon set

const features = [
  {
    icon: <Cloud className="w-6 h-6 text-white" />,
    title: "Web",
    description: "One website. That's it. No countless apps.",
  },
  {
    icon: <Network className="w-6 h-6 text-white" />,
    title: "Networking",
    description: "Increase your professional network.",
  },
  {
    icon: <Smartphone className="w-6 h-6 text-white" />,
    title: "Phone Compatible",
    description: "Need a referral RIGHT NOW? Pull out your phone anywhere.",
  },
  {
    icon: <Lock className="w-6 h-6 text-white" />,
    title: "Completely Free",
    description: "No Paywall. We know how it feels.",
  },
  {
    icon: <Calendar className="w-6 h-6 text-white" />,
    title: "Save Time",
    description: "Invest your time in upskilling while we handle this.",
  },
  {
    icon: <Share2 className="w-6 h-6 text-white" />,
    title: "Chat Feature",
    description: "Having doubts? Chat it out with them.",
  },
  {
    icon: <BookOpen className="w-6 h-6 text-white" />,
    title: "Simple & Efficient",
    description: "Save your efforts and energy. Simple UI and flow logic.",
  },
  {
    icon: <Search className="w-6 h-6 text-white" />,
    title: "Role Search",
    description: "Easily get referrals just from a single search.",
  },
];

const FeatureGrid: FC = () => {
  return (
    <section className="bg-black py-16 text-white">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors"
          >
            <div>{feature.icon}</div>
            <h3 className="font-semibold text-lg">{feature.title}</h3>
            <p className="text-sm text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureGrid;
