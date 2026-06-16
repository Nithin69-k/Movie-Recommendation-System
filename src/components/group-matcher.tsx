"use client";

import React, { useState } from 'react';
import { Users, UserPlus, Trash2, Sparkles } from 'lucide-react';
import { getGroupRecommendations, FriendPreference } from '../utils/recommender';
import { Movie } from '../data/movies';

interface GroupMatcherProps {
  onMovieClick: (movie: Movie) => void;
}

export default function GroupMatcher({ onMovieClick }: GroupMatcherProps) {
  const [friends, setFriends] = useState<FriendPreference[]>([
    { name: "You (Host)", genres: ["Sci-Fi", "Drama"], moods: ["motivated", "adventurous"] },
    { name: "Alice", genres: ["Action", "Sci-Fi"], moods: ["adventurous", "stressed"] },
    { name: "Bob", genres: ["Drama", "Biography"], moods: ["lonely", "emotional"] }
  ]);

  const [newName, setNewName] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);

  const availableGenres = ["Sci-Fi", "Action", "Drama", "Thriller", "Biography", "Adventure", "Music"];
  const availableMoods = ["motivated", "stressed", "adventurous", "lonely", "heartbroken", "emotional"];

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || selectedGenres.length === 0 || selectedMoods.length === 0) return;

    setFriends([
      ...friends,
      {
        name: newName,
        genres: selectedGenres,
        moods: selectedMoods
      }
    ]);

    setNewName("");
    setSelectedGenres([]);
    setSelectedMoods([]);
  };

  const removeFriend = (index: number) => {
    if (index === 0) return; // Prevent removing host
    setFriends(friends.filter((_, idx) => idx !== index));
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const toggleMood = (mood: string) => {
    setSelectedMoods(prev => 
      prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]
    );
  };

  // Run consensus algorithm
  const groupResults = getGroupRecommendations(friends);

  return (
    <div className="glass-panel p-6 rounded-2xl relative">
      <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-accent to-pink-accent bg-clip-text text-transparent flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-cyan-accent" /> Friend Group Recommendation Engine
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Lobby Management */}
        <div className="space-y-4 lg:col-span-1">
          <span className="text-xs text-white/50 uppercase tracking-wider block font-mono">Party Lobby ({friends.length})</span>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
            {friends.map((friend, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <h4 className="font-semibold text-xs text-white truncate">{friend.name}</h4>
                  <p className="text-[9px] text-white/50 truncate">
                    Genres: {friend.genres.join(', ')}
                  </p>
                </div>
                {idx > 0 && (
                  <button 
                    onClick={() => removeFriend(idx)}
                    className="p-1.5 rounded-full hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Friend form */}
          <form onSubmit={handleAddFriend} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-3">
            <h4 className="text-xs font-semibold text-white/75 flex items-center gap-1">
              <UserPlus className="w-3.5 h-3.5 text-cyan-accent" /> Add Party Member
            </h4>
            <input 
              type="text" 
              placeholder="Friend Name..." 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full glass-input text-xs"
              required
            />
            
            <div className="space-y-1">
              <span className="text-[10px] text-white/40 uppercase block">Preferred Genres:</span>
              <div className="flex flex-wrap gap-1">
                {availableGenres.map(g => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => toggleGenre(g)}
                    className={`text-[9px] px-2 py-0.5 rounded border transition-all ${
                      selectedGenres.includes(g) 
                        ? "bg-cyan-accent/20 border-cyan-accent text-white" 
                        : "bg-white/5 border-white/5 text-white/60"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-white/40 uppercase block">Vibes / Moods:</span>
              <div className="flex flex-wrap gap-1">
                {availableMoods.map(m => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => toggleMood(m)}
                    className={`text-[9px] px-2 py-0.5 rounded border transition-all ${
                      selectedMoods.includes(m) 
                        ? "bg-pink-accent/20 border-pink-accent text-white" 
                        : "bg-white/5 border-white/5 text-white/60"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-1.5 rounded bg-cyan-accent text-black text-xs font-bold uppercase tracking-wider hover:bg-cyan-accent/90 transition-colors"
            >
              Join Party
            </button>
          </form>
        </div>

        {/* Right Columns: Consensus Results */}
        <div className="lg:col-span-2 space-y-4">
          <span className="text-xs text-white/50 uppercase tracking-wider block font-mono">Consensus Algorithms Results</span>

          {groupResults.length > 0 ? (
            <div className="space-y-4">
              
              {/* Highlight best pick */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-accent/15 via-purple-primary/15 to-transparent border border-cyan-accent/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-cyan-accent font-bold uppercase tracking-widest font-mono flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Golden Match For Party
                  </span>
                  <h4 
                    onClick={() => onMovieClick(groupResults[0].movie)}
                    className="text-xl font-black text-white hover:text-cyan-accent cursor-pointer transition-colors mt-1"
                  >
                    {groupResults[0].movie.title}
                  </h4>
                  <p className="text-xs text-white/75 mt-1">{groupResults[0].explanation}</p>
                </div>
                <div className="text-center shrink-0">
                  <span className="text-[10px] uppercase font-mono text-white/50">Compatibility</span>
                  <div className="text-3xl font-black text-cyan-accent font-mono tracking-tighter">
                    {groupResults[0].compatibilityScore}%
                  </div>
                </div>
              </div>

              {/* Grid of alternatives */}
              <div className="space-y-2">
                <span className="text-xs text-white/50 uppercase tracking-wider block font-mono">Runner-ups</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {groupResults.slice(1, 3).map((res, idx) => (
                    <div 
                      key={idx}
                      onClick={() => onMovieClick(res.movie)}
                      className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-accent/30 hover:bg-white/10 cursor-pointer flex justify-between items-center transition-all"
                    >
                      <div className="min-w-0 pr-2">
                        <h5 className="font-bold text-xs text-white truncate">{res.movie.title}</h5>
                        <p className="text-[9px] text-white/50 truncate">Genres: {res.movie.genre.join(', ')}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono font-bold text-cyan-accent">{res.compatibilityScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-6 text-white/30">
              <Users className="w-8 h-8 mr-2" />
              <span>Add members to calculate party compatibility.</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
