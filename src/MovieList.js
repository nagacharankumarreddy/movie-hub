import React from "react";

const MovieList = ({ movies }) => {
  const placeholderImage = "./no-poster-available.jpg";
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((movie) => {
        const posterUrl = movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : placeholderImage;

        const releaseDate = new Date(movie.release_date).toLocaleDateString(
          "en-GB",
          { day: "2-digit", month: "short", year: "numeric" }
        );

        const status = movie.status ? movie.status.toUpperCase() : "N/A";
        const genres = movie.genres
          ? movie.genres.map((genre) => genre.name).join(", ")
          : "N/A";

        return (
          <div
            key={movie.id}
            className="relative bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-110 hover:shadow-2xl"
          >
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-64 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholderImage;
              }}
            />
            <div className="absolute top-0 right-0 bg-blue-700 text-white text-xs font-bold py-1 px-2 rounded-bl-lg">
              {status}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{movie.title}</h2>
              <p className="text-sm mb-1">
                <strong>Release Date:</strong> {releaseDate}
              </p>
              <p className="text-sm mb-1">
                <strong>Cast:</strong>{" "}
                {movie.credits?.cast
                  .slice(0, 3)
                  .map((cast) => cast.name)
                  .join(", ") || "N/A"}
              </p>
              <p className="text-sm">
                <strong>Director:</strong>{" "}
                {movie.credits?.crew.find((member) => member.job === "Director")
                  ?.name || "N/A"}
              </p>
              <p className="text-sm mt-2">
                <strong>Genre:</strong> {genres}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MovieList;
