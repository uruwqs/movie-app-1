import { useEffect, useMemo, useState } from "react";
import { getMovies } from "@/api/movies.ts";
import { EmptyState } from "@/components/EmptyState.tsx";
import { MovieList } from "@/components/MovieList.tsx";
import { MovieSearch } from "@/components/MovieSearch.tsx";
import { MovieGenreFilter } from "@/components/MovieGenreFilter.tsx";
import { type Movie } from "@/data/movies.ts";

const allGenres = "All";

function App() {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(allGenres);

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

  const filteredMovies = movieList.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesGenre =
      selectedGenre === allGenres || movie.genre === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  const movieCountText =
    filteredMovies.length === 1 ? "1 movie" : `${filteredMovies.length} movies`;

  function clearFilters() {
    setSearch("");
    setSelectedGenre(allGenres);
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

        <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_220px]">
          <MovieSearch value={search} onChange={setSearch} />
          <MovieGenreFilter
            genres={genres}
            value={selectedGenre}
            onChange={setSelectedGenre}
          />
        </div>

        {isLoading ? (
          <p
            className="mt-8 rounded-lg bg-slate-900 p-6 text-center text-slate-300"
            role="status"
          >
            Loading movies...
          </p>
        ) : filteredMovies.length > 0 ? (
          <>
            <p className="mt-8 text-sm font-semibold text-slate-300">
              Showing {movieCountText}
            </p>
            <MovieList movies={filteredMovies} />
          </>
        ) : (
          <EmptyState onClearFilters={clearFilters} />
        )}
      </section>
    </main>
  );
}

export default App;
