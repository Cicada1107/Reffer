import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AuthSessionProvider from "@/components/session-provider";

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
  title: "Reffer",
  description: "Referral Finding Website Created by Arijit Dubey",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <AuthSessionProvider>
          <Navbar/>
          {children}
          <Footer/>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
