"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Sparkles, ArrowRight, Cpu, Terminal, Compass, Briefcase } from 'lucide-react';

const careerTracks = [
  { id: 'software-engineer', name: 'Software Engineer', desc: 'Focus on high-pressure environments, debugging logic, and scalability.', icon: Terminal },
  { id: 'data-scientist', name: 'Data Scientist', desc: 'Explore predictive mathematics, space models, and data architectures.', icon: Cpu },
  { id: 'designer', name: 'Designer', desc: 'Focus on visual aesthetics, storytelling, and user interfaces.', icon: Compass },
  { id: 'entrepreneur', name: 'Entrepreneur', desc: 'Build resilience, negotiation stakes, team consensus, and scaling.', icon: Briefcase }
];

const genreList = ["Sci-Fi", "Drama", "Thriller", "Action", "Biography", "Comedy", "History", "Mystery"];
const skillList = ["Leadership", "Communication", "AI & Programming", "UI/UX Principles", "Product Growth", "Time Management"];

export default function Onboarding() {
  const { completeOnboarding, user } = useAuth();
  const [step, setStep] = useState(1);
  const [career, setCareer] = useState('software-engineer');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(["Sci-Fi", "Drama"]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["Leadership", "Communication"]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await completeOnboarding({
        career,
        favoriteGenres: selectedGenres,
        skillsOfFocus: selectedSkills
      });
    } catch (err) {
      console.error("Onboarding submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.onboarded) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel p-8 border border-white/10 shadow-2xl bg-[#0B1020] text-white overflow-hidden">
        
        {/* Glowing background highlights */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-indigo-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-violet-accent/10 rounded-full blur-3xl" />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-primary animate-pulse" />
            <span className="text-[10px] font-black text-white/50 font-mono tracking-widest uppercase">LumoraX Core Integration</span>
          </div>
          <span className="text-xs font-mono text-indigo-primary">Step {step} of 3</span>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white">Select Your Primary Career Path</h3>
                <p className="text-xs text-white/50 mt-1">We customize recommendation weights and lesson highlights based on your professional path.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {careerTracks.map((item) => {
                  const Icon = item.icon;
                  const isSelected = career === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setCareer(item.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex items-start gap-3.5 group select-none ${
                        isSelected 
                          ? 'bg-indigo-primary/10 border-indigo-primary shadow-lg shadow-indigo-primary/5' 
                          : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-primary text-black' : 'bg-white/5 text-white/60'} group-hover:scale-105 transition-transform shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">{item.name}</h4>
                        <p className="text-[10px] text-white/40 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white">Which Genres Excite You?</h3>
                <p className="text-xs text-white/50 mt-1">Select your favorite genre catalogs. We use this to compute consensus matching.</p>
              </div>

              <div className="flex flex-wrap gap-2.5 py-4">
                {genreList.map((genre) => {
                  const isSelected = selectedGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`px-4 py-2 rounded-full text-xs font-mono border transition-all select-none cursor-pointer ${
                        isSelected
                          ? 'bg-violet-accent/20 border-violet-accent text-white font-extrabold'
                          : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {genre} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white">Select Targeted Skills</h3>
                <p className="text-xs text-white/50 mt-1">Choose soft or technical skills you want to learn through the entertainment media.</p>
              </div>

              <div className="flex flex-wrap gap-2.5 py-4">
                {skillList.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-4 py-2 rounded-full text-xs font-mono border transition-all select-none cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-500 text-white font-extrabold'
                          : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {skill} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-8">
          <button
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            disabled={step === 1}
            className={`text-xs uppercase font-mono tracking-widest font-bold transition-all cursor-pointer ${
              step === 1 ? 'opacity-20 cursor-not-allowed' : 'text-white/60 hover:text-white'
            }`}
          >
            Back
          </button>
          
          <button
            onClick={handleNextStep}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg bg-indigo-primary hover:bg-indigo-primary/95 text-white text-xs uppercase font-mono tracking-widest font-black flex items-center gap-2 group transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <span>Activating Core...</span>
            ) : (
              <>
                <span>{step === 3 ? 'Finish Integration' : 'Continue'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
