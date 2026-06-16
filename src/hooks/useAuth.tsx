"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface AuthProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  phoneNumber?: string;
  careerTrack?: string;
  favoriteGenres: string[];
  skillsOfFocus: string[];
  onboarded: boolean;
  provider: string;
}

export interface WatchlistItem {
  movieId: string;
  title: string;
  backdropUrl?: string;
  rating?: number;
}

interface AuthContextType {
  user: AuthProfile | null;
  loading: boolean;
  watchlist: WatchlistItem[];
  favorites: string[]; // movie IDs
  loginWithGoogle: () => Promise<void>;
  loginWithMock: (profile: { name: string; email: string; avatarUrl: string; provider: string }) => void;
  logout: () => Promise<void>;
  completeOnboarding: (preferences: { career: string; favoriteGenres: string[]; skillsOfFocus: string[] }) => Promise<void>;
  toggleWatchlist: (item: WatchlistItem) => Promise<void>;
  toggleFavorite: (movieId: string, title: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthProfile | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize and listen to sessions
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      // Load mock session from local storage if Supabase is offline
      const storedAuth = localStorage.getItem('lumorax-auth');
      const storedWatch = localStorage.getItem('lumorax-watchlist');
      const storedFavs = localStorage.getItem('lumorax-favorites');

      if (storedAuth) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(storedAuth));
      }
      if (storedWatch) {
        setWatchlist(JSON.parse(storedWatch));
      }
      if (storedFavs) {
        setFavorites(JSON.parse(storedFavs));
      }
      setLoading(false);
      return;
    }

    // Live Supabase auth client assertion for typescript loader safety
    const client = supabase!;

    // Live Supabase auth listener
    const { data: { subscription } } = client.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const sUser = session.user;
          
          // Get metadata
          const fullName = sUser.user_metadata?.full_name || sUser.user_metadata?.name || 'LumoraX User';
          const avatarUrl = sUser.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=120&auto=format&fit=crop';
          const phone = sUser.phone || '';

          try {
            // Fetch profile database details
            const { data: profile } = await client
              .from('profiles')
              .select('*')
              .eq('id', sUser.id)
              .single();

            if (profile) {
              setUser({
                id: sUser.id,
                email: sUser.email || '',
                fullName: profile.full_name || fullName,
                avatarUrl: profile.avatar_url || avatarUrl,
                phoneNumber: profile.phone_number || phone,
                careerTrack: profile.career_track,
                favoriteGenres: profile.favorite_genres || [],
                skillsOfFocus: profile.skills_of_interest || [],
                onboarded: profile.onboarded || false,
                provider: sUser.app_metadata?.provider || 'google'
              });
            } else {
              // Row does not exist yet: upsert initial profile details
              const newProfile = {
                id: sUser.id,
                email: sUser.email || '',
                full_name: fullName,
                avatar_url: avatarUrl,
                phone_number: phone,
                onboarded: false,
                favorite_genres: [],
                skills_of_interest: []
              };
              
              await client.from('profiles').insert([newProfile]);

              setUser({
                id: sUser.id,
                email: sUser.email || '',
                fullName,
                avatarUrl,
                phoneNumber: phone,
                favoriteGenres: [],
                skillsOfFocus: [],
                onboarded: false,
                provider: sUser.app_metadata?.provider || 'google'
              });
            }

            // Sync watchlist and favorites from tables
            const { data: wlData } = await client.from('watchlist').select('*').eq('user_id', sUser.id);
            if (wlData) {
              setWatchlist(wlData.map(item => ({
                movieId: item.movie_id,
                title: item.title,
                backdropUrl: item.backdrop_url,
                rating: item.rating
              })));
            }

            const { data: favData } = await client.from('favorites').select('*').eq('user_id', sUser.id);
            if (favData) {
              setFavorites(favData.map(item => item.movie_id));
            }

          } catch (err) {
            console.error("Supabase user session load failure:", err);
          }
        } else {
          // Clear user states
          setUser(null);
          setWatchlist([]);
          setFavorites([]);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Initiate Google OAuth Redirect
  const loginWithGoogle = async () => {
    if (!isSupabaseConfigured || !supabase) {
      // If offline, simulate Google Login locally
      const mockProfile: AuthProfile = {
        id: 'mock-google-id',
        email: 'alex.mercer@gmail.com',
        fullName: 'Alex Mercer',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop',
        phoneNumber: '+1555666777',
        favoriteGenres: [],
        skillsOfFocus: [],
        onboarded: false,
        provider: 'google'
      };
      setUser(mockProfile);
      localStorage.setItem('lumorax-auth', JSON.stringify(mockProfile));
      return;
    }

    await supabase!.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
  };

  // Mock Login method (Google/GitHub/Email form simulations)
  const loginWithMock = (profile: { name: string; email: string; avatarUrl: string; provider: string }) => {
    const mockProfile: AuthProfile = {
      id: `mock-${profile.provider}-${Date.now()}`,
      email: profile.email,
      fullName: profile.name,
      avatarUrl: profile.avatarUrl,
      favoriteGenres: [],
      skillsOfFocus: [],
      onboarded: false,
      provider: profile.provider
    };
    setUser(mockProfile);
    localStorage.setItem('lumorax-auth', JSON.stringify(mockProfile));
  };

  // Log Out Method
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase!.auth.signOut();
    }
    setUser(null);
    setWatchlist([]);
    setFavorites([]);
    localStorage.removeItem('lumorax-auth');
    localStorage.removeItem('lumorax-watchlist');
    localStorage.removeItem('lumorax-favorites');
    localStorage.removeItem('cineverse-user-prefs');
  };

  // Onboarding Preference Form Submit
  const completeOnboarding = async (preferences: { career: string; favoriteGenres: string[]; skillsOfFocus: string[] }) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      careerTrack: preferences.career,
      favoriteGenres: preferences.favoriteGenres,
      skillsOfFocus: preferences.skillsOfFocus,
      onboarded: true
    };

    setUser(updatedUser);
    localStorage.setItem('lumorax-auth', JSON.stringify(updatedUser));

    // Also sync to local storage preference schema for recommendation logic
    localStorage.setItem('cineverse-user-prefs', JSON.stringify({
      personalityDNA: "Analytical DNA",
      watchedMovies: [],
      favoriteGenres: preferences.favoriteGenres,
      favoriteMoods: ["motivated"],
      career: preferences.career,
      skillsOfInterest: preferences.skillsOfFocus
    }));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase!
          .from('profiles')
          .update({
            career_track: preferences.career,
            favorite_genres: preferences.favoriteGenres,
            skills_of_interest: preferences.skillsOfFocus,
            onboarded: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
      } catch (err) {
        console.error("Supabase preferences sync failed:", err);
      }
    }
  };

  // Toggle watchlist logic
  const toggleWatchlist = async (item: WatchlistItem) => {
    if (!user) return;

    const updatedWatchlist = [...watchlist];
    const index = watchlist.findIndex(w => w.movieId === item.movieId);

    if (index >= 0) {
      // Remove
      updatedWatchlist.splice(index, 1);
      if (isSupabaseConfigured && supabase) {
        await supabase!
          .from('watchlist')
          .delete()
          .eq('user_id', user.id)
          .eq('movie_id', item.movieId);
      }
    } else {
      // Add
      updatedWatchlist.push(item);
      if (isSupabaseConfigured && supabase) {
        await supabase!
          .from('watchlist')
          .insert([{
            user_id: user.id,
            movie_id: item.movieId,
            title: item.title,
            backdrop_url: item.backdropUrl,
            rating: item.rating
          }]);
      }
    }

    setWatchlist(updatedWatchlist);
    localStorage.setItem('lumorax-watchlist', JSON.stringify(updatedWatchlist));
  };

  // Toggle favorite logic
  const toggleFavorite = async (movieId: string, title: string) => {
    if (!user) return;

    const updatedFavorites = [...favorites];
    const index = favorites.indexOf(movieId);

    if (index >= 0) {
      // Remove
      updatedFavorites.splice(index, 1);
      if (isSupabaseConfigured && supabase) {
        await supabase!
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('movie_id', movieId);
      }
    } else {
      // Add
      updatedFavorites.push(movieId);
      if (isSupabaseConfigured && supabase) {
        await supabase!
          .from('favorites')
          .insert([{
            user_id: user.id,
            movie_id: movieId,
            title: title
          }]);
      }
    }

    setFavorites(updatedFavorites);
    localStorage.setItem('lumorax-favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      watchlist,
      favorites,
      loginWithGoogle,
      loginWithMock,
      logout,
      completeOnboarding,
      toggleWatchlist,
      toggleFavorite
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
