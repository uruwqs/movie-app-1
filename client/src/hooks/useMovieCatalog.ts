import { useEffect, useMemo, useState } from "react";
import { getMovies } from "@/api/movies.ts";
import { type Movie, type MovieSortValue } from "@/types/movie.ts";

const allGenres = "All";

export function useMovieCatalog() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(allGenres);
  const [sortBy, setSortBy] = useState<MovieSortValue>("default");
  const [favoriteIds, setFavoriteIds] = useState<Movie["id"][]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  useEffect(() => {
    getMovies().then((moviesFromApi) => {
      setMovies(moviesFromApi);
      setIsLoading(false);
    });
  }, []);

  const genres = useMemo(
    () => [allGenres, ...new Set(movies.map((movie) => movie.genre))],
    [movies],
  );

  const normalizedSearch = search.trim().toLowerCase();
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(normalizedSearch);
    const matchesGenre =
      selectedGenre === allGenres || movie.genre === selectedGenre;
    const matchesFavorite = !favoritesOnly || favoriteIds.includes(movie.id);

    return matchesSearch && matchesGenre && matchesFavorite;
  });

  const visibleMovies = [...filteredMovies].sort((firstMovie, secondMovie) => {
    if (sortBy === "rating") {
      return secondMovie.rating - firstMovie.rating;
    }

    if (sortBy === "releaseYear") {
      return secondMovie.release_year - firstMovie.release_year;
    }

    return 0;
  });

  function clearFilters() {
    setSearch("");
    setSelectedGenre(allGenres);
    setFavoritesOnly(false);
  }

  function toggleFavorite(movieId: Movie["id"]) {
    setFavoriteIds((currentIds) =>
      currentIds.includes(movieId)
        ? currentIds.filter((id) => id !== movieId)
        : [...currentIds, movieId],
    );
  }

  return {
    movies,
    visibleMovies,
    genres,
    isLoading,
    search,
    setSearch,
    selectedGenre,
    setSelectedGenre,
    sortBy,
    setSortBy,
    favoriteIds,
    favoritesOnly,
    setFavoritesOnly,
    clearFilters,
    toggleFavorite,
  };
}
