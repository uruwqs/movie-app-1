type EmptyStateProps = {
  onClearFilters: () => void;
};

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="mt-8 rounded-lg border border-dashed border-slate-700 bg-slate-900 p-8 text-center">
      <h2 className="text-2xl font-bold">No movies found</h2>
      <p className="mx-auto mt-3 max-w-md text-slate-300">
        Try a shorter title or choose another genre.
      </p>
      <button
        className="mt-6 rounded-lg bg-sky-400 px-5 py-3 font-semibold text-slate-950 hover:bg-sky-300"
        type="button"
        onClick={onClearFilters}
      >
        Clear filters
      </button>
    </div>
  );
}
