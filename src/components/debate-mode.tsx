"use client";

import React, { useState } from 'react';
import { Scale } from 'lucide-react';
import { movies } from '../data/movies';

export default function DebateMode() {
  const [movieAId, setMovieAId] = useState(movies[0].id);
  const [movieBId, setMovieBId] = useState(movies[1].id);

  const movieA = movies.find(m => m.id === movieAId) || movies[0];
  const movieB = movies.find(m => m.id === movieBId) || movies[1];

  const comparePoints = [
    { title: "Story & Narrative Structure", key: "story" as const },
    { title: "Visual & Cinematic Splendor", key: "visuals" as const },
    { title: "Scientific/Practical Realism", key: "science" as const },
    { title: "Emotional Resonance", key: "emotion" as const }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl relative">
      <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-primary to-violet-accent bg-clip-text text-transparent flex items-center gap-2 mb-4">
        <Scale className="w-5 h-5 text-indigo-primary" /> AI Debate Mode & Film Comparison
      </h3>

      {/* Selectors */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5 mb-6">
        <div className="w-full sm:w-[45%] flex flex-col gap-1.5">
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Focal Film A</span>
          <select 
            value={movieAId}
            onChange={(e) => setMovieAId(e.target.value)}
            className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-primary outline-none"
          >
            {movies.map(m => (
              <option key={m.id} value={m.id} disabled={m.id === movieBId}>{m.title}</option>
            ))}
          </select>
        </div>

        <div className="h-6 w-6 rounded-full bg-indigo-primary/20 flex items-center justify-center border border-indigo-primary/30 text-indigo-primary shrink-0 text-xs font-bold font-mono">
          VS
        </div>

        <div className="w-full sm:w-[45%] flex flex-col gap-1.5">
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Focal Film B</span>
          <select 
            value={movieBId}
            onChange={(e) => setMovieBId(e.target.value)}
            className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-primary outline-none"
          >
            {movies.map(m => (
              <option key={m.id} value={m.id} disabled={m.id === movieAId}>{m.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="space-y-4">
        {comparePoints.map((point) => {
          const contentA = movieA.debateData[point.key];
          const contentB = movieB.debateData[point.key];
          
          return (
            <div 
              key={point.key}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0"
            >
              <div className="col-span-1 md:col-span-2 text-xs font-bold text-indigo-primary/80 tracking-wider font-mono">
                {point.title}
              </div>
              
              <div className="p-3.5 rounded-lg bg-white/5 border border-white/5 space-y-1.5">
                <span className="text-[9px] uppercase font-bold text-violet-accent tracking-widest">{movieA.title}</span>
                <p className="text-xs text-white/80 leading-relaxed font-sans">{contentA}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-white/5 border border-white/5 space-y-1.5">
                <span className="text-[9px] uppercase font-bold text-purple-400 tracking-widest">{movieB.title}</span>
                <p className="text-xs text-white/80 leading-relaxed font-sans">{contentB}</p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
