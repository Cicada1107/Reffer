import React from "react";
import Link from "next/link";
import { RiNextjsFill } from "react-icons/ri";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/5 border-b border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
            <span className="text-white font-semibold text-lg">Reffer</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 text-sm font-medium text-white/80">
            <div className='flex items-center gap-5 py-2 px-4 rounded-full bg-black/10 backdrop-blur-md border border-zinc-600 text-white'>
                <Link href="#">Search</Link>
                <Link href="#">Sent Requests</Link>
                <Link href="#">Received Requests</Link>
            </div>
          </nav>


          {/* Actions */}
        <Link href="#" className="text-white text-sm font-medium">
            Sign Up
        </Link>
        </div>
      </div>
    </header>
  );
}