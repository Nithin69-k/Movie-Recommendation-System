import { Movie, movies } from '../data/movies';

export interface UserPreferences {
  personalityDNA?: string;
  watchedMovies: string[];
  favoriteGenres: string[];
  favoriteMoods: string[];
  career?: 'software-engineer' | 'data-scientist' | 'entrepreneur' | 'designer';
  skillsOfInterest: string[];
}

// Helper to calculate string overlap / similarity
function calculateKeywordMatch(text: string, queryWords: string[]): number {
  let score = 0;
  const normalizedText = text.toLowerCase();
  for (const word of queryWords) {
    if (word.length < 3) continue; // Skip very short words like "in", "a", "or"
    if (normalizedText.includes(word)) {
      score += 1;
      // Bonus score for exact word boundary match
      if (new RegExp(`\\b${word}\\b`).test(normalizedText)) {
        score += 0.5;
      }
    }
  }
  return score;
}

// 1. Scene Search Engine (Simulated Semantic/Keyword Matcher)
export function searchScenes(query: string): { movie: Movie; score: number }[] {
  if (!query) return [];
  const words = query.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').filter(Boolean);
  if (words.length === 0) return [];

  const results = movies.map(movie => {
    let score = 0;
    
    // Check fields with different weights
    score += calculateKeywordMatch(movie.title, words) * 5.0;
    score += calculateKeywordMatch(movie.summary, words) * 2.0;
    score += calculateKeywordMatch(movie.whyWatch, words) * 1.5;
    score += movie.themes.reduce((sum, theme) => sum + calculateKeywordMatch(theme, words) * 1.0, 0);
    score += movie.genre.reduce((sum, g) => sum + calculateKeywordMatch(g, words) * 1.5, 0);
    score += movie.moodTags.reduce((sum, tag) => sum + calculateKeywordMatch(tag, words) * 1.0, 0);
    
    return { movie, score };
  });

  return results
    .filter(res => res.score > 0)
    .sort((a, b) => b.score - a.score);
}

