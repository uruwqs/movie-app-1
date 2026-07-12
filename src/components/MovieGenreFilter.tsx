type MovieGenreFilterProps = {
  genres: string[];
  value: string;
  onChange: (value: string) => void;
};

export function MovieGenreFilter({
  genres,
  value,
  onChange,
}: MovieGenreFilterProps) {
  return (
    <select
      aria-label="Filter movies by genre"
      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {genres.map((genre) => (
        <option key={genre} value={genre}>
          {genre}
        </option>
      ))}
    </select>
  );
}