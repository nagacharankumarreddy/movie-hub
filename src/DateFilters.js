import React from "react";

const DateFilters = ({ selectedFilter, setSelectedFilter }) => {
  const filters = [
    "this-week",
    "last-week",
    "upcoming-week",
    "upcoming-month",
    "all",
  ];

  return (
    <div className="flex flex-wrap justify-start gap-2">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`px-4 py-2 rounded-lg text-white ${
            selectedFilter === filter ? "bg-blue-500" : "bg-gray-700"
          } hover:bg-blue-400`}
          onClick={() => setSelectedFilter(filter)}
        >
          {filter === "all" ? "All" : filter.replace(/-/g, " ").toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default DateFilters;
