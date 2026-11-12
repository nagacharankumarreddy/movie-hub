import React, { useState } from "react";

const STATUS_CLASS = {
  Released: "badge-released",
  "In Production": "badge-production",
  "Post Production": "badge-production",
  Planned: "badge-planned",
  Rumored: "badge-rumored",
};

const formatDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "Date to be announced";
};

const Poster = ({ movie }) => {
  const [broken, setBroken] = useState(false);
  if (!movie.poster_path || broken) {
    return (
      <div className="poster poster-empty" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" />
        </svg>
        <span>No poster yet</span>
      </div>
    );
  }
  return (
    <img
      className="poster"
      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
      alt={`${movie.title} poster`}
      loading="lazy"
      onError={() => setBroken(true)}
    />
  );
};

const MovieCard = ({ movie }) => {
  const cast = movie.credits?.cast?.slice(0, 3).map((person) => person.name).join(", ");
  const director = movie.credits?.crew?.find((member) => member.job === "Director")?.name;
  const genres = movie.genres?.slice(0, 3) || [];
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;

  return (
    <article className="card">
      <div className="poster-wrap">
        <Poster movie={movie} />
        {movie.status && (
          <span className={`badge ${STATUS_CLASS[movie.status] || "badge-planned"}`}>{movie.status}</span>
        )}
        {rating && (
          <span className="rating" aria-label={`Rated ${rating} out of 10`}>
            ★ {rating}
          </span>
        )}
      </div>
      <div className="card-body">
        <p className="date">{formatDate(movie.release_date)}</p>
        <h2 className="card-title">{movie.title}</h2>
        {genres.length > 0 && (
          <ul className="genres">
            {genres.map((genre) => (
              <li key={genre.id}>{genre.name}</li>
            ))}
          </ul>
        )}
        <dl className="credits">
          {cast && (
            <>
              <dt>Cast</dt>
              <dd>{cast}</dd>
            </>
          )}
          {director && (
            <>
              <dt>Director</dt>
              <dd>{director}</dd>
            </>
          )}
        </dl>
      </div>
    </article>
  );
};

const MovieList = ({ movies }) => (
  <div className="grid">
    {movies.map((movie) => (
      <MovieCard key={movie.id} movie={movie} />
    ))}
  </div>
);

export default MovieList;
