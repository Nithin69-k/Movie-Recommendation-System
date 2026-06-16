import { NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY || 'c615c9a97c20eeb1a3412c2aa373fc9d';
const BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const query = searchParams.get('query');
  const id = searchParams.get('id');

  try {
    let url = '';

    if (action === 'trending') {
      url = `${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`;
    } else if (action === 'search') {
      if (!query) {
        return NextResponse.json({ results: [] });
      }
      url = `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
    } else if (action === 'movie') {
      if (!id) {
        return NextResponse.json({ error: 'Movie ID required' }, { status: 400 });
      }
      url = `${BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`;
    } else if (action === 'credits') {
      if (!id) {
        return NextResponse.json({ error: 'Movie ID required' }, { status: 400 });
      }
      url = `${BASE_URL}/movie/${id}/credits?api_key=${TMDB_API_KEY}`;
    } else {
      return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
    }

    const response = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`TMDB responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("TMDB API server proxy error: ", error);
    
    // Graceful fallback mocking so the application never crashes
    if (action === 'trending') {
      return NextResponse.json({
        results: [
          { id: 27205, title: "Inception", release_date: "2010-07-15", vote_average: 8.8, popularity: 96, overview: "A thief who steals corporate secrets through the use of dream-sharing technology..." },
          { id: 157336, title: "Interstellar", release_date: "2014-11-05", vote_average: 8.7, popularity: 95, overview: "The adventures of a group of explorers who make use of a newly discovered wormhole..." }
        ]
      });
    }

    return NextResponse.json({ results: [] });
  }
}
