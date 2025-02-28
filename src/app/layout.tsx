import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZONE 37",
  description: "STALKER-inspired airsoft events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en">
      <head>

        <link rel="icon" href="/logo.webp" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-gray-900 to-black text-white`}
      >
        <Navigation />
        {children}

        <div className="mb-10 border-t border-gray-800 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} Zone 37. All rights reserved. Inspired by STALKER 2.</p>
          <p className="mt-2 text-sm">This is a fan project and is not affiliated with GSC Game World.</p>
        </div>
      </body>
    </html>
  );
}
