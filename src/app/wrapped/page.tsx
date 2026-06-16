"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Film, Clock, Award, RefreshCw, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import Link from 'next/link';

const wrappedSlides = [
  {
    id: "intro",
    type: "cover",
    bg: "radial-gradient(circle at 50% 50%, #6366F1 0%, #0B1020 100%)",
    title: "Your 2026 Entertainment Wrapped",
    subtitle: "Step inside your movie database footprint. Ready to discover your LumoraX profile?",
    icon: Sparkles,
    glowColor: "shadow-indigo-500/50"
  },
  {
    id: "stats",
    type: "stat",
    bg: "radial-gradient(circle at 50% 50%, #8B5CF6 0%, #0B1020 100%)",
    title: "You traveled deep into LumoraX...",
    metrics: [
      { label: "Total Screentime", val: "1,140 mins", desc: "Equivalent to 19 hours of cognitive immersion." },
      { label: "Titles Logged", val: "14", desc: "Across 6 unique genres and 3 documentary classes." }
    ],
    icon: Clock,
    glowColor: "shadow-violet-500/50"
  },
  {
    id: "genres",
    type: "genre",
    bg: "radial-gradient(circle at 50% 50%, #10B981 0%, #0B1020 100%)",
    title: "Your Top Genres Mapped Out",
    subtitle: "You prioritized cerebral structures over standard comedy blocks.",
    list: [
      { label: "1. Sci-Fi & Speculative Space", percentage: "55%" },
      { label: "2. Strategic Heist / Thriller", percentage: "25%" },
      { label: "3. Tech & Corporate Biographies", percentage: "20%" }
    ],
    icon: Film,
    glowColor: "shadow-emerald-500/50"
  },
  {
    id: "dna",
    type: "dna",
    bg: "radial-gradient(circle at 50% 50%, #F59E0B 0%, #0B1020 100%)",
    title: "Your Viewing Personality DNA",
    subtitle: "Stoic Thinker",
    desc: "You prioritize logical complexity, temporal paradoxes, and high-contrast atmospheric scores. Christopher Nolan is your spiritual director.",
    icon: Award,
    glowColor: "shadow-amber-500/50"
  },
  {
    id: "card",
    type: "summary",
    bg: "radial-gradient(circle at 50% 50%, #4F46E5 0%, #0B1020 100%)",
    title: "Your LumoraX Wrapped Card",
    subtitle: "Share your cinematic profile status with the sector.",
    icon: Share2,
    glowColor: "shadow-indigo-600/50"
  }
];

