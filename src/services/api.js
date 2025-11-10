const API_KEY = "b6e9508d";
const BASE_URL = "https://www.omdbapi.com/";

export async function getPopularMovies() {
  const res = await fetch(`${BASE_URL}?s=avengers&apikey=${API_KEY}`);
  const data = await res.json();
  return data.Search ? data.Search : [];
}

export async function searchMovies(query) {
  const res = await fetch(`${BASE_URL}?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
  const data = await res.json();
  return data.Search ? data.Search : [];
}







