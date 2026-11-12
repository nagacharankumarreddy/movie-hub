import React from "react";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "last-week", label: "Last week" },
  { id: "this-week", label: "This week" },
  { id: "upcoming-week", label: "Next week" },
  { id: "upcoming-month", label: "Next month" },
];

const DateFilters = ({ selectedFilter, setSelectedFilter, disabled }) => (
  <div className="chips" role="group" aria-label="Release date">
    {FILTERS.map((filter) => (
      <button
        key={filter.id}
        type="button"
        className={`chip ${selectedFilter === filter.id ? "chip-active" : ""}`}
        aria-pressed={selectedFilter === filter.id}
        disabled={disabled}
        onClick={() => setSelectedFilter(filter.id)}
      >
        {filter.label}
      </button>
    ))}
  </div>
);

export default DateFilters;