export default function WrappedPage() {
  const [slideIndex, setSlideIndex] = useState(0);

  const nextSlide = () => {
    if (slideIndex < wrappedSlides.length - 1) {
      setSlideIndex(slideIndex + 1);
    }
  };

  const prevSlide = () => {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    }
  };

  const resetSlides = () => {
    setSlideIndex(0);
  };

  const currentSlide = wrappedSlides[slideIndex];
  const Icon = currentSlide.icon;

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 md:px-6 relative overflow-hidden min-h-screen py-10" style={{ background: currentSlide.bg, transition: "background 0.8s ease-in-out" }}>
      
      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <Link 
          href="/dashboard" 
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-black/40 border border-white/10 hover:bg-black/60 transition-colors text-white/80 hover:text-white"
        >
          Exit Wrapped
        </Link>
      </div>

      {/* Slide Navigation Progress Indicators */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 w-full max-w-xs px-4">
        {wrappedSlides.map((_, idx) => (
          <div 
            key={idx}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              idx <= slideIndex ? "bg-cyan-accent" : "bg-white/10"
            }`}
          />
        ))}
      </div>

      {/* Main Slide Carousel container */}
      <div className="w-full max-w-lg z-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -15 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className={`glass-panel p-8 rounded-3xl border border-white/10 text-center relative overflow-hidden shadow-2xl ${currentSlide.glowColor} transition-shadow duration-700`}
          >
            {/* Top Glowing Icon */}
            <div className="h-16 w-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <Icon className="w-7 h-7 text-cyan-accent animate-pulse-slow" />
            </div>

            {/* Slide types rendering */}
            {currentSlide.type === "cover" && (
              <div className="space-y-6">
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase leading-none">
                  {currentSlide.title}
                </h1>
                <p className="text-sm text-white/60 leading-relaxed max-w-sm mx-auto">
                  {currentSlide.subtitle}
                </p>
                <button
                  onClick={nextSlide}
                  className="px-6 py-3 rounded-xl bg-cyan-accent text-black font-black text-xs uppercase tracking-wider hover:bg-cyan-accent/90 transition-all shadow-glow flex items-center gap-1.5 mx-auto mt-4"
                >
                  Initiate Recall <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {currentSlide.type === "stat" && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-white/80 uppercase tracking-widest font-mono">
                  {currentSlide.title}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {currentSlide.metrics?.map((m, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 text-left">
                      <div className="text-2xl font-black text-cyan-accent font-mono tracking-tight">{m.val}</div>
                      <div className="text-xs font-bold text-white/90 mt-1">{m.label}</div>
                      <p className="text-[10px] text-white/40 mt-1 leading-snug">{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentSlide.type === "genre" && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-white/80 uppercase tracking-widest font-mono">
                  {currentSlide.title}
                </h2>
                <div className="space-y-3 text-left">
                  {currentSlide.list?.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg bg-white/5 border border-white/5">
                      <div className="flex justify-between items-center text-xs font-semibold text-white">
                        <span>{item.label}</span>
                        <span className="text-pink-accent font-mono">{item.percentage}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-2">
                        <div className="bg-pink-accent h-full" style={{ width: item.percentage }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentSlide.type === "dna" && (
              <div className="space-y-6">
                <span className="text-[10px] text-cyan-accent uppercase tracking-widest font-mono block">Telemetry Result</span>
                <h2 className="text-3xl font-black text-white glow-purple uppercase tracking-tight">
                  {currentSlide.subtitle}
                </h2>
                <p className="text-sm text-white/70 leading-relaxed">
                  {currentSlide.desc}
                </p>
              </div>
            )}

            {currentSlide.type === "summary" && (
              <div className="space-y-6">
                {/* Shareable Card graphic */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-accent/20 via-purple-primary/25 to-pink-accent/20 border border-white/10 text-left space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-cyan-accent font-mono uppercase tracking-widest">LumoraX Wrapped</span>
                    <span className="text-[9px] text-white/50 font-mono">2026_SECTOR</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white leading-none">STOIC THINKER</h3>
                    <p className="text-[10px] text-white/60 mt-1.5">Top Genre: Sci-Fi & Space (55%)</p>
                  </div>
                  <div className="flex justify-between items-end border-t border-white/10 pt-3">
                    <div>
                      <div className="text-xs font-bold text-white">1,140 Mins Logged</div>
                      <div className="text-[9px] text-white/50">14 Unique Titles</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-cyan-accent">92.4% Accuracy</div>
                      <div className="text-[9px] text-white/50">Local IQ Index</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => alert("Card saved to device screenshots folder (Simulated).")}
                    className="px-4 py-2.5 rounded-lg bg-pink-accent text-white font-bold text-xs uppercase tracking-wider hover:bg-pink-accent/90 transition-all shadow-glow flex items-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share Profile
                  </button>
                  <button
                    onClick={resetSlides}
                    className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 hover:text-white transition-all text-xs font-bold uppercase"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Replay
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel control buttons */}
      <div className="flex gap-4 mt-6 z-1">
        <button
          onClick={prevSlide}
          disabled={slideIndex === 0}
          className={`p-3 rounded-full border transition-all ${
            slideIndex === 0 
              ? "opacity-30 border-white/5 text-white/20 cursor-not-allowed" 
              : "bg-black/40 border-white/10 text-white/80 hover:bg-black/60 hover:text-white"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          disabled={slideIndex === wrappedSlides.length - 1}
          className={`p-3 rounded-full border transition-all ${
            slideIndex === wrappedSlides.length - 1 
              ? "opacity-30 border-white/5 text-white/20 cursor-not-allowed" 
              : "bg-black/40 border-white/10 text-white/80 hover:bg-black/60 hover:text-white"
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
