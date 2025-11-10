
<!--
	Movieslist - frontend
	=====================================
	React + Vite app for browsing and saving movies (uses OMDb API)
-->

# Movieslist (Frontend)

A small React application built with Vite that lets users search for movies, browse a small default/popular list, and save movies to a local "Favourites" list using localStorage.

This README documents how the app is organized, how to run it locally, recommended improvements (security and environment handling), and notes about key components and behavior.

## Quick summary

- Tech: React 19 + Vite
- Routing: react-router-dom
- State: lightweight Context API (`MovieContext`) for favourites persisted to localStorage
- API: OMDb API (calls in `src/services/api.js`) — note: API key is currently hard-coded in source (see Security below)

## Features

- Search movies (via OMDb API)
- View a default popular list (currently an Avengers search)
- Mark/unmark movies as favourites
- Persist favourites in browser localStorage
- Simple client-side routing: Home and Favourites pages

## Prerequisites

- Node.js (16+ recommended)
- npm (or yarn)

## Setup / Run locally

1. Install dependencies

```powershell
cd frontend
npm install
```

2. Start dev server

```powershell
npm run dev
```

3. Build for production

```powershell
npm run build
```

4. Preview production build

```powershell
npm run preview
```

## Available npm scripts

- `dev` - start Vite dev server
- `build` - build production assets with Vite
- `preview` - locally preview the production build
- `lint` - run ESLint across the project

## Project structure (important files)

- `index.html` — app entry
- `src/main.jsx` — renders the app and wraps it in `BrowserRouter` and `MovieProvider`
- `src/App.jsx` — top-level routes and layout (includes `NavBar`)
- `src/contexts/MovieContext.jsx` — Context provider for favourites (add/remove/isFavorite) persisted to `localStorage`
- `src/services/api.js` — OMDb API helpers: `getPopularMovies()` and `searchMovies(query)`
- `src/pages/Home.jsx` — search input, default load of popular movies, displays `MovieCard` grid
- `src/pages/Favourites.jsx` — shows the user's saved favourites from context
- `src/components/MovieCard.jsx` — movie tile with poster and favourite button
- `src/components/NavBar.jsx` — top navigation
- `src/css/` — styles for layout, components and pages

### Notes about implementation

- The app initializes by loading a default list of movies via `getPopularMovies()` which currently requests `s=avengers` from OMDb. This is a simple placeholder for a curated/popular list.
- Search uses OMDb's `s` parameter to search by title.
- Favourites are stored in localStorage under the key `favorites` — accessible across page refreshes and browser restarts on the same host.

## API details

- The app uses the OMDb API (https://www.omdbapi.com/). In `src/services/api.js` there is a constant `API_KEY` and `BASE_URL`.
- Current behavior: the API key is hard-coded as `b6e9508d` in source. This works but is not secure for a production app. See Security & Next steps.

## Security / Environment recommendations

1. Do NOT commit API keys to source. Move the API key into environment variables.

With Vite, add an environment variable named `VITE_OMDB_API_KEY` in a `.env` file at project root (this file should be added to `.gitignore`):

```text
VITE_OMDB_API_KEY=your_real_api_key_here
```

Then update `src/services/api.js` to use `import.meta.env.VITE_OMDB_API_KEY` (example shown below). This keeps secret keys out of the repository and allows different keys per environment.

Recommended small code change (example only; not applied automatically):

```js
// src/services/api.js (recommended)
const API_KEY = import.meta.env.VITE_OMDB_API_KEY || "";
const BASE_URL = "https://www.omdbapi.com/";

export async function searchMovies(query) {
	const key = API_KEY;
	if (!key) throw new Error('OMDb API key not set. Add VITE_OMDB_API_KEY to .env');
	const res = await fetch(`${BASE_URL}?s=${encodeURIComponent(query)}&apikey=${key}`);
	...
}
```

2. For public production usage, consider proxying API calls through a backend to avoid exposing keys entirely client-side.

## Component & code overview

- MovieContext
	- Provides `favorites`, `addToFavorites(movie)`, `removeFromFavorites(movieId)`, `isFavorite(movieId)`.
	- Persists to `localStorage` on every change and loads on start.

- MovieCard
	- Displays poster, title, year and a heart button to toggle favourite state.
	- Uses `isFavorite` to style the button and `addToFavorites` / `removeFromFavorites` to update state.

- NavBar
	- Simple navigation using `Link` to Home and Favourites.

## Known limitations & edge cases

- The app assumes OMDb returns `Search` results for queries; the API may return errors or different responses (e.g. when rate-limited or invalid API key). The service functions currently return an empty array when `data.Search` is missing but do not surface the original error to the UI.
- Error handling in the UI is basic; network errors show a generic message.
- The default "popular" list is a single hard-coded search (`avengers`). Replace this with a more meaningful curated list or a backend-provided list if needed.
- Poster image fallback uses `/no-image.png` — ensure this asset exists in `public/` or change to a valid placeholder.

## Testing & quality gates

- Lint: `npm run lint` (ESLint is included in devDependencies)
- Build: `npm run build` then `npm run preview` to verify production output

I didn't run the application here. To validate quickly on your machine, run the dev server (`npm run dev`) and open http://localhost:5173 (or the Vite-provided URL).

## Next steps (recommended)

1. Move OMDb API key into environment variables as described above.
2. Improve error handling in `src/services/api.js` and show helpful UI messages for rate limits, invalid API key, or empty results.
3. Add tests (component tests for `MovieCard` and integration tests for `MovieContext`).
4. Add a placeholder `no-image.png` in `public/` or update the code to use a stable placeholder URL.
5. If intended for production, consider a lightweight backend to proxy API requests and protect the API key.

## Contribution

- Fork the repo, create a feature branch, and open a PR. Keep changes small and well-documented.

## License

Add a license file if this project is intended for public distribution (e.g., MIT).

---

If you want, I can also:

- apply the small `src/services/api.js` change to read an env var and add `.env.example` containing `VITE_OMDB_API_KEY=`,
- add a `public/no-image.png` placeholder,
- or create a short developer guide for contributing and code-style rules.

Tell me which of those you'd like me to do next.
