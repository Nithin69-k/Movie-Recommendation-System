"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../components/navbar';
import PersonalityQuiz from '../components/personality-quiz';
import MoodScanner from '../components/mood-scanner';
import FaceDetector from '../components/face-detector';
import GroupMatcher from '../components/group-matcher';
import MovieUniverse from '../components/movie-universe';
import ChatAssistant from '../components/chat-assistant';
import DebateMode from '../components/debate-mode';
import AnalyticsDashboard from '../components/analytics';
import MovieDetails from '../components/movie-details';
import RecruiterHub from '../components/recruiter-hub';
import AuthModal from './auth-modal';
import Onboarding from './onboarding';
import { useAuth } from '../hooks/useAuth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Movie, movies } from '../data/movies';
import { UserPreferences, getTimeRecommendations, getHiddenGems } from '../utils/recommender';
import { getTrendingTMDBMovies, searchTMDBMovies } from '../utils/tmdb';
import { Sparkles, Brain, Clock, Award, Compass, Activity, Scale, GraduationCap, Users, Terminal, Search, Loader2, Code, TrendingUp, ShieldAlert, LogOut } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const marketGrowthData = [
  { year: '2022', SciFi: 45, Drama: 50, Tech: 30 },
  { year: '2023', SciFi: 60, Drama: 45, Tech: 45 },
  { year: '2024', SciFi: 75, Drama: 55, Tech: 60 },
  { year: '2025', SciFi: 90, Drama: 50, Tech: 85 },
  { year: '2026', SciFi: 110, Drama: 55, Tech: 105 },
];

