import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StructuredData from "@/components/StructuredData";
import SkipLink from "@/components/SkipLink";
import MotionProvider from "@/components/MotionProvider";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rigsy.ai"),
  title: {
    default: "Rigsy - AI Road Companion for Truck Drivers",
    template: "%s | Rigsy",
  },
  description:
    "The voice-first AI co-pilot designed for professional truck drivers. Handle ELD compliance, get health coaching, and never drive alone again.",
  keywords: [
    "truck driver",
    "ELD",
    "trucking",
    "AI companion",
    "voice assistant",
    "fleet management",
    "driver wellness",
    "HOS compliance",
    "trucking technology",
    "CDL driver",
    "long haul trucking",
    "driver safety",
    "FMCSA compliance",
    "driver fatigue",
    "trucking AI",
    "voice AI for trucking",
  ],
  authors: [{ name: "Logixtecs Solutions LLC" }],
  creator: "Logixtecs Solutions LLC",
  publisher: "Logixtecs Solutions LLC",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Rigsy - AI Road Companion for Truck Drivers",
    description:
      "The voice-first AI co-pilot designed for professional truck drivers. Handle ELD compliance, get health coaching, and never drive alone again.",
    url: "https://rigsy.ai",
    siteName: "Rigsy",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rigsy - AI Road Companion for Truck Drivers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rigsy - AI Road Companion for Truck Drivers",
    description:
      "The voice-first AI co-pilot designed for professional truck drivers. Handle ELD compliance, get health coaching, and never drive alone again.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://rigsy.ai",
  },
  category: "Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <SkipLink />
        <MotionProvider>
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
