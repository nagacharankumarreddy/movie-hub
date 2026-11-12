import React from "react";

// Placeholder cards shown while movies load, so the page doesn't jump.
const Loader = () => (
  <div className="grid" aria-hidden="true">
    {Array.from({ length: 8 }, (_, i) => (
      <div key={i} className="card skeleton">
        <div className="poster-wrap" />
        <div className="card-body">
          <span className="bone bone-short" />
          <span className="bone" />
          <span className="bone bone-mid" />
        </div>
      </div>
    ))}
  </div>
);

export default Loader;
