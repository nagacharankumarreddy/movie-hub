import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import MovieList from "./MovieList";
import LanguageButtons from "./LanguageButtons";
import DateFilters from "./DateFilters";
import SearchBox from "./SearchBox";
import Loader from "./Loader";
import useDebounce from "./useDebounce";
import { TMDB_API_KEY } from "./constants";
import "./App.css";

const LANGUAGES = [
  { code: "te", name: "Telugu" },
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
];

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: { api_key: TMDB_API_KEY, language: "en-US" },
});

const getDateRange = (filter) => {
  const today = new Date();
  let startDate = new Date();
  let endDate = new Date();

  if (filter === "last-week") {
    startDate.setDate(today.getDate() - today.getDay() - 7);
    endDate.setDate(today.getDate() - today.getDay() - 1);
  } else if (filter === "this-week") {
    startDate.setDate(today.getDate() - today.getDay());
    endDate.setDate(startDate.getDate() + 6);
  } else if (filter === "upcoming-week") {
    startDate.setDate(today.getDate() + (7 - today.getDay()));
    endDate.setDate(startDate.getDate() + 6);
  } else if (filter === "upcoming-month") {
    startDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);
  } else {
    // "all": everything from last week onwards.
    startDate.setDate(today.getDate() - today.getDay() - 7);
    endDate = null;
  }
  return { startDate, endDate };
};

// Adds runtime, genres, status, cast and crew to each search/discover result.
const withDetails = (movies) =>
  Promise.all(
    movies.map(async (movie) => {
      try {
        const { data } = await tmdb.get(`/movie/${movie.id}`, {
          params: { append_to_response: "credits" },
        });
        return data;
      } catch (error) {
        return movie;
      }
    })
  );

const App = () => {
  const [movies, setMovies] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("te");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const query = useDebounce(searchQuery, 500).trim();

  useEffect(() => {
    let stale = false;

    const load = async () => {
      setLoading(true);
      setFailed(false);
      try {
        let results;
        if (query) {
          const { data } = await tmdb.get("/search/movie", { params: { query, page: 1 } });
          results = data.results;
        } else {
          const { startDate, endDate } = getDateRange(selectedFilter);
          const { data } = await tmdb.get("/discover/movie", {
            params: {
              sort_by: "release_date.desc",
              with_original_language: selectedLanguage,
              "primary_release_date.gte": format(startDate, "yyyy-MM-dd"),
              ...(endDate && { "primary_release_date.lte": format(endDate, "yyyy-MM-dd") }),
              page: 1,
            },
          });
          results = data.results;
        }
        const detailed = await withDetails(results);
        detailed.sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0));
        if (!stale) setMovies(detailed);
      } catch (error) {
        if (!stale) {
          setMovies([]);
          setFailed(true);
        }
      } finally {
        if (!stale) setLoading(false);
      }
    };

    load();
    return () => {
      stale = true;
    };
  }, [selectedLanguage, selectedFilter, query]);

  const searching = Boolean(query);

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-inner">
          <p className="eyebrow">Now showing &amp; coming soon</p>
          <h1 className="title">
            Movie <span>Hub</span>
          </h1>
          <p className="lead">
            Fresh releases and what's next in Telugu, English and Hindi cinema.
          </p>
          <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
      </header>

      <main className="shell">
        <div className={`toolbar ${searching ? "toolbar-muted" : ""}`}>
          <LanguageButtons
            languageOptions={LANGUAGES}
            selectedLanguage={selectedLanguage}
            handleLanguageClick={setSelectedLanguage}
            disabled={searching}
          />
          <DateFilters
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            disabled={searching}
          />
        </div>

        <p className="result-line" aria-live="polite">
          {loading
            ? "Loading movies…"
            : searching
            ? `${movies.length} result${movies.length === 1 ? "" : "s"} for “${query}”`
            : `${movies.length} movie${movies.length === 1 ? "" : "s"}`}
        </p>

        {loading ? (
          <Loader />
        ) : failed ? (
          <div className="empty">
            <strong>Couldn't load movies</strong>
            <span>Check your connection and try again.</span>
          </div>
        ) : movies.length === 0 ? (
          <div className="empty">
            <strong>No movies found</strong>
            <span>Try a different {searching ? "search" : "date range or language"}.</span>
          </div>
        ) : (
          <MovieList movies={movies} />
        )}
      </main>

      <footer className="footer">Movie data from TMDB</footer>
    </div>
  );
};

export default App;
