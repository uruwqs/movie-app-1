import { type Movie } from "@/data/movies.ts";

type MovieCardProps = {
  movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
  const { title, poster_url, genre, release_year, description, rating } = movie;

  return (
    <article className="overflow-hidden rounded-lg bg-white text-slate-950 shadow-lg">
      <img
        className="aspect-2/3 w-full object-cover"
        src={poster_url}
        alt={title}
      />
      <div className="space-y-2 p-5">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-sm text-slate-600">
          {genre} • {release_year}
        </p>
        <p className="text-sm text-slate-700">{description}</p>
        <p className="font-semibold text-sky-700">Rating: {rating}</p>
      </div>
    </article>
  );
}
