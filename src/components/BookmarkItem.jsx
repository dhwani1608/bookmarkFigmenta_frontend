const truncate = (text, maxLength = 120) => {
  if (!text) {
    return "";
  }
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const BookmarkItem = ({ bookmark, onEdit, onDelete, onTagClick }) => {
  return (
    <article className="rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {bookmark.title}
          </h3>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex text-sm text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-300"
          >
            {bookmark.url}
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600 transition hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"
            onClick={() => {
              if (window.confirm("Delete this bookmark?")) {
                onDelete();
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
      {bookmark.description && (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          {truncate(bookmark.description)}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {bookmark.tags.map((tag) => (
          <button
            key={tag}
            className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
            onClick={() => onTagClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </article>
  );
};

export default BookmarkItem;
