const BASE_URL = "https://www.omdbapi.com/";
const API_KEY = import.meta.env.VITE_API_KEY;

export async function getPopularMovies() {
  try {
    if (!API_KEY) throw new Error("Missing API key. Check .env file.");

    const res = await fetch(`${BASE_URL}?s=avengers&apikey=${API_KEY}`);
    const data = await res.json();
    console.log("getPopularMovies →", data);

    if (data.Response === "False") throw new Error(data.Error || "No movies found");
    return data.Search || [];
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
}

export async function searchMovies(query) {
  try {
    if (!API_KEY) throw new Error("Missing API key. Check .env file.");

    const res = await fetch(`${BASE_URL}?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
    const data = await res.json();
    console.log("searchMovies →", data);

    if (data.Response === "False") throw new Error(data.Error || "No movies found");
    return data.Search || [];
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
}
