import React from "react";

const Filter = ({ filterText, setFilterText }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Filter by movie title..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="p-2 border border-gray-300 rounded w-full"
      />
    </div>
  );
};

export default Filter;
