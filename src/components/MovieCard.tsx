import { type Movie } from "@/data/movies.ts";

type MovieCardProps = {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: (movieId: Movie["id"]) => void;
};

export function MovieCard({
  movie,
  isFavorite,
  onToggleFavorite,
}: MovieCardProps) {
  const { id, title, poster_url, genre, release_year, description, rating } =
    movie;

  return (
    <article className="overflow-hidden rounded-lg bg-white text-slate-950 shadow-lg">
      <img
        className="aspect-2/3 w-full object-cover"
        src={poster_url}
        alt={title}
      />
      <div className="space-y-2 p-5">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button
            className={`rounded-full border px-3 py-1 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 ${
              isFavorite
                ? "border-sky-700 bg-sky-700 text-white"
                : "border-slate-300 text-slate-700 hover:border-sky-700 hover:text-sky-700"
            }`}
            type="button"
            onClick={() => onToggleFavorite(id)}
          >
            {isFavorite ? "Saved" : "Save"}
          </button>
        </div>
        <p className="text-sm text-slate-600">
          {genre} • {release_year}
        </p>
        <p className="text-sm text-slate-700">{description}</p>
        <p className="font-semibold text-sky-700">Rating: {rating}</p>
      </div>
    </article>
  );
}
