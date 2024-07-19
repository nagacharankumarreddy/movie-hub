import React from "react";

const SearchBox = ({ searchQuery, setSearchQuery }) => {
  return (
    <input
      type="text"
      placeholder="Search movies..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full md:w-1/3 py-2 px-4 rounded-lg  border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
    />
  );
};

export default SearchBox;
