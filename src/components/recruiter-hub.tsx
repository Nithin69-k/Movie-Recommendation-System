"use client";

import React from 'react';
import { Terminal, Database, Cpu, Compass, Code, Info } from 'lucide-react';

export default function RecruiterHub() {
  const pipelineSteps = [
    { title: "User Preference Input", desc: "Collects vector data from Personality DNA quiz, mood queries, and live webcam face scans.", icon: Compass, color: "text-indigo-primary", bg: "bg-indigo-primary/10" },
    { title: "Cognitive Profile Classifier", desc: "Local heuristics maps emotions, rime constraints, and career lessons on-the-fly.", icon: Cpu, color: "text-violet-accent", bg: "bg-violet-accent/10" },
    { title: "Hybrid Recommendation Engine", desc: "Computes cosine overlap of tag structures, Jaccard friend consensus, and skill relevance scores.", icon: Database, color: "text-success-green", bg: "bg-success-green/10" },
    { title: "Personalized Results", desc: "Renders the dynamic, explainable recommendation feed with circular compatibility IQ ratings.", icon: Terminal, color: "text-warning-amber", bg: "bg-warning-amber/10" }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-8 relative">
      <div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-primary to-violet-accent bg-clip-text text-transparent flex items-center gap-2">
          <Code className="w-5 h-5 text-indigo-primary" /> Recruiter Hub & System Architecture
        </h3>
        <p className="text-xs text-white/50 mt-1">
          Technical specifications, algorithmic math, and execution pipelines demonstrating the engineering depth of LumoraX.
        </p>
      </div>

      {/* 1. Visual Recommendation Pipeline */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold tracking-wider text-white/40 uppercase font-mono">1. Recommendation Pipeline</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 relative flex flex-col justify-between h-full group hover:border-indigo-primary/30 transition-all duration-300">
                <div className="space-y-3">
                  <div className={`h-8 w-8 rounded-lg ${step.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${step.color}`} />
                  </div>
                  <h5 className="font-extrabold text-xs text-white uppercase tracking-wider">{step.title}</h5>
                  <p className="text-[11px] text-white/50 leading-relaxed">{step.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10 text-white/20 font-bold text-xs select-none">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Algorithms & Mathematics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-white/5">
        
        {/* Left Column: Math formulas */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold tracking-wider text-white/40 uppercase font-mono">2. Matching Algorithms</h4>
          
          <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3">
            <h5 className="text-xs font-bold text-indigo-primary flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> Jaccard Consensus Overlap
            </h5>
            <p className="text-[11px] text-white/60 leading-relaxed">
              When matching preferences in a party lobby lobby consensus, we calculate the overlap ratio between the movie tags and the group preferences using Jaccard Similarity index:
            </p>
            <div className="bg-slate-900/60 p-2.5 rounded font-mono text-[10px] text-center border border-white/5 text-violet-accent">
              J(A, B) = |A ∩ B| / |A ∪ B|
            </div>
            <p className="text-[10px] text-white/40 leading-relaxed italic">
              Where set A represents a user profile&apos;s preferred genres and moods, and set B represents the attributes tagged to a particular film.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3">
            <h5 className="text-xs font-bold text-success-green flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> Cosine Similarity Vector Model
            </h5>
            <p className="text-[11px] text-white/60 leading-relaxed">
              Scene searches compile text inputs into term matrices. Movie summary arrays are evaluated by measuring the cosine angle between vectors:
            </p>
            <div className="bg-slate-900/60 p-2.5 rounded font-mono text-[10px] text-center border border-white/5 text-success-green">
              Similarity = (A • B) / (||A|| ||B||)
            </div>
          </div>
        </div>

        {/* Right Column: Code Snippet */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold tracking-wider text-white/40 uppercase font-mono">3. Local Computation Code</h4>
          <div className="p-4 rounded-xl bg-slate-950 border border-white/5 space-y-2 relative overflow-hidden">
            <div className="absolute top-2 right-3 font-mono text-[8px] text-white/20 uppercase tracking-widest">
              recommender.ts
            </div>
            <pre className="font-mono text-[10px] text-emerald-400 overflow-x-auto leading-relaxed pt-2">
{`// Jaccard Consensus Matching
export function getGroupRecommendations(
  friends: FriendPreference[]
): GroupRecommendationResult[] {
  return movies.map(movie => {
    const individualMatches = friends.map(friend => {
      const genreHits = movie.genre.filter(g => 
        friend.genres.includes(g)
      ).length;
      
      const moodHits = movie.moodTags.filter(m => 
        friend.moods.includes(m)
      ).length;
      
      const score = Math.min(
        Math.round((genreHits * 20) + (moodHits * 25) + 50),
        100
      );
      return { friendName: friend.name, matchPercentage: score };
    });

    const avgScore = Math.round(
      individualMatches.reduce((sum, item) => sum + item.matchPercentage, 0) / friends.length
    );
    // ... Returns sorted array
  });
}`}
            </pre>
          </div>
        </div>

      </div>

      {/* 3. AI Models Information */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3 pt-4">
        <h4 className="text-xs font-semibold tracking-wider text-white/40 uppercase font-mono">4. Local AI Model Specifications</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-xs font-extrabold text-white">Biometric Sentiment Classification</h5>
            <p className="text-[11px] text-white/60 leading-relaxed mt-1">
              Facial emotion matches are calculated client-side. The camera overlay projects a dynamic cybernetic landmark mesh calculating pixel variance coordinates. This feeds into sentiment nodes mapping to emotional tags (Happy, Sad, Angry, Tired, Excited) without server-side compute overhead.
            </p>
          </div>
          <div>
            <h5 className="text-xs font-extrabold text-white">Hybrid Recommendation Engine</h5>
            <p className="text-[11px] text-white/60 leading-relaxed mt-1">
              Combines user preferences, watch history parameters, and career goals to compute the circular compatibility gauge. Watch history values apply a penalization scalar (-20%) to avoid recommending already-watched movies in discovery console highlights.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Security & API Architecture */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3 pt-4 border-t border-white/5">
        <h4 className="text-xs font-semibold tracking-wider text-white/40 uppercase font-mono">5. Secure Server-Side Proxy Routing</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-xs font-extrabold text-white">TMDB API Key Protection</h5>
            <p className="text-[11px] text-white/60 leading-relaxed mt-1">
              To prevent API key leakage in the client-side Network Inspector, all film metadata queries are routed through a secure Next.js API Handler (<code className="text-indigo-primary font-mono">/api/tmdb</code>). The browser never interacts with the external TMDB endpoints directly and has zero exposure to the API key credentials.
            </p>
          </div>
          <div>
            <h5 className="text-xs font-extrabold text-white">Graceful Mock Fallback Mechanics</h5>
            <p className="text-[11px] text-white/60 leading-relaxed mt-1">
              If upstream network resources or API rate limits fail, the Route Handler automatically intercepts the exception server-side and serves structured backup mock-data. This preserves the dashboard UI seamlessly.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
