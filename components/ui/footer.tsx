import React from "react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-8 border-t border-white/10 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
            <span className="text-lg font-semibold">Reffer</span>
          </div>

          {/* Links */}
          <nav className="flex gap-6 text-sm font-medium">
            <a href="#" className="hover:text-gray-400">
              Request a feature
            </a>
            <a href="#" className="hover:text-gray-400">
              Support this Website ❤️
            </a>
            <a href="https://www.linkedin.com/in/arijit-dubey-85471028a/" className="hover:text-gray-400">
              Get in touch: LinkedIn
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-gray-500">
            Made with ❤️ by Arijit Dubey
          </p>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Reffer. India. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}