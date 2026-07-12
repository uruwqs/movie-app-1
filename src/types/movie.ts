export type Movie = {
  id: number;
  title: string;
  poster_url: string;
  genre: string;
  release_year: number;
  description: string;
  rating: number;
};

export type MovieSortValue = "default" | "rating" | "releaseYear";
