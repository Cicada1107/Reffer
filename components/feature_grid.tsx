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
} from "lucide-react";

const features = [
  {
    icon: Cloud,
    title: "Web",
    description: "One website. That's it. No countless apps.",
  },
  {
    icon: Network,
    title: "Networking",
    description: "Increase your professional network.",
  },
  {
    icon: Smartphone,
    title: "Phone Compatible",
    description: "Need a referral RIGHT NOW? Pull out your phone anywhere.",
  },
  {
    icon: Lock,
    title: "Completely Free",
    description: "No Paywall. We know how it feels.",
  },
  {
    icon: Calendar,
    title: "Save Time",
    description: "Invest your time in upskilling while we handle this.",
  },
  {
    icon: Share2,
    title: "Chat Feature",
    description: "Having doubts? Chat it out with them.",
  },
  {
    icon: BookOpen,
    title: "Simple & Efficient",
    description: "Save your efforts and energy. Intuitive UI and flow logic.",
  },
  {
    icon: Search,
    title: "Role Search",
    description: "Easily get referrals just from a single search.",
  },
];

const FeatureGrid: FC = () => {
  return (
    <div className="py-40 text-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="flex flex-col gap-4 cursor-pointer bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-sm hover:scale-[1.02] transition-transform"
            >
              <div className="bg-white/10 w-12 h-12 flex items-center justify-center rounded-lg">
                <Icon className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-lg text-white">{feature.title}</h3>
              <p className="text-sm text-gray-300">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureGrid;
