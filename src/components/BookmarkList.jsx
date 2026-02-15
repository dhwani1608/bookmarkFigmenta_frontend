import BookmarkItem from "./BookmarkItem";

const BookmarkList = ({ bookmarks, onEdit, onDelete, onTagClick }) => {
  if (!bookmarks.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        No bookmarks yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {bookmarks.map((bookmark) => (
        <BookmarkItem
          key={bookmark.id}
          bookmark={bookmark}
          onEdit={() => onEdit(bookmark)}
          onDelete={() => onDelete(bookmark.id)}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  );
};

export default BookmarkList;
