import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { searchMovies, getCategorizedMovies, getLatestMovies } from "../services/api";
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState({});
  const [latestMovies, setLatestMovies] = useState([]);  // 👈 New
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch latest (2025) + categorized movies
  useEffect(() => {
    const loadMovies = async () => {
      try {
        // Fetch both latest and categorized movies in parallel
        const [latest, categorizedData] = await Promise.all([
          getLatestMovies(),
          getCategorizedMovies(),
        ]);

        setLatestMovies(latest);
        setCategories(categorizedData);
      } catch (err) {
        console.error(err);
        setError("Failed to load movies...");
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  // Search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (loading) return;

    setLoading(true);
    try {
      const searchResults = await searchMovies(searchQuery);
      setCategories({ search: searchResults });
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to search movies...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for movies..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Movies are loading....</div>
      ) : (
        <div className="categories">

          {/* ✅ Show latest 2025 movies first */}
          <div className="category-section">
            <h2 className="category-title">LATEST 2025 MOVIES</h2>
            <div className="movie-row">
              {latestMovies.length > 0 ? (
                latestMovies.map((movie) => (
                  <MovieCard movie={movie} key={movie.imdbID || movie.id} />
                ))
              ) : (
                <p>No latest movies found</p>
              )}
            </div>
          </div>

          {/* Other categories */}
          {Object.entries(categories).map(([genre, movies]) => (
            <div key={genre} className="category-section">
              <h2 className="category-title">
                {genre === "search"
                  ? "Search Results"
                  : `${genre.toUpperCase()} MOVIES`}
              </h2>

              <div className="movie-row">
                {movies.length > 0 ? (
                  movies.map((movie) => (
                    <MovieCard movie={movie} key={movie.imdbID || movie.id} />
                  ))
                ) : (
                  <p>No movies found</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
