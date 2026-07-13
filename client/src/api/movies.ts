import { movies } from "@/data/movies.ts";
import { type Movie } from "@/types/movie.ts";

export function getMovies(): Promise<Movie[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(movies);
    }, 500);
  });
}