export default function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTabQuery = searchParams.get('tab') || 'discover';

  // State mapping
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [showHiddenGems, setShowHiddenGems] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<string>("all");
  const [selectedSkill, setSelectedSkill] = useState<string>("all");

  // TMDB States
  const [tmdbMovies, setTmdbMovies] = useState<Movie[]>([]);
  const [liveSearchQuery, setLiveSearchQuery] = useState("");
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [copilotQuery, setCopilotQuery] = useState("");

  // Authentication states from global hook
  const { user, logout: handleLogout, loading: authLoading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Redirect unauthenticated users to landing/login page
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Map user profile from global hook to local profile layout
  const authProfile = user ? {
    name: user.fullName,
    email: user.email,
    avatarUrl: user.avatarUrl,
    provider: user.provider
  } : null;

  const handleLoginSuccess = () => {
    // Handled globally by AuthProvider context listeners
  };

  const handleChipClick = async (chip: string) => {
    setLiveSearchQuery(chip);
    setIsSearchingLive(true);
    if (chip === "Underrated hidden gems") {
      setShowHiddenGems(true);
      setTimeFilter("all");
      setSelectedCareer("all");
      setSelectedSkill("all");
      setTmdbMovies([]);
    } else if (chip === "Weekend binge suggestions") {
      setTimeFilter("weekend");
      setShowHiddenGems(false);
      setSelectedCareer("all");
      setSelectedSkill("all");
      setTmdbMovies([]);
    } else if (chip === "Movies for entrepreneurs") {
      setSelectedCareer("entrepreneur");
      setTimeFilter("all");
      setShowHiddenGems(false);
      setSelectedSkill("all");
      setTmdbMovies([]);
    } else {
      const searchResults = await searchTMDBMovies(chip);
      setTmdbMovies(searchResults);
      setShowHiddenGems(false);
      setTimeFilter("all");
      setSelectedCareer("all");
      setSelectedSkill("all");
    }
    setIsSearchingLive(false);
  };

  const handleCopilotTrigger = (query: string) => {
    setCopilotQuery(query);
    setTab('chat');
  };

  // Local storage for user profile
  const [userPrefs, setUserPrefs] = useLocalStorage<UserPreferences>('cineverse-user-prefs', {
    personalityDNA: undefined,
    watchedMovies: [],
    favoriteGenres: ["Sci-Fi", "Drama"],
    favoriteMoods: ["motivated"],
    career: undefined,
    skillsOfInterest: []
  });

  // Track page view logs for Analytics Wrapped
  useEffect(() => {
    const currentCount = window.localStorage.getItem('cineverse-watch-count') || '0';
    window.localStorage.setItem('cineverse-watch-count', (parseInt(currentCount) + 1).toString());
  }, []);

  // Fetch trending movies from TMDB on mount
  useEffect(() => {
    async function loadTMDBTrending() {
      const trending = await getTrendingTMDBMovies();
      if (trending && trending.length > 0) {
        setTmdbMovies(trending);
      }
    }
    loadTMDBTrending();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B1020] text-white/50 font-mono gap-4">
        <Loader2 className="h-8 w-8 text-indigo-primary animate-spin" />
        <span className="text-xs uppercase tracking-widest animate-pulse">VERIFYING_SECURE_SESSION...</span>
      </div>
    );
  }

  const handleDNAProfile = (dna: string) => {
    setUserPrefs({
      ...userPrefs,
      personalityDNA: dna
    });
  };

  const setTab = (tabName: string) => {
    router.push(`/dashboard?tab=${tabName}`);
  };

  const handleLiveSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchingLive(true);
    if (!liveSearchQuery.trim()) {
      const trending = await getTrendingTMDBMovies();
      setTmdbMovies(trending);
    } else {
      const searchResults = await searchTMDBMovies(liveSearchQuery);
      setTmdbMovies(searchResults);
    }
    setIsSearchingLive(false);
  };

  // Combine database datasets (ensure unique IDs)
  const combinedMovies = [...movies];
  tmdbMovies.forEach(tm => {
    if (!combinedMovies.some(m => m.id === tm.id)) {
      combinedMovies.push(tm);
    }
  });

  // 1. Get filtered movie list
  let activeMovies = [...combinedMovies];

  if (timeFilter !== "all") {
    activeMovies = getTimeRecommendations(timeFilter);
  }

  if (showHiddenGems) {
    activeMovies = getHiddenGems();
  }

  // 2. Filter by career relevance (Feature 7)
  if (selectedCareer !== "all") {
    activeMovies = activeMovies.filter(m => 
      m.careerRelevance.some(c => c.career === selectedCareer)
    );
  }

  // 3. Filter by skill taught (Feature 6)
  if (selectedSkill !== "all") {
    activeMovies = activeMovies.filter(m => 
      m.skillsTaught.some(s => s.skill === selectedSkill)
    );
  }

  // Movie Card Renderer for Netflix-style rows
  const renderMovieCard = (movie: Movie) => {
    const isGem = movie.popularity < 60 && movie.rating >= 7.0;
    return (
      <div 
        key={movie.id}
        onClick={() => setSelectedMovie(movie)}
        className="group glass-panel rounded-xl border border-white/5 overflow-hidden hover:border-indigo-primary/30 hover:scale-[1.02] cursor-pointer transition-all duration-300 flex flex-col justify-between"
      >
        <div className="relative h-40 w-full bg-slate-900">
          <img 
            src={movie.imageUrl} 
            alt={movie.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
          />
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/75 border border-indigo-primary/20 text-[10px] text-indigo-primary font-mono font-bold">
            Rating: {movie.rating}
          </div>
          {isGem && (
            <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-violet-accent border border-violet-500/20 text-[9px] text-white font-bold uppercase tracking-wider font-mono">
              💎 Hidden Gem
            </div>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-white group-hover:text-indigo-primary transition-colors truncate">
              {movie.title}
            </h3>
            <p className="text-[10px] text-white/40 mt-0.5">{movie.director} • {movie.year}</p>
            <p className="text-[11px] text-white/60 mt-2 line-clamp-2 leading-relaxed">{movie.summary}</p>
          </div>
          
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-white/50">
            <span>{movie.runtime} mins</span>
            <span className="px-1.5 py-0.5 bg-white/5 border border-white/15 rounded text-white/70 font-mono text-[9px]">
              {movie.genre[0] || 'Drama'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-panel p-4 rounded-xl space-y-1">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono block mb-2 px-2 font-bold">Intelligence Modules</span>
            
            <button
              onClick={() => setTab('discover')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTabQuery === 'discover' 
                  ? "bg-indigo-primary/10 text-indigo-primary border-l-2 border-indigo-primary pl-4" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Compass className="w-4 h-4" /> Discovery Console
            </button>

            <button
              onClick={() => setTab('scan')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTabQuery === 'scan' 
                  ? "bg-indigo-primary/10 text-indigo-primary border-l-2 border-indigo-primary pl-4" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Activity className="w-4 h-4" /> Biometric Scan Suite
            </button>

            <button
              onClick={() => setTab('lobby')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTabQuery === 'lobby' 
                  ? "bg-indigo-primary/10 text-indigo-primary border-l-2 border-indigo-primary pl-4" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" /> Party Lobby Consensus
            </button>

            <button
              onClick={() => setTab('graph')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTabQuery === 'graph' 
                  ? "bg-indigo-primary/10 text-indigo-primary border-l-2 border-indigo-primary pl-4" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Brain className="w-4 h-4" /> Interactive Universe
            </button>

            <button
              onClick={() => setTab('debate')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTabQuery === 'debate' 
                  ? "bg-indigo-primary/10 text-indigo-primary border-l-2 border-indigo-primary pl-4" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Scale className="w-4 h-4" /> AI Debate Mode
            </button>

            <button
              onClick={() => setTab('academy')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTabQuery === 'academy' 
                  ? "bg-indigo-primary/10 text-indigo-primary border-l-2 border-indigo-primary pl-4" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <GraduationCap className="w-4 h-4" /> Career Academy
            </button>

            <button
              onClick={() => setTab('chat')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTabQuery === 'chat' 
                  ? "bg-indigo-primary/10 text-indigo-primary border-l-2 border-indigo-primary pl-4" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Terminal className="w-4 h-4" /> Intelligence Core Chat
            </button>

            <button
              onClick={() => setTab('analytics')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTabQuery === 'analytics' 
                  ? "bg-indigo-primary/10 text-indigo-primary border-l-2 border-indigo-primary pl-4" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Award className="w-4 h-4" /> Analytics Engine
            </button>

            <button
              onClick={() => setTab('research')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTabQuery === 'research' 
                  ? "bg-indigo-primary/10 text-indigo-primary border-l-2 border-indigo-primary pl-4" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <TrendingUp className="w-4 h-4" /> Market Research
            </button>

            <button
              onClick={() => setTab('recruiter')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTabQuery === 'recruiter' 
                  ? "bg-indigo-primary/10 text-indigo-primary border-l-2 border-indigo-primary pl-4" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Code className="w-4 h-4" /> Recruiter Hub
            </button>
          </div>

          {/* Authentication State Card */}
          <div className="glass-panel p-4 rounded-xl space-y-4">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono block font-bold">Session Security</span>
            {authProfile ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <img src={authProfile.avatarUrl} alt={authProfile.name} className="h-8 w-8 rounded-full border border-indigo-primary" />
                  <div className="min-w-0">
                    <span className="text-xs font-extrabold text-white block truncate">{authProfile.name}</span>
                    <span className="text-[9px] text-white/40 block truncate">{authProfile.email}</span>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full py-1.5 rounded bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-300 text-[10px] uppercase font-mono tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" /> Log Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] text-amber-500 font-mono font-bold">
                  <ShieldAlert className="w-3.5 h-3.5" /> GUEST_MODE_EXPLORER
                </div>
                <button 
                  onClick={() => setAuthModalOpen(true)}
                  className="w-full py-2 rounded bg-indigo-primary text-black font-extrabold text-[10px] uppercase tracking-wider hover:bg-indigo-primary/90 transition-all cursor-pointer"
                >
                  Sign In to LumoraX
                </button>
              </div>
            )}
          </div>

          {/* Quick Profile Summary */}
          <div className="glass-panel p-4 rounded-xl space-y-2">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono block font-bold">Active DNA profile</span>
            {userPrefs.personalityDNA ? (
              <div className="px-2 py-1.5 rounded bg-indigo-primary/10 border border-indigo-primary/35 text-xs text-indigo-primary font-bold text-center glow-purple font-mono">
                {userPrefs.personalityDNA}
              </div>
            ) : (
              <p className="text-[11px] text-white/50">Take the DNA quiz in the Biometric Scan Suite to configure matching preferences.</p>
            )}
          </div>
        </div>

        {/* Dashboard Panels */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* TABS VIEW ROUTING */}
          {activeTabQuery === 'discover' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              
              {/* Left Main Discovery Area */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Dynamic Live TMDB Search Bar (Feature TMDB integration) */}
                <form onSubmit={handleLiveSearch} className="flex gap-2 w-full">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                    <input
                      type="text"
                      placeholder="Search movies live on TMDB index..."
                      value={liveSearchQuery}
                      onChange={(e) => setLiveSearchQuery(e.target.value)}
                      className="w-full glass-input text-xs pl-10 py-3 font-sans"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearchingLive}
                    className="px-5 py-2.5 rounded-lg bg-indigo-primary text-black hover:bg-indigo-primary/90 transition-all font-bold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    {isSearchingLive ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-black" />
                    ) : (
                      <span className="text-black">Search</span>
                    )}
                  </button>
                </form>

                {/* AI Command Center Tag Chips (Feature 8 / Design 8) */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono block font-bold">AI Command Center Quick Prompts</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Movies for entrepreneurs",
                      "Movies like Interstellar",
                      "Underrated hidden gems",
                      "Weekend binge suggestions"
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => handleChipClick(chip)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-indigo-primary/30 hover:bg-indigo-primary/10 text-[11px] font-medium text-white/70 hover:text-white transition-all cursor-pointer font-mono"
                      >
                        [{chip}]
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toolbar Filters */}
                <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
                  
                  {/* Time filter selectors */}
                  <div className="flex flex-col gap-1.5 w-full md:w-auto">
                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono flex items-center gap-1 font-bold">
                      <Clock className="w-3.5 h-3.5 text-indigo-primary" /> Filter By Available Time
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {[
                        { val: "all", label: "Any Time" },
                        { val: "90", label: "90 min" },
                        { val: "120", label: "2 hours" },
                        { val: "weekend", label: "Weekend Plan" }
                      ].map(item => (
                        <button
                          key={item.val}
                          onClick={() => setTimeFilter(item.val)}
                          className={`text-[11px] px-3 py-1.5 rounded font-bold transition-all cursor-pointer ${
                            timeFilter === item.val 
                              ? "bg-indigo-primary text-black" 
                              : "bg-white/5 border border-white/5 text-white/70 hover:bg-white/10"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hidden Gems filter */}
                  <button
                    onClick={() => setShowHiddenGems(!showHiddenGems)}
                    className={`px-4 py-2.5 rounded-lg border font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all w-full md:w-auto justify-center cursor-pointer ${
                      showHiddenGems 
                        ? "bg-indigo-primary border-indigo-primary text-black shadow-glow" 
                        : "bg-white/5 border-white/5 text-white/75 hover:bg-white/10"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Hidden Gems Finder
                  </button>
                </div>

                {/* If searching or filtering, show search grid. If not, show executive shelves. */}
                {liveSearchQuery.trim() || timeFilter !== "all" || showHiddenGems ? (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-primary font-mono">Search & Filter Results</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {activeMovies.map(movie => renderMovieCard(movie))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Shelf 1: Recommended For You */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-primary" /> Recommended For You
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {movies.slice(0, 3).map(movie => renderMovieCard(movie))}
                      </div>
                    </div>

                    {/* Shelf 2: Mood Matches */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-violet-accent animate-pulse" /> Emotional Mood Matches
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {movies.filter(m => m.moodTags.includes('motivated')).slice(0, 3).map(movie => renderMovieCard(movie))}
                      </div>
                    </div>

                    {/* Shelf 3: Hidden Gems */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
                        💎 Executive Hidden Gems
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {movies.filter(m => m.popularity < 60 && m.rating >= 7.0).slice(0, 3).map(movie => renderMovieCard(movie))}
                      </div>
                    </div>

                    {/* Shelf 4: Trending Worldwide (TMDB) */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-indigo-primary" /> Trending Worldwide
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(tmdbMovies.length > 0 ? tmdbMovies : movies).slice(0, 3).map(movie => renderMovieCard(movie))}
                      </div>
                    </div>

                    {/* Shelf 5: Career Learning Tracks */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-success-green" /> Career Learning Content
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {movies.filter(m => m.careerRelevance.length > 0).slice(0, 3).map(movie => renderMovieCard(movie))}
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Right Side: Persistent AI Copilot Sidebar Panel */}
              <div className="lg:col-span-1 space-y-4">
                <div className="glass-panel p-4 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-primary uppercase font-mono tracking-wider">
                    <Brain className="w-4 h-4 text-indigo-primary animate-pulse" />
                    <span>AI Copilot Panel</span>
                  </div>
                  
                  <p className="text-[11px] text-white/50 leading-normal">
                    Ask LumoraX AI core to compile comparisons, run diagnostics, or summarize timelines.
                  </p>

                  <div className="space-y-2">
                    <span className="text-[9px] text-white/40 uppercase font-mono block font-bold">Directives</span>
                    {[
                      { text: "Find hidden gems", query: "Show me some hidden gems!" },
                      { text: "Compare movies", query: "Compare Interstellar vs Inception in debate mode." },
                      { text: "Explain endings", query: "Explain the ending of Inception" },
                      { text: "Create career plan", query: "Show me movies for entrepreneurs" }
                    ].map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCopilotTrigger(action.query)}
                        className="w-full text-left p-2 rounded bg-white/5 border border-white/5 hover:border-indigo-primary/30 hover:bg-indigo-primary/10 text-[11px] text-white/80 hover:text-white transition-all font-mono block cursor-pointer"
                      >
                        • {action.text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTabQuery === 'scan' && (
            <div className="space-y-6">
              <PersonalityQuiz 
                onProfileGenerated={handleDNAProfile}
                savedDNA={userPrefs.personalityDNA}
                onMovieClick={setSelectedMovie}
              />
              <MoodScanner onMovieClick={setSelectedMovie} />
              <FaceDetector onMovieClick={setSelectedMovie} />
            </div>
          )}

          {activeTabQuery === 'lobby' && (
            <GroupMatcher onMovieClick={setSelectedMovie} />
          )}

          {activeTabQuery === 'graph' && (
            <MovieUniverse onMovieClick={setSelectedMovie} />
          )}

          {activeTabQuery === 'debate' && (
            <DebateMode />
          )}

          {activeTabQuery === 'academy' && (
            <div className="space-y-6">
              {/* Selector Panels */}
              <div className="glass-panel p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-widest font-mono block">Career Movie Coach Filter</label>
                  <select
                    value={selectedCareer}
                    onChange={(e) => setSelectedCareer(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-primary outline-none"
                  >
                    <option value="all">Any Career Pathway</option>
                    <option value="software-engineer">Software Engineer</option>
                    <option value="data-scientist">Data Scientist</option>
                    <option value="entrepreneur">Entrepreneur</option>
                    <option value="designer">Designer</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-widest font-mono block">Interactive Skill Module</label>
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-primary outline-none"
                  >
                    <option value="all">Any Skill Focus</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Communication">Communication</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                    <option value="Finance">Finance</option>
                    <option value="Psychology">Psychology</option>
                    <option value="AI">AI / Machine Learning</option>
                    <option value="Startups">Startups</option>
                  </select>
                </div>
              </div>

              {/* Output cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {activeMovies.map(movie => (
                  <div
                    key={movie.id}
                    onClick={() => setSelectedMovie(movie)}
                    className="glass-panel rounded-2xl border border-white/5 overflow-hidden hover:border-indigo-primary/30 hover:scale-[1.01] cursor-pointer transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="relative h-40 w-full">
                      <img src={movie.imageUrl} alt={movie.title} className="w-full h-full object-cover opacity-75" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                      <div className="absolute bottom-3 left-4">
                        <span className="text-[10px] bg-indigo-primary text-black font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                          Career Course
                        </span>
                        <h4 className="text-lg font-black text-white mt-1 truncate">{movie.title}</h4>
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      {movie.careerRelevance.slice(0, 1).map((info, idx) => (
                        <div key={idx} className="space-y-1">
                          <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider block">Career Core Lesson:</span>
                          <p className="text-xs text-white/80 leading-relaxed pl-2 border-l border-indigo-primary">{info.lessons[0]}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTabQuery === 'chat' && (
            <ChatAssistant 
              onMovieClick={setSelectedMovie}
              copilotQuery={copilotQuery}
              onClearCopilotQuery={() => setCopilotQuery("")}
            />
          )}

          {activeTabQuery === 'analytics' && (
            <AnalyticsDashboard />
          )}

          {activeTabQuery === 'research' && (
            <div className="space-y-8">
              {/* Executive metrics cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-indigo-primary" />
                  <div>
                    <span className="text-[9px] uppercase font-mono text-white/40 block">OTT Sector Growth</span>
                    <span className="text-xl font-bold text-white block mt-0.5">+14.2%</span>
                    <span className="text-[9px] text-emerald-400 block font-mono">Weekly spec increases</span>
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
                  <Users className="w-8 h-8 text-violet-accent" />
                  <div>
                    <span className="text-[9px] uppercase font-mono text-white/40 block">Audience Sentiment</span>
                    <span className="text-xl font-bold text-white block mt-0.5">+88.5%</span>
                    <span className="text-[9px] text-indigo-primary block font-mono">Avg platform review rating</span>
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
                  <Code className="w-8 h-8 text-success-green" />
                  <div>
                    <span className="text-[9px] uppercase font-mono text-white/40 block">Mapped Meta Vectors</span>
                    <span className="text-xl font-bold text-white block mt-0.5">124.5K</span>
                    <span className="text-[9px] text-white/40 block font-mono">Tag alignments mapped</span>
                  </div>
                </div>
              </div>

              {/* Research growth chart */}
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Global Genre Affinity Projections</h4>
                  <p className="text-[10px] text-white/40 font-mono mt-0.5">Audience consumption volume trends by quadrant logs</p>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={marketGrowthData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSciFi" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="year" stroke="rgba(255,255,255,0.4)" fontSize={10} />
                      <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)' }} labelStyle={{ color: 'white' }} />
                      <Area type="monotone" dataKey="SciFi" stroke="#6366F1" fillOpacity={1} fill="url(#colorSciFi)" strokeWidth={2} />
                      <Area type="monotone" dataKey="Tech" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorTech)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTabQuery === 'recruiter' && (
            <RecruiterHub />
          )}

        </div>

      </main>

      {/* Selected Movie Modal Details (Features 8, 9, 14, 18, 20) */}
      {selectedMovie && (
        <MovieDetails 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
          userPrefs={userPrefs}
        />
      )}

      {/* Authentication Dialog overlay */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Onboarding Dialog overlay */}
      <Onboarding />

    </div>
  );
}
