import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { searchMovies, getCategorizedMovies } from "../services/api";
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch multiple categories
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const categorizedData = await getCategorizedMovies();
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
        <div className="loading">Loading...</div>
      ) : (
        <div className="categories">
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
                    <MovieCard movie={movie} key={movie.imdbID} />
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
