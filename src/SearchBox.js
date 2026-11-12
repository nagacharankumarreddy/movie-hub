import React from "react";

const SearchBox = ({ searchQuery, setSearchQuery }) => (
  <div className="search">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
    <input
      type="search"
      aria-label="Search movies"
      placeholder="Search any movie…"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    {searchQuery && (
      <button type="button" aria-label="Clear search" onClick={() => setSearchQuery("")}>
        ×
      </button>
    )}
  </div>
);

export default SearchBox;
