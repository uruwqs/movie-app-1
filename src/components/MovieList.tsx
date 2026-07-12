import { MovieCard } from "@/components/MovieCard.tsx";
import { type Movie } from "@/data/movies.ts";

type MovieListProps = {
  movies: readonly Movie[];
};

export function MovieList({ movies }: MovieListProps) {
  return movies.length > 0 ? (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  ) : (
    <p className="mt-8 rounded-lg bg-slate-900 p-6 text-center text-slate-300">
      No movies found.
    </p>
  );
}
