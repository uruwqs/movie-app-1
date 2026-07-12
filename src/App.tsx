type MovieCardProps = {
  title: string;
  genre: string;
  release_year: number;
  description: string;
  rating: number;
};

function MovieCard({
  title,
  genre,
  release_year,
  description,
  rating,
}: MovieCardProps) {
  return (
    <article className="overflow-hidden rounded-lg bg-white text-slate-950 shadow-lg">
      <div className="flex aspect-2/3 items-center justify-center bg-sky-200 px-6 text-center text-2xl font-bold text-sky-950">
        {title}
      </div>
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

        <div className="mt-8 max-w-sm">
          <MovieCard
            title="Starlight Summer"
            release_year={2025}
            genre="Adventure"
            rating={8.7}
            description="A group of friends discover a glowing map that leads to a summer they will never forget."
          />
        </div>
      </section>
    </main>
  );
}

export default App;
