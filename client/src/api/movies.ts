import { type Movie } from "@/types/movie.ts";

export async function getMovies(): Promise<Movie[]> {
  const response = await fetch("/api/movies");

  if (!response.ok) {
    throw new Error("Failed to load movies");
  }

  return response.json();
}
