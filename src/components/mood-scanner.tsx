"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Mic, Search, Film } from 'lucide-react';
import { getMoodRecommendations } from '../utils/recommender';
import { Movie } from '../data/movies';

interface MoodScannerProps {
  onMovieClick: (movie: Movie) => void;
}

const emojiMoods = [
  { emoji: "🥺", label: "Lonely" },
  { emoji: "😭", label: "Heartbroken" },
  { emoji: "😰", label: "Stressed" },
  { emoji: "😫", label: "Tired" },
  { emoji: "🔥", label: "Motivated" },
  { emoji: "🚀", label: "Adventurous" }
];

export default function MoodScanner({ onMovieClick }: MoodScannerProps) {
  const [textQuery, setTextQuery] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [recommendations, setRecommendations] = useState<{ movie: Movie; matchScore: number }[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const triggerSearch = (query: string, emoji?: string) => {
    const results = getMoodRecommendations(query, emoji);
    setRecommendations(results);
    setHasSearched(true);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textQuery && !selectedEmoji) return;
    triggerSearch(textQuery, selectedEmoji);
  };

  const selectEmoji = (emoji: string) => {
    setSelectedEmoji(emoji);
    triggerSearch(textQuery, emoji);
  };

  const startVoiceScan = () => {
    setIsRecording(true);
    setVoiceText("Listening for vocal tone...");
    
    // Simulate recording for 2 seconds
    setTimeout(() => {
      setIsRecording(false);
      const randomPhrases = [
        "I had a really long, exhausting day and need to relax.",
        "I feel like watching something inspiring and motivational.",
        "Feeling a bit lonely tonight and need comfort."
      ];
      const selectedPhrase = randomPhrases[Math.floor(Math.random() * randomPhrases.length)];
      setVoiceText(`Detected: "${selectedPhrase}"`);
      setTextQuery(selectedPhrase);
      triggerSearch(selectedPhrase, selectedEmoji);
    }, 2000);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl relative">
      <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-accent to-pink-accent bg-clip-text text-transparent flex items-center gap-2 mb-4">
        <Smile className="w-5 h-5 text-cyan-accent" /> AI Mood Scanner & Sound Scanner
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Input Panel */}
        <div className="space-y-4">
          <form onSubmit={handleTextSubmit} className="flex gap-2">
            <input 
              type="text"
              placeholder="Describe how you are feeling right now..."
              value={textQuery}
              onChange={(e) => setTextQuery(e.target.value)}
              className="flex-1 glass-input text-sm"
            />
            <button 
              type="submit"
              className="px-4 py-2.5 rounded-lg bg-cyan-accent/20 border border-cyan-accent/40 text-cyan-accent hover:bg-cyan-accent/30 transition-all font-semibold flex items-center gap-1.5 text-sm shrink-0"
            >
              <Search className="w-4 h-4" /> Scan
            </button>
          </form>

          {/* Emoji Grid */}
          <div>
            <span className="text-xs text-white/50 uppercase tracking-wider block mb-2 font-mono">Select Current Vibe</span>
            <div className="grid grid-cols-6 gap-2">
              {emojiMoods.map((m) => (
                <button
                  key={m.emoji}
                  onClick={() => selectEmoji(m.emoji)}
                  className={`py-2 text-xl rounded-xl border transition-all duration-200 ${
                    selectedEmoji === m.emoji 
                      ? "bg-cyan-accent/15 border-cyan-accent scale-105 shadow-glow" 
                      : "bg-white/5 border-white/5 hover:bg-white/10"
                  }`}
                  title={m.label}
                >
                  {m.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Input simulation */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-white/50 uppercase tracking-widest font-mono">Scan Voice Frequency</span>
              <p className="text-xs text-white/80">
                {isRecording ? (
                  <span className="text-cyan-accent animate-pulse-slow">{voiceText}</span>
                ) : (
                  voiceText || "Speak your mood to recommend content."
                )}
              </p>
            </div>
            <button
              onClick={startVoiceScan}
              disabled={isRecording}
              className={`p-3.5 rounded-full border transition-all shrink-0 ${
                isRecording 
                  ? "bg-red-500/20 border-red-500 text-red-500 animate-ping" 
                  : "bg-white/5 border-white/10 hover:border-cyan-accent/50 text-white/80 hover:text-white"
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="glass-panel p-4 rounded-xl bg-black/20 border-white/5 min-h-[180px]">
          <span className="text-xs text-white/50 uppercase tracking-wider block mb-3 font-mono">Mood Analysis Output</span>
          
          <AnimatePresence mode="wait">
            {!hasSearched ? (
              <motion.div 
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-6 text-white/30"
              >
                <Film className="w-10 h-10 mb-2 stroke-1" />
                <p className="text-xs">Type a mood or tap an emoji to output matched recommendations.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                {recommendations.slice(0, 3).map(({ movie, matchScore }) => (
                  <div
                    key={movie.id}
                    onClick={() => onMovieClick(movie)}
                    className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-accent/30 hover:bg-white/10 cursor-pointer flex items-center gap-3 transition-all duration-200"
                  >
                    <img src={movie.imageUrl} alt={movie.title} className="w-12 h-12 rounded object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-white truncate">{movie.title}</h4>
                      <p className="text-[10px] text-white/50 truncate">Match Score: {matchScore}%</p>
                    </div>
                    <span className="text-xs font-bold text-cyan-accent bg-cyan-accent/10 px-2 py-1 rounded shrink-0">
                      {matchScore}%
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
