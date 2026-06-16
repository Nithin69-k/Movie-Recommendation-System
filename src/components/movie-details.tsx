"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Clock, Star, Brain, CheckCircle, ChevronRight, Network } from 'lucide-react';
import { Movie } from '../data/movies';
import { UserPreferences, calculateMovieIQ } from '../utils/recommender';

interface MovieDetailsProps {
  movie: Movie;
  onClose: () => void;
  userPrefs: UserPreferences;
}

export default function MovieDetails({ movie, onClose, userPrefs }: MovieDetailsProps) {
  const [activeSection, setActiveSection] = useState<'summary' | 'ending' | 'relations' | 'career'>('summary');
  
  // Calculate Movie IQ and Predictor metrics
  const iqResult = calculateMovieIQ(movie, userPrefs);
  const predictionScore = iqResult.score;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-4xl rounded-2xl glass-panel border border-white/10 overflow-hidden shadow-2xl my-8"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 border border-white/10 hover:bg-red-500 hover:text-white transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Section */}
        <div className="relative h-64 md:h-80 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-1" />
          <img 
            src={movie.imageUrl} 
            alt={movie.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute bottom-4 left-6 z-2 right-6">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-cyan-accent/20 border border-cyan-accent/30 text-cyan-accent">
              {movie.year}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-2 tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              {movie.title}
            </h2>
            <p className="text-white/60 text-sm mt-1">Directed by <span className="text-cyan-accent">{movie.director}</span></p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          
          {/* Left Panel: Statistics & Ratings */}
          <div className="space-y-6 md:border-r md:border-white/10 md:pr-6">
            {/* Quick Metadata */}
            <div className="flex justify-between items-center text-sm text-white/70 bg-white/5 p-3 rounded-lg border border-white/5">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-cyan-accent" />
                <span>{movie.runtime} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400" />
                <span>{movie.rating}/10</span>
              </div>
              <span className="text-xs text-white/50 bg-white/10 px-2 py-0.5 rounded uppercase font-mono">
                Popularity: {movie.popularity}
              </span>
            </div>

            {/* AI Movie Predictor (Feature 20) */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-accent/10 to-purple-primary/10 border border-cyan-accent/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold tracking-wider text-cyan-accent uppercase flex items-center gap-1.5">
                  <Brain className="w-4 h-4" /> AI Likability Predictor
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative flex items-center justify-center h-16 w-16">
                  {/* Circle outline */}
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="transparent" />
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="28" 
                      stroke="var(--color-cyan-accent)" 
                      strokeWidth="4" 
                      fill="transparent"
                      strokeDasharray="175"
                      strokeDashoffset={175 - (175 * predictionScore) / 100}
                    />
                  </svg>
                  <span className="text-md font-bold font-mono text-cyan-accent">{predictionScore}%</span>
                </div>
                <div>
                  <p className="text-xs text-white/80 font-medium">Likability Confidence</p>
                  <p className="text-[10px] text-white/50 mt-0.5">
                    {predictionScore >= 85 ? "🎯 Highly likely to become your favorite!" : "⭐ A solid selection worth your time."}
                  </p>
                </div>
              </div>
            </div>

            {/* Smart Recommendation Score (Movie IQ) & Explanation (Feature 14 & 18 & Design 10) */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
              <div>
                <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase">Why Recommended?</h3>
              </div>
              
              <div className="space-y-2.5">
                <div className="flex gap-2 items-center text-xs text-white/80 font-medium">
                  <CheckCircle className="w-4 h-4 text-success-green shrink-0" />
                  <span>Matches {movie.genre[0] || 'Drama'} preference</span>
                </div>
                <div className="flex gap-2 items-center text-xs text-white/80 font-medium">
                  <CheckCircle className="w-4 h-4 text-success-green shrink-0" />
                  <span>Vibe match with {movie.moodTags[0] || 'focused'} mood</span>
                </div>
                <div className="flex gap-2 items-center text-xs text-white/80 font-medium">
                  <CheckCircle className="w-4 h-4 text-success-green shrink-0" />
                  <span>Cognitive match: {movie.personalityTags[0] || 'logical'} profile</span>
                </div>
                <div className="flex gap-2 items-center text-xs text-white/80 font-medium">
                  <CheckCircle className="w-4 h-4 text-success-green shrink-0" />
                  <span>Similarity Index: {predictionScore}% Confidence</span>
                </div>
              </div>

              {iqResult.reasons.length > 0 && (
                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  <span className="text-[10px] text-white/40 uppercase font-mono block">Direct Alignment Insights</span>
                  {iqResult.reasons.map((reason, idx) => (
                    <p key={idx} className="text-[11px] text-white/60 leading-relaxed">• {reason}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Interactive Tabs */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            {/* Tabs */}
            <div className="flex border-b border-white/10 gap-4 overflow-x-auto">
              <button 
                onClick={() => setActiveSection('summary')}
                className={`pb-2.5 text-sm font-semibold tracking-wide border-b-2 transition-colors duration-200 shrink-0 ${
                  activeSection === 'summary' ? "text-cyan-accent border-cyan-accent glow-cyan" : "text-white/50 border-transparent hover:text-white/80"
                }`}
              >
                Spoiler-Free Details
              </button>
              <button 
                onClick={() => setActiveSection('ending')}
                className={`pb-2.5 text-sm font-semibold tracking-wide border-b-2 transition-colors duration-200 shrink-0 ${
                  activeSection === 'ending' ? "text-cyan-accent border-cyan-accent glow-cyan" : "text-white/50 border-transparent hover:text-white/80"
                }`}
              >
                Explain Ending (AI)
              </button>
              <button 
                onClick={() => setActiveSection('relations')}
                className={`pb-2.5 text-sm font-semibold tracking-wide border-b-2 transition-colors duration-200 shrink-0 ${
                  activeSection === 'relations' ? "text-cyan-accent border-cyan-accent glow-cyan" : "text-white/50 border-transparent hover:text-white/80"
                }`}
              >
                Character Universe
              </button>
              {movie.careerRelevance.length > 0 && (
                <button 
                  onClick={() => setActiveSection('career')}
                  className={`pb-2.5 text-sm font-semibold tracking-wide border-b-2 transition-colors duration-200 shrink-0 ${
                    activeSection === 'career' ? "text-cyan-accent border-cyan-accent glow-cyan" : "text-white/50 border-transparent hover:text-white/80"
                  }`}
                >
                  Career Insights
                </button>
              )}
            </div>

            {/* Tab Body */}
            <div className="min-h-[220px] py-2">
              <AnimatePresence mode="wait">
                
                {/* 1. Spoiler-Free Details (Feature 8) */}
                {activeSection === 'summary' && (
                  <motion.div
                    key="summary-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div>
                      <h4 className="text-xs font-semibold tracking-wider text-cyan-accent uppercase mb-1.5">Overview</h4>
                      <p className="text-sm text-white/80 leading-relaxed">{movie.summary}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-lg bg-white/5 border border-white/5">
                        <h4 className="text-xs font-semibold tracking-wider text-pink-accent uppercase mb-1 flex items-center gap-1.5">
                          <Play className="w-3 h-3" /> Why Watch
                        </h4>
                        <p className="text-xs text-white/75 leading-relaxed">{movie.whyWatch}</p>
                      </div>
                      <div className="p-3.5 rounded-lg bg-white/5 border border-white/5">
                        <h4 className="text-xs font-semibold tracking-wider text-purple-300 uppercase mb-1.5">Core Themes</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {movie.themes.map((t, idx) => (
                            <span key={idx} className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/80 border border-white/10 font-mono">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. Explain Ending (Feature 9) */}
                {activeSection === 'ending' && (
                  <motion.div
                    key="ending-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex gap-2">
                      <span className="font-bold">⚠️ AI SPOILER WARNING:</span>
                      <span>The ending sequence breakdown and timeline are fully exposed below!</span>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold tracking-wider text-cyan-accent uppercase mb-1">Ending Narrative Analysis</h4>
                      <p className="text-sm text-white/80 leading-relaxed font-sans">{movie.endingExplanation}</p>
                    </div>

                    {/* Timeline visualization */}
                    <div className="relative pl-6 border-l border-cyan-accent/30 space-y-4 mt-4 ml-2">
                      <h4 className="text-xs font-semibold tracking-wider text-cyan-accent/80 uppercase -ml-6 mb-2">Climax Event Timeline</h4>
                      {movie.endingTimeline.map((item, idx) => (
                        <div key={idx} className="relative">
                          {/* Timeline dot */}
                          <div className="absolute -left-[30px] top-1.5 h-3.5 w-3.5 rounded-full bg-cyan-accent border border-background shadow-glow animate-pulse" />
                          <div className="text-xs text-cyan-accent font-mono mb-0.5">{item.time}</div>
                          <p className="text-xs text-white/80">{item.event}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 3. Character Universe Relations (Feature 9 auxiliary graph details) */}
                {activeSection === 'relations' && (
                  <motion.div
                    key="relations-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <h4 className="text-xs font-semibold tracking-wider text-cyan-accent uppercase mb-2 flex items-center gap-1.5">
                      <Network className="w-4 h-4" /> Character Dynamic Relationships
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {movie.characterRelationships.map((rel, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/5 flex flex-col justify-between">
                          <div className="flex items-center gap-2 text-xs font-semibold">
                            <span className="text-cyan-accent">{rel.source}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-white/30" />
                            <span className="text-pink-accent">{rel.target}</span>
                          </div>
                          <p className="text-[11px] text-white/60 mt-1.5 font-mono">{rel.type}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 4. Career Insights (Feature 7 / 6 details) */}
                {activeSection === 'career' && (
                  <motion.div
                    key="career-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {movie.careerRelevance.map((careerInfo, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-purple-primary/10 border border-purple-primary/20 space-y-3">
                          <h4 className="text-sm font-bold text-white capitalize flex justify-between items-center">
                            <span>🚀 {careerInfo.career.replace('-', ' ')} Coach</span>
                            <span className="text-xs font-mono text-cyan-accent bg-cyan-accent/10 px-2 py-0.5 rounded">
                              Relevance: {careerInfo.relevanceScore}%
                            </span>
                          </h4>
                          <div className="flex gap-2 items-center text-xs text-white/70">
                            <span>Motivation level:</span>
                            <div className="flex-1 bg-white/10 h-2 rounded-full overflow-hidden">
                              <div className="bg-gradient-to-r from-cyan-accent to-pink-accent h-full" style={{ width: `${careerInfo.motivationScore}%` }} />
                            </div>
                            <span className="font-bold text-pink-accent font-mono">{careerInfo.motivationScore}/100</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-semibold text-white/40 tracking-wider">Lessons Learned:</span>
                            {careerInfo.lessons.map((lesson, lIdx) => (
                              <p key={lIdx} className="text-xs text-white/80 leading-snug pl-2 border-l border-cyan-accent/40">{lesson}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {movie.skillsTaught.length > 0 && (
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                        <h4 className="text-xs font-bold text-cyan-accent uppercase tracking-wider">Interactive Skill Modules</h4>
                        {movie.skillsTaught.map((skillInfo, idx) => (
                          <div key={idx} className="space-y-1">
                            <span className="text-xs font-semibold text-white/90">{skillInfo.skill} Mastery:</span>
                            {skillInfo.lessons.map((lesson, lIdx) => (
                              <p key={lIdx} className="text-xs text-white/70 pl-2 border-l border-white/20">{lesson}</p>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
          
        </div>
      </motion.div>
    </motion.div>
  );
}
