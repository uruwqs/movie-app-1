type MovieSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function MovieSearch({ value, onChange }: MovieSearchProps) {
  return (
    <input
      aria-label="Search movies by title"
      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-400"
      type="text"
      placeholder="Search by movie title"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
