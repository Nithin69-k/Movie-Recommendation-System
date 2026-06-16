"use client";

import Link from "next/link";
import { Sparkles, Brain, Compass, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Compass },
    { name: "Chatbot", href: "/dashboard?tab=chat", icon: MessageSquare },
    { name: "Wrapped '26", href: "/wrapped", icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 backdrop-blur-md px-6 py-4 flex items-center justify-between">
      <Link href="/dashboard" className="flex items-center gap-2">
        <Brain className="w-7 h-7 text-indigo-primary glow-purple animate-pulse" />
        <span className="text-xl font-black bg-gradient-to-r from-indigo-primary via-violet-accent to-pink-accent bg-clip-text text-transparent tracking-wider">
          LUMORAX
        </span>
      </Link>

      <nav className="flex items-center gap-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href.includes('?tab=') && pathname + '?tab=chat' === item.href); // simple active check
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold transition-colors hover:text-indigo-primary duration-200 ${
                isActive ? "text-indigo-primary glow-purple" : "text-white/70"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs text-white/50 font-mono">INTELLIGENCE ACTIVE</span>
      </div>
    </header>
  );
}
