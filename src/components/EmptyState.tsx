type EmptyStateProps = {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
};

export function EmptyState({
  hasActiveFilters,
  onClearFilters,
}: EmptyStateProps) {
  return (
    <div className="mt-8 rounded-lg border border-dashed border-slate-700 bg-slate-900 p-8 text-center">
      <h2 className="text-2xl font-bold">
        {hasActiveFilters ? "No movies found" : "No movies available"}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-slate-300">
        {hasActiveFilters
          ? "Try a shorter title or choose another genre."
          : "There are no movies to show right now."}
      </p>
      {hasActiveFilters && (
        <button
          className="mt-6 rounded-lg bg-sky-400 px-5 py-3 font-semibold text-slate-950 hover:bg-sky-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
          type="button"
          onClick={onClearFilters}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
