import { useEffect, useMemo, useState } from "react";
import { getMovies } from "@/api/movies.ts";
import { EmptyState } from "@/components/EmptyState.tsx";
import { MovieList } from "@/components/MovieList.tsx";
import { MovieSearch } from "@/components/MovieSearch.tsx";
import { MovieGenreFilter } from "@/components/MovieGenreFilter.tsx";
import { MovieFavoritesFilter } from "@/components/MovieFavoritesFilter.tsx";
import { MovieSort, type MovieSortValue } from "@/components/MovieSort.tsx";
import { type Movie } from "@/data/movies.ts";

const allGenres = "All";

function App() {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(allGenres);
  const [sortBy, setSortBy] = useState<MovieSortValue>("default");
  const [favoriteIds, setFavoriteIds] = useState<Movie["id"][]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  useEffect(() => {
    getMovies().then((moviesFromApi) => {
      setMovieList(moviesFromApi);
      setIsLoading(false);
    });
  }, []);

  const genres = useMemo(
    () => [allGenres, ...new Set(movieList.map((movie) => movie.genre))],
    [movieList],
  );

  const normalizedSearch = search.trim().toLowerCase();
  const filteredMovies = movieList.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(normalizedSearch);

    const matchesGenre =
      selectedGenre === allGenres || movie.genre === selectedGenre;
    const matchesFavorite = !favoritesOnly || favoriteIds.includes(movie.id);

    return matchesSearch && matchesGenre && matchesFavorite;
  });

  const sortedMovies = [...filteredMovies].sort((firstMovie, secondMovie) => {
    if (sortBy === "rating") {
      return secondMovie.rating - firstMovie.rating;
    }

    if (sortBy === "releaseYear") {
      return secondMovie.release_year - firstMovie.release_year;
    }

    return 0;
  });

  const movieCountText =
    sortedMovies.length === 1 ? "1 movie" : `${sortedMovies.length} movies`;
  const emptyStateVariant =
    movieList.length === 0
      ? "catalog"
      : favoritesOnly && favoriteIds.length === 0
        ? "favorites"
        : "filters";

  function clearFilters() {
    setSearch("");
    setSelectedGenre(allGenres);
    setFavoritesOnly(false);
  }

  function toggleFavorite(movieId: Movie["id"]) {
    setFavoriteIds((currentIds) =>
      currentIds.includes(movieId)
        ? currentIds.filter((id) => id !== movieId)
        : [...currentIds, movieId],
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase text-sky-300">
          Movies App
        </p>
        <h1 className="mt-3 text-4xl font-bold">Find your next movie</h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          A small React project for learning components, props, lists, state,
          and mock API data.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_220px_220px]">
          <MovieSearch value={search} onChange={setSearch} />
          <MovieGenreFilter
            genres={genres}
            value={selectedGenre}
            onChange={setSelectedGenre}
          />
          <MovieSort value={sortBy} onChange={setSortBy} />
        </div>

        <MovieFavoritesFilter
          favoriteCount={favoriteIds.length}
          value={favoritesOnly}
          onChange={setFavoritesOnly}
        />

        {isLoading ? (
          <p
            className="mt-8 rounded-lg bg-slate-900 p-6 text-center text-slate-300"
            role="status"
          >
            Loading movies...
          </p>
        ) : sortedMovies.length > 0 ? (
          <>
            <p className="mt-8 text-sm font-semibold text-slate-300">
              Showing {movieCountText}
            </p>
            <MovieList
              movies={sortedMovies}
              favoriteIds={favoriteIds}
              onToggleFavorite={toggleFavorite}
            />
          </>
        ) : (
          <EmptyState
            variant={emptyStateVariant}
            onClearFilters={clearFilters}
          />
        )}
      </section>
    </main>
  );
}

export default App;
