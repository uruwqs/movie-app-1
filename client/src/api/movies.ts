import { type Movie } from "@/types/movie.ts";

export async function getMovies(): Promise<Movie[]> {
  const response = await fetch("/api/movies");

  return response.json();
}
