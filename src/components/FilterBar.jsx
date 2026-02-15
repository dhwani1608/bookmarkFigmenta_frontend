const FilterBar = ({ activeTag, onClear }) => {
  if (!activeTag) {
    return null;
  }
  return (
    <button className="tag active" onClick={onClear}>
      Clear filter: {activeTag}
    </button>
  );
};

export default FilterBar;
