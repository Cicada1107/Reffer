'use client'

import React, { useState } from "react";
import DonationModal from "./ui/donation-modal";

export default function Footer() {
  const [showDonationModal, setShowDonationModal] = useState(false);

  return (
    <>
      <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-12 border-t border-white/10 w-full relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col items-center space-y-8">
            {/* Logo Section */}
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <img 
                  src="/logo.svg" 
                  alt="Logo" 
                  className="h-10 w-10 transition-transform duration-300 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Reffer
              </span>
            </div>

            {/* Description */}
            <p className="text-center text-gray-400 max-w-md text-sm leading-relaxed">
              Connecting developers, building the future. Join our community of innovators and creators.
            </p>

            {/* Links */}
            <nav className="flex flex-wrap justify-center gap-8 text-sm font-medium">
              <a
                href="https://github.com/Cicada1107/Reffer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 hover:text-yellow-400 group"
              >
                <span className="text-lg">⭐</span>
                <span>Star or Request a feature</span>
              </a>
              
              <button
                id="footer-support-button"
                onClick={() => setShowDonationModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-red-500/20 hover:from-pink-500/30 hover:to-red-500/30 transition-all duration-300 hover:text-pink-300 group"
              >
                <span className="text-lg animate-pulse">❤️</span>
                <span>Support this Website</span>
              </button>
              
              <a
                href="https://www.linkedin.com/in/arijit-dubey-85471028a/"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 hover:text-blue-400 group"
              >
                <span className="text-lg">💼</span>
                <span>Get in touch: LinkedIn</span>
              </a>
            </nav>

            {/* Divider */}
            <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Bottom Section */}
            <div className="flex flex-col items-center space-y-2 text-center">
              <p className="text-sm text-gray-400">
                Made with <span className="text-red-400 animate-pulse">❤️</span> by{" "}
                <span className="font-semibold text-white">Arijit Dubey</span>
              </p>
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} Reffer. India. All rights reserved.
              </p>
            </div>

            {/* Social proof or stats (optional) */}
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Platform Online</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>Open Source</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>Made in India</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <DonationModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
      />
    </>
  );
}