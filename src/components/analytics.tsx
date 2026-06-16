"use client";

import React, { useState, useEffect } from 'react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import { BarChart2, TrendingUp, Award, Clock } from 'lucide-react';

// Sample metrics
const genreData = [
  { subject: 'Sci-Fi', A: 90, fullMark: 100 },
  { subject: 'Drama', A: 75, fullMark: 100 },
  { subject: 'Biography', A: 60, fullMark: 100 },
  { subject: 'Action', A: 85, fullMark: 100 },
  { subject: 'Thriller', A: 65, fullMark: 100 },
];

const watchTrendData = [
  { name: 'Mon', hours: 1.5 },
  { name: 'Tue', hours: 2.2 },
  { name: 'Wed', hours: 0.8 },
  { name: 'Thu', hours: 3.0 },
  { name: 'Fri', hours: 2.5 },
  { name: 'Sat', hours: 4.8 },
  { name: 'Sun', hours: 3.5 },
];

export default function AnalyticsDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="glass-panel p-6 rounded-2xl h-[350px] flex items-center justify-center text-white/40">
        Loading analytics engine...
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl relative">
      <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-accent to-pink-accent bg-clip-text text-transparent flex items-center gap-2 mb-4">
        <BarChart2 className="w-5 h-5 text-cyan-accent" /> Entertainment Intelligence Analytics
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        
        {/* KPI 1 */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
          <Clock className="w-8 h-8 text-cyan-accent shrink-0" />
          <div>
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Total Watch Time</span>
            <h4 className="text-xl font-extrabold text-white mt-0.5">18.3 Hours</h4>
            <span className="text-[9px] text-emerald-400 font-mono">+12% vs last week</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-pink-accent shrink-0" />
          <div>
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Prediction Accuracy</span>
            <h4 className="text-xl font-extrabold text-white mt-0.5">92.4%</h4>
            <span className="text-[9px] text-cyan-accent font-mono">Updated via localized logs</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
          <Award className="w-8 h-8 text-purple-400 shrink-0" />
          <div>
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Entertainment IQ</span>
            <h4 className="text-xl font-extrabold text-white mt-0.5">142 IQ</h4>
            <span className="text-[9px] text-white/40 font-mono">Cerebral category focus</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Genre radar chart */}
        <div className="p-4 rounded-xl bg-[#111827] border border-white/5 flex flex-col">
          <span className="text-xs text-white/50 uppercase tracking-wider block mb-3 font-mono">Genre Focus Spectrum</span>
          <div className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={genreData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" stroke="rgba(255,255,255,0.6)" fontSize={10} />
                <PolarRadiusAxis stroke="rgba(255,255,255,0.1)" />
                <Radar name="User Preference" dataKey="A" stroke="#6366F1" fill="#6366F1" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly hours line chart */}
        <div className="p-4 rounded-xl bg-[#111827] border border-white/5 flex flex-col">
          <span className="text-xs text-white/50 uppercase tracking-wider block mb-3 font-mono">Weekly Watch Log</span>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={watchTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={10} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)' }}
                  labelStyle={{ color: 'white' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#8B5CF6" 
                  strokeWidth={2.5}
                  dot={{ fill: '#8B5CF6', stroke: 'white', strokeWidth: 1 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
