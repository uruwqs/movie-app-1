import { MovieCard } from "@/components/MovieCard.tsx";
import { type Movie } from "@/types/movie.ts";

type MovieListProps = {
  movies: readonly Movie[];
  favoriteIds: readonly Movie["id"][];
  onToggleFavorite: (movieId: Movie["id"]) => void;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
};

export function MovieList({
  movies,
  favoriteIds,
  onToggleFavorite,
  onEdit,
  onDelete,
}: MovieListProps) {
  return (
    <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isFavorite={favoriteIds.includes(movie.id)}
          onToggleFavorite={onToggleFavorite}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
