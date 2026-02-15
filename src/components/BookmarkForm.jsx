import { useEffect, useState } from "react";

const isValidUrl = (value) => {
  try {
    new URL(value);
    return true;
  } catch (error) {
    return false;
  }
};

const defaultValues = {
  url: "",
  title: "",
  description: "",
  tags: "",
};

const BookmarkForm = ({ initialValues, onSubmit, submitLabel, onCancel }) => {
  const [values, setValues] = useState(defaultValues);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setValues({
        url: initialValues.url || "",
        title: initialValues.title || "",
        description: initialValues.description || "",
        tags: (initialValues.tags || []).join(", "),
      });
    } else {
      setValues(defaultValues);
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!values.url.trim() || !values.title.trim()) {
      setError("URL and title are required.");
      return;
    }
    if (!isValidUrl(values.url.trim())) {
      setError("Please enter a valid URL.");
      return;
    }

    const tags = values.tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

    if (tags.length > 5) {
      setError("Add up to 5 tags.");
      return;
    }

    const payload = {
      url: values.url.trim(),
      title: values.title.trim().slice(0, 200),
      description: values.description.trim().slice(0, 500),
      tags,
    };

    try {
      setSaving(true);
      await onSubmit(payload);
      if (!initialValues) {
        setValues(defaultValues);
      }
    } catch (err) {
      setError(err.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label htmlFor="url" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          URL *
        </label>
        <input
          id="url"
          name="url"
          value={values.url}
          onChange={handleChange}
          placeholder="https://example.com"
          required
          className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-700"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="title" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Title *
        </label>
        <input
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          maxLength={200}
          required
          className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-700"
        />
      </div>

      <div className="grid gap-2">
        <label
          htmlFor="description"
          className="text-sm font-semibold text-slate-700 dark:text-slate-200"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={handleChange}
          maxLength={500}
          rows={3}
          className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-700"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="tags" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Tags
        </label>
        <input
          id="tags"
          name="tags"
          value={values.tags}
          onChange={handleChange}
          placeholder="react, docs"
          className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-700"
        />
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            className="rounded-2xl border border-slate-200 bg-white/70 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-600"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default BookmarkForm;
