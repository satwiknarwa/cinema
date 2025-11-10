const BASE_URL = "https://www.omdbapi.com/";
const API_KEY = import.meta.env.VITE_API_KEY;

// 🔹 Fetch movies by category keyword
export async function getMoviesByCategory(category) {
  try {
    const res = await fetch(`${BASE_URL}?s=${category}&apikey=${API_KEY}`);
    const data = await res.json();
    return data.Search || [];
  } catch (error) {
    console.error(`Error fetching ${category} movies:`, error);
    return [];
  }
}

// 🔹 Fetch multiple categories (Action, Comedy, etc.)
export async function getCategorizedMovies() {
  const categories = ["action", "comedy", "romance", "drama", "sci-fi", "thriller","horror"];
  const results = {};

  for (const category of categories) {
    results[category] = await getMoviesByCategory(category);
  }

  return results;
}

// 🔹 Search movies (for search bar)
export async function searchMovies(query) {
  try {
    const res = await fetch(`${BASE_URL}?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
    const data = await res.json();

    if (data.Response === "False") throw new Error(data.Error || "No movies found");
    return data.Search || [];
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
}
