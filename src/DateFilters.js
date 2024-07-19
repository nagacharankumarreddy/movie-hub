import React from "react";

const DateFilters = ({ selectedFilter, setSelectedFilter }) => {
  const filters = [
    { code: "last-week", label: "Last Week" },
    { code: "this-week", label: "This Week" },
    { code: "upcoming-week", label: "Upcoming Week" },
    { code: "upcoming-month", label: "Upcoming Month" },
  ];

  return (
    <div className="flex justify-center mb-4">
      {filters.map((filter) => (
        <button
          key={filter.code}
          className={`px-4 py-2 mx-2 rounded-lg text-white ${
            selectedFilter === filter.code
              ? "bg-green-500 border-2 border-green-700"
              : "bg-gray-600 hover:bg-gray-700"
          } transition duration-300 ease-in-out`}
          onClick={() => setSelectedFilter(filter.code)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default DateFilters;
