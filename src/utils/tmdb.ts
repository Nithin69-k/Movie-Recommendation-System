/* eslint-disable @typescript-eslint/no-explicit-any */
import { Movie } from '../data/movies';

// Helper to convert dynamic TMDB data structures to CineVerse X Movie layout
export function mapTMDBToCineVerse(tmdbMovie: any, credits?: any): Movie {
  const genres = tmdbMovie.genres?.map((g: any) => g.name) || ['Drama'];
  const runtime = tmdbMovie.runtime || 110;

  // Cast and crew mapping
  const cast = credits?.cast?.slice(0, 4).map((c: any) => c.name) || ['Lead Actor', 'Co-Star'];
  const director = credits?.crew?.find((c: any) => c.job === 'Director')?.name || 'Acclaimed Director';

  // Generate dynamic themes based on genres
  const themes = [...genres, 'Survival', 'Human Connection'];

  // Dynamic Career mapping based on genres (Feature 7)
  const careerRelevance = [];
  if (genres.some((g: any) => ['Sci-Fi', 'Fantasy'].includes(g))) {
    careerRelevance.push({
      career: 'data-scientist' as const,
      relevanceScore: 88,
      motivationScore: 85,
      lessons: ['Fostering conceptual logic and predictive mathematical paradigms.', 'Data modeling complex universes.']
    });
  }
  if (genres.some((g: any) => ['Action', 'Thriller', 'Mystery'].includes(g))) {
    careerRelevance.push({
      career: 'software-engineer' as const,
      relevanceScore: 75,
      motivationScore: 80,
      lessons: ['Debugging high-pressure situational environments.', 'Architectural dependencies in dynamic operations.']
    });
  }
  if (genres.some((g: any) => ['Drama', 'Biography', 'History'].includes(g))) {
    careerRelevance.push({
      career: 'entrepreneur' as const,
      relevanceScore: 92,
      motivationScore: 90,
      lessons: ['Resilience in the face of absolute resource scarcity.', 'Negotiating stakes and venture scaling logic.']
    });
  }
  if (genres.some((g: any) => ['Animation', 'Comedy'].includes(g))) {
    careerRelevance.push({
      career: 'designer' as const,
      relevanceScore: 90,
      motivationScore: 85,
      lessons: ['Visual storytelling and customer UX satisfaction.', 'Designing harmonized aesthetics.']
    });
  }

  // Fallback default career if empty
  if (careerRelevance.length === 0) {
    careerRelevance.push({
      career: 'entrepreneur' as const,
      relevanceScore: 80,
      motivationScore: 80,
      lessons: ['Building confidence and navigating team alignments.']
    });
  }

  // Dynamic skills taught (Feature 6)
  const skillsTaught = [
    {
      skill: 'Leadership' as const,
      lessons: ['How high-stakes group consensus succeeds.', 'Strategic delegation and team alignment.']
    },
    {
      skill: 'Communication' as const,
      lessons: ['Resolving communication silos during critical bottlenecks.']
    }
  ];

  // Dynamic character relations (Feature 9)
  const characterRelationships = [];
  if (cast.length >= 2) {
    characterRelationships.push({
      source: cast[0],
      target: cast[1],
      type: "Main Protagonists (Direct conflict or collaborative synergy)"
    });
  }
  if (cast.length >= 3) {
    characterRelationships.push({
      source: cast[0],
      target: cast[2],
      type: "Key Ally / Foil dynamic"
    });
  }

  return {
    id: tmdbMovie.id.toString(),
    title: tmdbMovie.title,
    year: tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear() : 2026,
    genre: genres,
    director,
    cast,
    runtime,
    rating: parseFloat(tmdbMovie.vote_average?.toFixed(1) || '7.5'),
    popularity: Math.round(tmdbMovie.popularity || 50),
    imageUrl: tmdbMovie.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${tmdbMovie.backdrop_path}`
      : (tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop'),
    summary: tmdbMovie.overview || 'No narrative details provided in sector logs.',
    whyWatch: `A highly recommended cinematic selection. It currently maintains a viewer score of ${tmdbMovie.vote_average?.toFixed(1) || '7.5'} from global audience logs.`,
    themes,
    endingExplanation: `In the climax of ${tmdbMovie.title}, the central character conflicts reach a resolution by wrapping up key thematic timelines. The plot settles the high-tension dependencies established in the second act, leaving a lasting impact on character alignments.`,
    endingTimeline: [
      { time: "00:45:00", event: "Conflict escalation: core complications introduce new stakes." },
      { time: "01:25:00", event: "Climax: critical decisions decide character pathways." },
      { time: "01:40:00", event: "Resolution: final timeline wrap-ups." }
    ],
    characterRelationships,
    careerRelevance,
    skillsTaught,
    moodTags: ['motivated', 'adventurous'],
    personalityTags: ['logical', 'adventurous'],
    debateData: {
      story: `Narrative focus around character choices, pacing, and dramatic stakes.`,
      visuals: `Atmospheric cinematography, visual setups, and production design.`,
      science: `Realistic framing of physical boundaries, technology elements, or environmental realities.`,
      emotion: `Emotional beats, audience connection metrics, and catharsis loops.`
    }
  };
}

// Fetch trending movies of the week
export async function getTrendingTMDBMovies(): Promise<Movie[]> {
  try {
    const res = await fetch('/api/tmdb?action=trending');
    if (!res.ok) throw new Error();
    const data = await res.json();

    // Map first 10 results
    const mapped = await Promise.all(
      data.results.slice(0, 10).map(async (movie: any) => {
        // Fetch credits dynamically for cast/director
        try {
          const creditsRes = await fetch(`/api/tmdb?action=credits&id=${movie.id}`);
          const credits = creditsRes.ok ? await creditsRes.json() : null;
          return mapTMDBToCineVerse(movie, credits);
        } catch {
          return mapTMDBToCineVerse(movie);
        }
      })
    );
    return mapped;
  } catch (error) {
    console.error("TMDB Trending Fetch failed. Falling back to local data.", error);
    return [];
  }
}

// Search movies
export async function searchTMDBMovies(query: string): Promise<Movie[]> {
  if (!query) return [];
  try {
    const res = await fetch(`/api/tmdb?action=search&query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error();
    const data = await res.json();

    const mapped = await Promise.all(
      data.results.slice(0, 10).map(async (movie: any) => {
        try {
          const creditsRes = await fetch(`/api/tmdb?action=credits&id=${movie.id}`);
          const credits = creditsRes.ok ? await creditsRes.json() : null;
          return mapTMDBToCineVerse(movie, credits);
        } catch {
          return mapTMDBToCineVerse(movie);
        }
      })
    );
    return mapped;
  } catch (error) {
    console.error("TMDB Search failed. Falling back to local data.", error);
    return [];
  }
}
