import { useEffect, useMemo, useState } from "react";
import {
  getBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark,
} from "./api";
import BookmarkForm from "./components/BookmarkForm";
import BookmarkList from "./components/BookmarkList";

const App = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [theme, setTheme] = useState(() => {
    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const loadBookmarks = async (tag) => {
    setLoading(true);
    setError("");
    try {
      const data = await getBookmarks(tag);
      setBookmarks(data);
    } catch (err) {
      setError(err.message || "Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks(activeTag);
  }, [activeTag]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const handleCreate = async (payload) => {
    setError("");
    try {
      const created = await createBookmark(payload);
      setBookmarks((prev) => [created, ...prev]);
    } catch (err) {
      setError(err.message || "Failed to add bookmark");
      throw err;
    }
  };

  const handleUpdate = async (id, payload) => {
    setError("");
    try {
      const updated = await updateBookmark(id, payload);
      setBookmarks((prev) => prev.map((item) => (item.id === id ? updated : item)));
      setEditing(null);
    } catch (err) {
      setError(err.message || "Failed to update bookmark");
      throw err;
    }
  };

  const handleDelete = async (id) => {
    const previous = bookmarks;
    setBookmarks((prev) => prev.filter((item) => item.id !== id));
    try {
      await deleteBookmark(id);
    } catch (err) {
      setBookmarks(previous);
      setError(err.message || "Failed to delete bookmark");
    }
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return bookmarks;
    }
    return bookmarks.filter(
      (bookmark) =>
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.url.toLowerCase().includes(query)
    );
  }, [bookmarks, search]);

  const resultsLabel = `${filtered.length} of ${bookmarks.length}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50 transition dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Personal knowledge vault
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Bookmark Manager
            </h1>
            <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">
              Track useful links fast and stay organized.
            </p>
          </div>
          <div className="flex w-full flex-col items-start gap-3 sm:w-auto sm:items-end">
            <div className="w-full sm:w-80">
              <label
                htmlFor="search"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400"
              >
                Search
              </label>
              <input
                id="search"
                type="search"
                placeholder="Search by title or URL"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-700"
              />
            </div>
            <button
              className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white"
              onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
              type="button"
            >
              {theme === "light" ? "Dark mode" : "Light mode"}
            </button>
          </div>
        </header>

        <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Add bookmark</h2>
          <div className="mt-4">
            <BookmarkForm onSubmit={handleCreate} submitLabel="Add bookmark" />
          </div>
        </section>

        {editing && (
          <section className="rounded-3xl border border-amber-200/70 bg-amber-50/80 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.08)] backdrop-blur dark:border-amber-500/30 dark:bg-amber-500/10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Edit bookmark</h2>
              <button
                className="rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white"
                onClick={() => setEditing(null)}
              >
                Cancel edit
              </button>
            </div>
            <div className="mt-4">
              <BookmarkForm
                initialValues={editing}
                onSubmit={(payload) => handleUpdate(editing.id, payload)}
                submitLabel="Save changes"
                onCancel={() => setEditing(null)}
              />
            </div>
          </section>
        )}

        <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Bookmarks</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Showing {resultsLabel}
              </p>
            </div>
            <div>
              {activeTag ? (
                <button
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
                  onClick={() => setActiveTag("")}
                >
                  Clear filter: {activeTag}
                </button>
              ) : (
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Click a tag to filter
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </div>
          )}
          {loading ? (
            <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Loading bookmarks...
            </div>
          ) : (
            <div className="mt-4">
              <BookmarkList
                bookmarks={filtered}
                onEdit={setEditing}
                onDelete={handleDelete}
                onTagClick={setActiveTag}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default App;
