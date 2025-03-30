import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import LoadingBar from '@/components/LoadingBar';
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const meta = {
  title: "Zone 37",
  description:
    "Airsoft Arena: STALKER Zone is a meeting place for all who seek real adventures in the Zone. Join the ranks of stalkers, obtain valuable artifacts, complete tasks and beware of enemies. Our scenario games recreate the atmosphere of the STALKER world. Choose your path in the Exclusion Zone.",
  images: ["/open-graph.jpg"],
};

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  metadataBase: new URL("https://browsenchat.com"),
  icons: '/favicon_new.ico',
  robots: "index, follow",
  openGraph: {
    title: meta.title,
    description: meta.description,
    images: meta.images,
    url: "https://browsenchat.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: meta.title,
    description: meta.description,
    images: meta.images,
  },
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
        {/* ...existing head content... */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-gray-900 to-black text-white overflow-x-hidden`}
      >
        <LoadingBar />
        <Navigation />
        {children}
        <Footer />
        <div className="my-10 border-t border-gray-800 pt-6 text-center text-gray-400">
            &copy; {currentYear} Zone 37 Inc. California, US
        </div>
      </body>
    </html>
  );
}
