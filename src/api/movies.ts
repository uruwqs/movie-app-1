import { movies, type Movie } from "@/data/movies";

export function getMovies(): Promise<Movie[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(movies);
    }, 500);
  });
}
