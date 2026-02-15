const baseUrl = import.meta.env.VITE_API_URL || "";

const request = async (path, options) => {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
};

export const getBookmarks = (tag) => {
  const path = tag ? `/bookmarks?tag=${encodeURIComponent(tag)}` : "/bookmarks";
  return request(path);
};

export const createBookmark = (payload) =>
  request("/bookmarks", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateBookmark = (id, payload) =>
  request(`/bookmarks/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteBookmark = (id) =>
  request(`/bookmarks/${id}`, {
    method: "DELETE",
  });
