"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Brain } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: { name: string; email: string; avatarUrl: string; provider: string }) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const { loginWithGoogle, loginWithMock } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleProviderLogin = async (provider: 'google' | 'github') => {
    if (provider === 'google') {
      await loginWithGoogle();
    } else {
      loginWithMock({
        name: 'Devin Carter',
        email: 'devin.carter@github.com',
        avatarUrl: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?q=80&w=120&auto=format&fit=crop',
        provider: 'github'
      });
    }
    // Fire callback for local tracking if any
    onLoginSuccess({
      name: provider === 'google' ? 'Alex Mercer' : 'Devin Carter',
      email: provider === 'google' ? 'alex.mercer@gmail.com' : 'devin.carter@github.com',
      avatarUrl: provider === 'google' 
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?q=80&w=120&auto=format&fit=crop',
      provider
    });
    onClose();
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    const profile = {
      name: email.split('@')[0],
      email: email,
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=120&auto=format&fit=crop',
      provider: 'email'
    };

    loginWithMock(profile);
    onLoginSuccess(profile);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-md rounded-2xl glass-panel p-6 border border-white/10 shadow-2xl bg-[#111827] text-white"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-white/50" />
          </button>

          {/* Heading */}
          <div className="text-center space-y-2 mb-6 pt-2">
            <Brain className="w-10 h-10 text-indigo-primary mx-auto animate-pulse" />
            <h3 className="text-xl font-bold tracking-tight">Access LumoraX Intelligence</h3>
            <p className="text-xs text-white/40 max-w-[280px] mx-auto">
              Analyze viewing patterns, track metadata vectors, and explore the Content Universe.
            </p>
          </div>

          {/* Simulated login forms */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono tracking-widest text-white/40 block font-semibold">Email Address</label>
              <input 
                type="email" 
                placeholder="developer@lumorax.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input text-xs"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono tracking-widest text-white/40 block font-semibold">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input text-xs"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full py-2.5 rounded-lg bg-indigo-primary hover:bg-indigo-primary/95 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer"
            >
              Sign In with Email
            </button>
          </form>

          {/* Separator */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
            <span className="relative bg-[#111827] px-3 text-[10px] uppercase font-mono text-white/30 tracking-widest">or continue with</span>
          </div>

          {/* Auth Providers */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button 
              onClick={() => handleProviderLogin('google')}
              className="py-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold font-mono transition-all cursor-pointer text-center"
            >
              Google Auth
            </button>
            <button 
              onClick={() => handleProviderLogin('github')}
              className="py-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold font-mono transition-all cursor-pointer text-center"
            >
              GitHub Auth
            </button>
          </div>

          {/* Guest / Policy note */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40">
            <button 
              type="button"
              onClick={onClose}
              className="hover:text-indigo-primary font-bold transition-colors cursor-pointer"
            >
              ➔ Continue as Guest
            </button>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-success-green" /> SSL_SECURED
            </span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
