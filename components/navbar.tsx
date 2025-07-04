'use client'

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Hamburger from "./ui/hamburger";
import { Button } from "./ui/button";
import { Sidebar } from "./ui/sidebar";
import ProfileImage from "./ui/profile-image";
import Image from "next/image";

export default function Navbar() {
  const [sideBarOpen, setSidebarOpen] = useState(false);
  const sessionData = useSession();
  const session = sessionData.data;
  const status = sessionData.status;
  const router = useRouter();

  const handleSignIn = () => {
    signIn('google');
  };

  const handleSignOut = () => {
    signOut();
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handleLogoClick = () => {
    router.push('/');
  }

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
          <div className="flex items-center gap-2 cursor-pointer select-none">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={32} 
              height={32}
              onClick={handleLogoClick}
              className="cursor-pointer"
            />
            <span onClick={handleLogoClick} className="text-white font-semibold text-lg select-none">Reffer</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 text-sm font-medium text-white/80">
            <div className='flex items-center gap-5 py-2 px-4 rounded-full bg-black/10 backdrop-blur-md border border-zinc-600 text-white'>
                <Link href="/search">Search Referrals</Link>
                <Link href="/requests/sent">Sent Requests</Link>
                <Link href="/requests/received">Received Requests</Link>
            </div>
          </nav>

          {/* Authentication Actions */}
          <div className="flex items-center gap-3">
            {status === "loading" ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : session ? (
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <ProfileImage
                    src={session.user?.image}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-white/20 cursor-pointer hover:border-white/40 transition-colors"
                    onClick={handleProfileClick}
                  />
                  <div className="absolute right-0 top-full pt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                    <div className="bg-black/90 backdrop-blur-md border border-white/10 rounded-lg p-2">
                      <div className="flex flex-col gap-2 min-w-[120px]">
                        <button
                          onClick={handleProfileClick}
                          className="text-white text-sm hover:text-gray-300 transition-colors px-3 py-1 text-left"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="text-red-400 text-sm hover:text-red-300 transition-colors px-3 py-1 text-left"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-white/20 hover:border-white/40 text-white text-sm font-medium transition-all duration-300 backdrop-blur-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Side bar for mobile etc */}
      {sideBarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
    </header>
  );
}