import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "LumoraX — AI Entertainment Intelligence Platform",
  description: "Experience the next generation of entertainment discovery. Powered by AI personality mapping, facial scanners, semantic search, force-directed graphs, and friend compatibility scoring.",
  keywords: ["movie recommendations", "AI movie matcher", "mood scanner", "face emotion detection", "entertainment wrapped", "interactive movie graph"],
  authors: [{ name: "Antigravity Dev Team" }],
};

import { AuthProvider } from "../hooks/useAuth";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
