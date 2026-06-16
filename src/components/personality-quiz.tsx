"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import { getPersonalityRecommendations } from '../utils/recommender';
import { Movie } from '../data/movies';

interface QuizQuestion {
  id: number;
  question: string;
  options: { text: string; score: { [key: string]: number } }[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "After a long, exhausting week, how do you recharge your energy?",
    options: [
      { text: "Diving into a deep book, solo gaming, or quiet reflection", score: { introvert: 2, logical: 1 } },
      { text: "Hanging out in a group, hosting a party, or talking with friends", score: { extrovert: 2, emotional: 1 } }
    ]
  },
  {
    id: 2,
    question: "You are planning a trip to a foreign country. What's your strategy?",
    options: [
      { text: "Mapping out a daily itinerary, bookings, and contingency plans", score: { planner: 2, safe: 1 } },
      { text: "Booking a one-way ticket and letting the destination guide you", score: { "risk-taker": 2, adventurous: 1 } }
    ]
  },
  {
    id: 3,
    question: "A friend is going through a tough breakup. What is your initial response?",
    options: [
      { text: "Listening deeply, validating their feelings, and sharing in their grief", score: { emotional: 2, introvert: 1 } },
      { text: "Helping them analyze the cause and providing actionable solutions", score: { logical: 2, planner: 1 } }
    ]
  },
  {
    id: 4,
    question: "If you had to pick a hobby, which one sounds most appealing?",
    options: [
      { text: "Extreme mountain biking, rock climbing, or skydiving", score: { adventurous: 2, "risk-taker": 1 } },
      { text: "Gardening, pottery, coding personal scripts, or painting", score: { safe: 2, planner: 1 } }
    ]
  }
];

interface PersonalityQuizProps {
  onProfileGenerated: (dna: string, recs: Movie[]) => void;
  savedDNA?: string;
  onMovieClick: (movie: Movie) => void;
}

export default function PersonalityQuiz({ onProfileGenerated, savedDNA, onMovieClick }: PersonalityQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<{ [key: string]: number }>({
    introvert: 0,
    extrovert: 0,
    planner: 0,
    "risk-taker": 0,
    emotional: 0,
    logical: 0,
    adventurous: 0,
    safe: 0
  });
  const [isCompleted, setIsCompleted] = useState(!!savedDNA);
  const [profileDNA, setProfileDNA] = useState(savedDNA || "");

  const handleAnswer = (scoreMap: { [key: string]: number }) => {
    // Accumulate scores
    const newScores = { ...scores };
    Object.keys(scoreMap).forEach(key => {
      newScores[key] = (newScores[key] || 0) + scoreMap[key];
    });
    setScores(newScores);

    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      calculateResult(newScores);
    }
  };

  const calculateResult = (finalScores: typeof scores) => {
    let dna = "Visionary Explorer"; // default

    const isIntrovert = finalScores.introvert > finalScores.extrovert;
    const isPlanner = finalScores.planner > finalScores["risk-taker"];
    const isLogical = finalScores.logical > finalScores.emotional;
    const isAdventurous = finalScores.adventurous > finalScores.safe;

    if (isIntrovert && isLogical && isPlanner) {
      dna = "Stoic Thinker";
    } else if (isIntrovert && !isLogical && !isAdventurous) {
      dna = "Empathetic Dreamer";
    } else if (!isIntrovert && !isLogical && isAdventurous) {
      dna = "Thrill Seeker";
    } else if (isLogical && isPlanner && !isAdventurous) {
      dna = "Analytical Strategist";
    } else {
      dna = "Visionary Explorer";
    }

    setProfileDNA(dna);
    setIsCompleted(true);
    const recs = getPersonalityRecommendations(dna).map(r => r.movie);
    onProfileGenerated(dna, recs);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setScores({
      introvert: 0,
      extrovert: 0,
      planner: 0,
      "risk-taker": 0,
      emotional: 0,
      logical: 0,
      adventurous: 0,
      safe: 0
    });
    setIsCompleted(false);
    setProfileDNA("");
  };

  // Get recommendations based on active profile DNA
  const recResults = profileDNA ? getPersonalityRecommendations(profileDNA) : [];

  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Sparkles className="w-40 h-40 text-cyan-accent" />
      </div>

      <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-accent to-pink-accent bg-clip-text text-transparent flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-cyan-accent" /> Entertainment DNA & Personality
      </h3>

      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <motion.div
            key="quiz-body"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs text-white/50 mb-1">
                <span>Quiz Progress</span>
                <span>Question {currentStep + 1} of {quizQuestions.length}</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-cyan-accent to-purple-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="min-h-[60px]">
              <h4 className="text-md md:text-lg font-medium text-white/90 leading-snug">
                {quizQuestions[currentStep].question}
              </h4>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-3">
              {quizQuestions[currentStep].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt.score)}
                  className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-accent/50 hover:bg-white/10 transition-all duration-200 text-sm text-white/85"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results-body"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Result DNA Banner */}
            <div className="p-6 rounded-xl bg-gradient-to-r from-cyan-accent/10 via-purple-primary/10 to-pink-accent/10 border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-xs text-white/50 uppercase tracking-widest font-mono">Your Entertainment DNA Profile</p>
                <h4 className="text-2xl font-extrabold text-cyan-accent mt-1 tracking-tight glow-cyan">
                  {profileDNA}
                </h4>
                <p className="text-xs text-white/60 mt-1">
                  {profileDNA === "Stoic Thinker" && "You enjoy structural logic, deep plot complexities, and cerebral character challenges."}
                  {profileDNA === "Empathetic Dreamer" && "You lean towards emotional honesty, high-fidelity human warmth, and artistic aesthetics."}
                  {profileDNA === "Thrill Seeker" && "You crave action-packed environments, high-stakes adrenaline, and fast-paced narratives."}
                  {profileDNA === "Analytical Strategist" && "You prefer calculated plots, detailed structures, business-oriented metrics, and mind games."}
                  {profileDNA === "Visionary Explorer" && "You match with wide-world scope explorations, sci-fi boundary pushing, and heroic adventures."}
                </p>
              </div>
              <button 
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/15 hover:border-cyan-accent/40 text-xs transition-colors duration-200"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retake Quiz
              </button>
            </div>

            {/* Recommendations Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider">DNA Curated Selections</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {recResults.slice(0, 3).map(({ movie, matchScore }) => (
                  <div 
                    key={movie.id} 
                    onClick={() => onMovieClick(movie)}
                    className="group relative rounded-xl overflow-hidden glass-panel border border-white/5 hover:border-cyan-accent/30 cursor-pointer transition-all duration-300"
                  >
                    <div className="relative h-36 w-full">
                      <img 
                        src={movie.imageUrl} 
                        alt={movie.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      />
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/75 border border-cyan-accent/20 text-[10px] text-cyan-accent font-mono">
                        {matchScore}% Match
                      </div>
                    </div>
                    <div className="p-3">
                      <h5 className="font-semibold text-sm text-white group-hover:text-cyan-accent transition-colors truncate">{movie.title}</h5>
                      <p className="text-[10px] text-white/50 mt-0.5">{movie.director} • {movie.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