// 2. Personality Rec Engine
export function getPersonalityRecommendations(personalityDNA: string): { movie: Movie; matchScore: number }[] {
  // Map DNA profiles to matching tags
  const dnaToTagsMap: { [key: string]: string[] } = {
    "Visionary Explorer": ["adventurous", "risk-taker", "logical"],
    "Stoic Thinker": ["introvert", "planner", "logical", "safe"],
    "Thrill Seeker": ["risk-taker", "adventurous", "stressed"],
    "Empathetic Dreamer": ["emotional", "introvert", "lonely", "heartbroken"],
    "Analytical Strategist": ["logical", "planner", "stressed"]
  };

  const targetTags = dnaToTagsMap[personalityDNA] || ["logical"];

  return movies.map(movie => {
    let overlap = 0;
    movie.personalityTags.forEach(tag => {
      if (targetTags.includes(tag)) overlap += 1;
    });
    movie.moodTags.forEach(tag => {
      if (targetTags.includes(tag)) overlap += 0.5;
    });

    const matchScore = Math.min(Math.round(((overlap / (targetTags.length || 1)) * 40) + 60), 100);
    return { movie, matchScore };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

// 3. Mood Scanner Rec Engine
export function getMoodRecommendations(moodQuery: string, emojiMood?: string): { movie: Movie; matchScore: number }[] {
  const normalizedMood = moodQuery.toLowerCase();
  
  // Define mood categories mapped to keyword tags
  const keywords: string[] = [];
  if (normalizedMood.includes("lonely") || normalizedMood.includes("alone") || emojiMood === "🥺" || emojiMood === "😭") {
    keywords.push("lonely", "heartbroken", "emotional");
  }
  if (normalizedMood.includes("stress") || normalizedMood.includes("tired") || normalizedMood.includes("anxious") || emojiMood === "😰" || emojiMood === "😫") {
    keywords.push("stressed", "emotional", "logical");
  }
  if (normalizedMood.includes("motivate") || normalizedMood.includes("inspire") || normalizedMood.includes("work") || emojiMood === "🔥" || emojiMood === "💪") {
    keywords.push("motivated", "adventurous", "risk-taker");
  }
  if (normalizedMood.includes("sad") || normalizedMood.includes("heartbroken") || normalizedMood.includes("cry") || emojiMood === "💔") {
    keywords.push("heartbroken", "emotional", "lonely");
  }
  if (normalizedMood.includes("adventure") || normalizedMood.includes("explore") || normalizedMood.includes("hype") || emojiMood === "🚀") {
    keywords.push("adventurous", "risk-taker");
  }

  // Fallback: use normalized word splits
  if (keywords.length === 0) {
    keywords.push(...normalizedMood.split(' ').filter(w => w.length > 3));
  }

  return movies.map(movie => {
    let hits = 0;
    movie.moodTags.forEach(tag => {
      if (keywords.includes(tag.toLowerCase())) hits += 2;
    });
    movie.themes.forEach(theme => {
      if (keywords.some(keyword => theme.toLowerCase().includes(keyword))) hits += 0.5;
    });

    const matchScore = Math.min(Math.round(((hits / (keywords.length || 1)) * 30) + 70), 100);
    return { movie, matchScore };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

// 4. Friend Group Recommendation Engine (Consensus Algorithm)
export interface FriendPreference {
  name: string;
  genres: string[];
  moods: string[];
}

export interface GroupRecommendationResult {
  movie: Movie;
  compatibilityScore: number;
  individualMatches: { friendName: string; matchPercentage: number }[];
  explanation: string;
}

export function getGroupRecommendations(friends: FriendPreference[]): GroupRecommendationResult[] {
  if (friends.length === 0) return [];

  return movies.map(movie => {
    const individualMatches = friends.map(friend => {
      const genreHits = movie.genre.filter(g => friend.genres.includes(g)).length;
      const moodHits = movie.moodTags.filter(m => friend.moods.includes(m)).length;
      
      const score = Math.min(Math.round(((genreHits * 20) + (moodHits * 25)) + 50), 100);
      return { friendName: friend.name, matchPercentage: score };
    });

    const avgScore = Math.round(individualMatches.reduce((sum, item) => sum + item.matchPercentage, 0) / friends.length);
    
    // Generate explanation
    const sharedGenres = Array.from(new Set(friends.flatMap(f => f.genres))).filter(g => movie.genre.includes(g));
    const explanation = `Satisfies the group because it matches genres [${sharedGenres.join(', ')}] with an average compatibility of ${avgScore}%.`;

    return {
      movie,
      compatibilityScore: avgScore,
      individualMatches,
      explanation
    };
  }).sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}

// 5. Time-based Recommendations
export function getTimeRecommendations(minutes: number | string): Movie[] {
  let filtered = [...movies];
  
  if (minutes === "weekend") {
    // Return longer films or high-popularity epics
    return filtered.sort((a, b) => b.runtime - a.runtime);
  }

  const limit = typeof minutes === 'string' ? parseInt(minutes) : minutes;

  if (isNaN(limit)) return movies;

  // Filter for runtime close to or less than limit, allow small buffer
  if (limit <= 30) {
    // For short time, return documentaries or shortest movies
    filtered = filtered.filter(m => m.runtime <= 120); // Fallback: sort shortest first
  } else {
    filtered = filtered.filter(m => m.runtime <= limit + 15);
  }

  return filtered.sort((a, b) => b.rating - a.rating);
}

// 6. Hidden Gems Finder
export function getHiddenGems(): Movie[] {
  // Lower popularity but high rating
  return movies
    .filter(m => m.popularity < 60 && m.rating >= 7.0)
    .sort((a, b) => b.rating - a.rating);
}

// 7. Smart Movie IQ Score / Predictor
export function calculateMovieIQ(movie: Movie, prefs: UserPreferences): { score: number; reasons: string[] } {
  let score = 70; // baseline
  const reasons: string[] = [];

  // Career match (Feature 7)
  if (prefs.career) {
    const careerMatch = movie.careerRelevance.find(c => c.career === prefs.career);
    if (careerMatch) {
      score += 10;
      reasons.push(`Highly aligned with your career goals in ${prefs.career.replace('-', ' ')} (+10%)`);
    }
  }

  // Skills match (Feature 6)
  if (prefs.skillsOfInterest.length > 0) {
    const matchedSkills = movie.skillsTaught.filter(s => prefs.skillsOfInterest.includes(s.skill));
    if (matchedSkills.length > 0) {
      score += matchedSkills.length * 5;
      reasons.push(`Teaches key skills you want to learn: ${matchedSkills.map(s => s.skill).join(', ')}`);
    }
  }

  // Genre match
  if (prefs.favoriteGenres.length > 0) {
    const genreMatches = movie.genre.filter(g => prefs.favoriteGenres.includes(g));
    if (genreMatches.length > 0) {
      score += genreMatches.length * 3;
      reasons.push(`Matches your preferred genres: ${genreMatches.join(', ')}`);
    }
  }

  // Mood match
  if (prefs.favoriteMoods.length > 0) {
    const moodMatches = movie.moodTags.filter(m => prefs.favoriteMoods.includes(m));
    if (moodMatches.length > 0) {
      score += moodMatches.length * 4;
      reasons.push(`Fits your typical mood profiles: ${moodMatches.join(', ')}`);
    }
  }

  // Watch history penalty (don't suggest already watched as top recommendation)
  if (prefs.watchedMovies.includes(movie.id)) {
    score -= 20;
    reasons.push(`You already watched this film`);
  }

  const finalScore = Math.min(Math.max(score, 10), 100);
  return { score: finalScore, reasons };
}

import { searchTMDBMovies, getTrendingTMDBMovies } from './tmdb';

// 8. AI Entertainment Chatbot Responder (Asynchronous / Real-time backed)
export async function getChatbotResponse(userMessage: string): Promise<{ message: string; recommendedMovies: Movie[] }> {
  const query = userMessage.toLowerCase().trim();
  
  // 1. Check for real-time trending triggers
  if (query.includes("trending") || query.includes("popular") || query.includes("what's hot") || query.includes("what is hot")) {
    try {
      const trending = await getTrendingTMDBMovies();
      if (trending && trending.length > 0) {
        return {
          message: "I scanned the live TMDB database feeds. Here are the top trending movies globally right now:",
          recommendedMovies: trending.slice(0, 3)
        };
      }
    } catch (err) {
      console.error("Real-time trending chatbot load failed:", err);
    }
  }

  // 2. Check for similar/like queries (e.g. "movies similar to interstellar" or "like inception")
  const similarMatch = query.match(/(?:similar to|like|recommend matching|find similar)\s+([a-zA-Z0-9\s:]+)/i);
  if (similarMatch && similarMatch[1]) {
    const movieTarget = similarMatch[1].trim();
    try {
      // Search TMDB first for the target movie
      const searchResults = await searchTMDBMovies(movieTarget);
      if (searchResults && searchResults.length > 0) {
        const targetMovie = searchResults[0];
        const targetGenres = targetMovie.genre;
        const related = searchResults.filter(m => m.id !== targetMovie.id).slice(0, 3);
        
        if (related.length > 0) {
          return {
            message: `Based on your request, I located "${targetMovie.title}" (${targetMovie.year}) in the live TMDB registry. Here are similar movies from the same category:`,
            recommendedMovies: related
          };
        } else {
          const localMatches = movies.filter(m => m.genre.some(g => targetGenres.includes(g))).slice(0, 2);
          return {
            message: `I found "${targetMovie.title}" (${targetMovie.year}) via TMDB. Here is its details record along with matching items in our database:`,
            recommendedMovies: [targetMovie, ...localMatches].slice(0, 3)
          };
        }
      }
    } catch (err) {
      console.error("Real-time similarity query failed:", err);
    }
  }

  // 3. Check for specific search queries
  if (query.startsWith("find ") || query.startsWith("search ") || query.startsWith("show me ")) {
    const searchTerms = query.replace(/^(find|search|show me)\s+/, "");
    try {
      const searchResults = await searchTMDBMovies(searchTerms);
      if (searchResults && searchResults.length > 0) {
        return {
          message: `I queried the live database for "${searchTerms}". Here are the top matching results:`,
          recommendedMovies: searchResults.slice(0, 3)
        };
      }
    } catch (err) {
      console.error("Real-time direct search failed:", err);
    }
  }

  // 4. Default to keyword/local searches
  if (query.includes("career") || query.includes("job") || query.includes("learn") || query.includes("skill") || query.includes("entrepreneur") || query.includes("engineer")) {
    const careerFiltered = movies.filter(m => m.careerRelevance.length > 0 || m.skillsTaught.length > 0);
    return {
      message: "Here are some movies and documentaries that teach career skills, build entrepreneurial drive, or highlight technical work!",
      recommendedMovies: careerFiltered.slice(0, 3)
    };
  }

  if (query.includes("gem") || query.includes("underrated") || query.includes("hidden") || query.includes("masterpiece")) {
    const gems = getHiddenGems();
    return {
      message: "I searched our intelligence base and found these underrated hidden masterpieces with high reviews but low mainstream popularity:",
      recommendedMovies: gems.slice(0, 3)
    };
  }

  if (query.includes("mood") || query.includes("feel") || query.includes("sad") || query.includes("lonely") || query.includes("happy") || query.includes("stress")) {
    const moodRecs = getMoodRecommendations(userMessage);
    return {
      message: "Based on your emotional query, I've scanned the database for content matching that specific mood profile:",
      recommendedMovies: moodRecs.map(r => r.movie).slice(0, 3)
    };
  }

  // Try real-time search as a generic fallback for any unknown queries first!
  try {
    const fallbackResults = await searchTMDBMovies(userMessage);
    if (fallbackResults && fallbackResults.length > 0) {
      return {
        message: `I scanned the live registries for "${userMessage}" and found these matches:`,
        recommendedMovies: fallbackResults.slice(0, 3)
      };
    }
  } catch {
    // Ignore and proceed to local search
  }

  // Local semantic keyword match fallback
  const searchResults = searchScenes(userMessage);
  if (searchResults.length > 0) {
    return {
      message: `I've analyzed our local universe and found these matches for "${userMessage}":`,
      recommendedMovies: searchResults.map(r => r.movie).slice(0, 3)
    };
  }

  // Default response
  return {
    message: "I'm the LumoraX AI Assistant. Ask me things like:\n• 'Show me movies for entrepreneurs'\n• 'What are some hidden gems?'\n• 'Movies similar to Inception'\n• 'I'm feeling lonely and stressed'",
    recommendedMovies: movies.slice(0, 3)
  };
}
