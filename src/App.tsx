const movies = [
  {
    id: 1,
    title: "Starlight Summer",
    poster_url: "/posters/starlight-summer.svg",
    release_year: 2025,
    genre: "Adventure",
    rating: 8.7,
    description:
      "A group of friends discover a glowing map that leads to a summer they will never forget.",
  },
  {
    id: 2,
    title: "City of Echoes",
    poster_url: "/posters/city-of-echoes.svg",
    release_year: 2024,
    genre: "Mystery",
    rating: 8.1,
    description:
      "A young reporter follows strange sounds through a city full of hidden stories.",
  },
  {
    id: 3,
    title: "Ocean Notes",
    poster_url: "/posters/ocean-notes.svg",
    release_year: 2023,
    genre: "Drama",
    rating: 7.9,
    description:
      "Two sisters rebuild their friendship while saving their family music shop by the sea.",
  },
  {
    id: 4,
    title: "Pixel Hearts",
    poster_url: "/posters/pixel-hearts.svg",
    release_year: 2026,
    genre: "Comedy",
    rating: 8.4,
    description:
      "A shy game designer accidentally becomes famous after her tiny game goes viral.",
  },
  {
    id: 5,
    title: "Moonlit Code",
    poster_url: "/posters/moonlit-code.svg",
    release_year: 2025,
    genre: "Sci-Fi",
    rating: 8.9,
    description:
      "A student builds a robot that can read old messages hidden in moonlight.",
  },
  {
    id: 6,
    title: "The Last Train",
    poster_url: "/posters/the-last-train.svg",
    release_year: 2022,
    genre: "Thriller",
    rating: 7.6,
    description:
      "Three strangers must solve one puzzle before the final train leaves the station.",
  },
];

type MovieCardProps = {
  title: string;
  poster_url: string;
  genre: string;
  release_year: number;
  description: string;
  rating: number;
};

function MovieCard({
  title,
  poster_url,
  genre,
  release_year,
  description,
  rating,
}: MovieCardProps) {
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

function App() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase text-sky-300">
          Movies App
        </p>
        <h1 className="mt-3 text-4xl font-bold">Find your next movie</h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          A small React project for learning components, props, lists, state,
          and mock API data.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie) => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
