'use client'

import React, {useState} from "react";
import Link from "next/link";
import Hamburger from "./ui/hamburger";
import { Button } from "./ui/button";
import { Sidebar } from "./ui/sidebar";

export default function Navbar() {

  const [sideBarOpen, setSidebarOpen] = useState(false);

  return (
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/5 border-b border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            {/* hamburger Icon */}
            <div className="md:hidden text-white text-lg">
              <Button onClick={() => setSidebarOpen(true)}>
                <Hamburger/>
              </Button>
            </div>

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

        {/* Side bar for mobile etc */}
        {sideBarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
      </header>
  );
}