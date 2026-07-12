import { useState } from "react";
import { MovieList } from "@/components/MovieList.tsx";
import { MovieSearch } from "@/components/MovieSearch.tsx";
import { MovieGenreFilter } from "@/components/MovieGenreFilter.tsx";
import { movies } from "@/data/movies.ts";

const allGenres = "All";
const genres = [allGenres, ...new Set(movies.map((movie) => movie.genre))];

function App() {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(allGenres);

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesGenre =
      selectedGenre === allGenres || movie.genre === selectedGenre;

    return matchesSearch && matchesGenre;
  });

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

        <MovieList movies={filteredMovies} />
      </section>
    </main>
  );
}

export default App;
