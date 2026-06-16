"use client";

import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, Play, Users, Camera, Terminal, Brain, ArrowRight } from "lucide-react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated recommendation graph background effect on right side
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const nodeNames = [
      { text: "LumoraX Core", type: "core", val: 32 },
      { text: "Inception", type: "movie", val: 12 },
      { text: "Interstellar", type: "movie", val: 12 },
      { text: "Moneyball", type: "movie", val: 12 },
      { text: "The Social Network", type: "movie", val: 12 },
      { text: "Stoic Thinker DNA", type: "dna", val: 15 },
      { text: "Analytical DNA", type: "dna", val: 15 },
      { text: "Software Engineer", type: "career", val: 14 },
      { text: "Data Scientist", type: "career", val: 14 },
      { text: "Entrepreneur", type: "career", val: 14 },
      { text: "Leadership Skill", type: "skill", val: 10 },
      { text: "Psychology Skill", type: "skill", val: 10 },
    ];

    interface GraphNode {
      x: number;
      y: number;
      vx: number;
      vy: number;
      text: string;
      type: string;
      radius: number;
      pulse: number;
    }

    const nodes: GraphNode[] = nodeNames.map((n) => {
      const angle = Math.random() * Math.PI * 2;
      const radiusFromCenter = 80 + Math.random() * 120;
      return {
        x: width / 2 + Math.cos(angle) * radiusFromCenter,
        y: height / 2 + Math.sin(angle) * radiusFromCenter,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        text: n.text,
        type: n.type,
        radius: n.val,
        pulse: Math.random() * Math.PI,
      };
    });

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw grid lines
      ctx.strokeStyle = "rgba(99, 102, 241, 0.02)";
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 30) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
      }
      for (let i = 0; i < height; i += 30) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
      }

      // Update positions and apply gentle gravity pull towards center node (index 0)
      const center = nodes[0];
      nodes.forEach((node, idx) => {
        node.pulse += 0.02;

        if (idx !== 0) {
          const dx = center.x - node.x;
          const dy = center.y - node.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 10) {
            node.vx += (dx / dist) * 0.005;
            node.vy += (dy / dist) * 0.005;
          }
        }

        node.vx *= 0.98;
        node.vy *= 0.98;

        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 30 || node.x > width - 30) node.vx *= -1;
        if (node.y < 30 || node.y > height - 30) node.vy *= -1;
      });

      // Draw connection lines
      ctx.lineWidth = 1;
      nodes.forEach((node, i) => {
        nodes.forEach((otherNode, j) => {
          if (i >= j) return;
          const dist = Math.hypot(node.x - otherNode.x, node.y - otherNode.y);

          let isConnected = false;
          if (node.type === "core" || otherNode.type === "core") {
            isConnected = dist < 220;
          } else if (node.type === "movie" && otherNode.type === "career") {
            isConnected = dist < 160;
          } else if (node.type === "dna" && otherNode.type === "movie") {
            isConnected = dist < 160;
          } else if (node.type === "career" && otherNode.type === "skill") {
            isConnected = dist < 140;
          }

          if (isConnected) {
            const alpha = Math.max(0.05, 1 - dist / 220) * 0.25;
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach((node) => {
        const pulseVal = Math.sin(node.pulse) * 2;
        const currentRadius = node.radius + pulseVal;

        let color = "rgba(99, 102, 241, 0.85)";
        let glowColor = "rgba(99, 102, 241, 0.4)";
        if (node.type === "core") {
          color = "rgba(139, 92, 246, 0.95)";
          glowColor = "rgba(139, 92, 246, 0.5)";
        } else if (node.type === "career") {
          color = "rgba(16, 185, 129, 0.9)";
          glowColor = "rgba(16, 185, 129, 0.4)";
        } else if (node.type === "dna") {
          color = "rgba(245, 158, 11, 0.9)";
          glowColor = "rgba(245, 158, 11, 0.4)";
        }

        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 12;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(node.text, node.x, node.y + currentRadius + 12);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const highlightFeatures = [
    { title: "Personality AI", desc: "Maps cognitive viewing traits into complex Entertainment DNA configurations.", icon: Sparkles, color: "text-indigo-primary" },
    { title: "Mood Detection AI", desc: "Processes inputs, emojis, or webcam meshes to estimate emotional state variables.", icon: Camera, color: "text-violet-accent" },
    { title: "Group Watch Consensus", desc: "Simulates party watchlist overlays using cooperative Jaccard indices.", icon: Users, color: "text-success-green" },
    { title: "Career Learning Hub", desc: "Tags inspirational business lessons to scale engineering or startup motivations.", icon: Terminal, color: "text-warning-amber" }
  ];

  const pipeline = [
    { name: "User Settings", desc: "Profile DNA, Mood scans" },
    { name: "Personality DNA", desc: "Explorer vs. Stoic" },
    { name: "Vibe Matcher", desc: "Emotion heuristics" },
    { name: "Hybrid Predictor", desc: "Jaccard & Cosine" },
    { name: "Explainable Output", desc: "Similarity confidence %" }
  ];

  return (
    <div className="flex-1 flex flex-col justify-between items-center w-full relative min-h-screen">
      
      {/* Background Neon Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-primary/5 blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-violet-accent/5 blur-[120px] animate-pulse-slow pointer-events-none" />

      {/* Header navbar overlay */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <Brain className="w-7 h-7 text-indigo-primary glow-purple animate-pulse" />
          <span className="text-xl font-bold tracking-wider text-white font-mono">
            LUMORAX
          </span>
        </div>
        <span className="text-xs text-white/50 font-mono bg-white/5 px-3 py-1 rounded border border-white/5 uppercase tracking-widest">
          ENTERPRISE EDITION
        </span>
      </header>

      {/* Hero Section Split Layout */}
      <div className="max-w-7xl w-full mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1 z-1">
        
        {/* Left Copy Panel */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-indigo-primary font-mono uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> AI-Powered Entertainment Intelligence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-white"
          >
            Entertainment Intelligence, <br />
            <span className="bg-gradient-to-r from-indigo-primary via-violet-accent to-accent-pink bg-clip-text text-transparent glow-purple">
              Powered by AI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-white/60 text-base md:text-lg max-w-xl leading-relaxed font-sans"
          >
            Analyze, discover, and understand movies, shows, audiences, and trends through advanced AI-powered recommendation systems and analytics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-indigo-primary to-violet-accent hover:from-indigo-primary/95 hover:to-violet-accent/95 text-white font-extrabold text-sm rounded-xl flex items-center gap-2 tracking-wide uppercase transition-all duration-300 shadow-glow hover:scale-[1.02] cursor-pointer"
            >
              Explore Platform <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard?tab=discover"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-extrabold text-sm rounded-xl flex items-center gap-2 tracking-wide uppercase transition-all hover:bg-white/10 hover:border-white/20"
            >
              Watch Demo <Play className="w-3.5 h-3.5 text-white/80" />
            </Link>
          </motion.div>
        </div>

        {/* Right Animated Graph Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="lg:col-span-5 h-[350px] lg:h-[450px] w-full rounded-2xl border border-white/5 bg-slate-900/40 relative overflow-hidden glass-panel"
        >
          <div className="absolute top-4 left-4 z-10 font-mono text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-primary animate-ping" />
            <span>AI Mapping Vector Space</span>
          </div>
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </motion.div>

      </div>

      {/* Visual Pipeline Flowchart Section (Design landing checklist) */}
      <div className="w-full max-w-7xl mx-auto px-6 py-10 z-1 border-t border-white/5 shrink-0">
        <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono block mb-6 text-center">LumoraX Cognitive Processing Pipeline</span>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {pipeline.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex-1 p-4 rounded-xl bg-white/5 border border-white/5 text-center w-full">
                <span className="text-xs font-bold text-white uppercase block tracking-wider">{step.name}</span>
                <span className="text-[10px] text-white/40 font-mono mt-1 block">{step.desc}</span>
              </div>
              {idx < 4 && (
                <span className="hidden md:block text-white/20 text-xs font-bold">➔</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Features Overview */}
      <div className="max-w-7xl px-6 z-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full shrink-0">
        {highlightFeatures.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx + 0.5, duration: 0.5 }}
              className="glass-panel p-5 rounded-xl border border-white/5 flex flex-col justify-between"
            >
              <div>
                <Icon className={`w-7 h-7 ${feat.color} mb-3`} />
                <h3 className="font-extrabold text-xs text-white/90 uppercase tracking-wider mb-1.5">{feat.title}</h3>
                <p className="text-[11px] text-white/50 leading-relaxed">{feat.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bloomberg-Style Live Analytics Ticker */}
      <div className="w-full bg-slate-950/80 border-t border-white/10 py-3.5 overflow-hidden select-none z-10 font-mono text-[10px] text-white/50 tracking-wider shrink-0 mt-12">
        <motion.div 
          animate={{ x: [0, -1000] }} 
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          className="flex whitespace-nowrap gap-16 w-max"
        >
          {[
            "SYSTEMS_ONLINE // ENGINE_COMPILER: ACTIVE",
            "MARKET TREND: SCI-FI INTEL GROWTH +14.2% WEEKLY",
            "LUMORAX HYBRID RECOMMENDATION STICKINESS: 94.6%",
            "AUDIENCE SENTIMENT INDEX: +88% POSITIVE",
            "TRENDING SEARCH SYNERGY: INTERSTELLAR (1.4M SECTOR LOGS)",
            "COGNITIVE DNA RUNNING: 24.8K PROFILES EVALUATED IN DATABASE",
            "TMDB LIVE STREAM TUNNEL: PROXIED_SECURE",
            "SYSTEMS_ONLINE // ENGINE_COMPILER: ACTIVE"
          ].map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-primary animate-pulse" />
              <span>{item}</span>
            </span>
          ))}
        </motion.div>
      </div>

    </div>
  );
}
