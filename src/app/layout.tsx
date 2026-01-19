import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rigsy - AI Road Companion for Truck Drivers",
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
  ],
  authors: [{ name: "Logixtecs Solutions LLC" }],
  openGraph: {
    title: "Rigsy - AI Road Companion for Truck Drivers",
    description:
      "The voice-first AI co-pilot designed for professional truck drivers. Handle ELD compliance, get health coaching, and never drive alone again.",
    url: "https://rigsy.ai",
    siteName: "Rigsy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rigsy - AI Road Companion for Truck Drivers",
    description:
      "The voice-first AI co-pilot designed for professional truck drivers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
