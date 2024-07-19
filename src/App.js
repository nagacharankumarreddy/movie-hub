import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieList from "./MovieList";
import LanguageButtons from "./LanguageButtons";
import DateFilters from "./DateFilters";
import SearchBox from "./SearchBox";
import "./App.css";
import { format } from "date-fns";
import { TMDB_API_KEY } from "./constants";
import Loader from "./Loader";
import useDebounce from "./useDebounce";

const App = () => {
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("te");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [languageOptions] = useState([
    { code: "te", name: "Telugu" },
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(window.innerWidth >= 768);
  const [loading, setLoading] = useState(false);

  console.log(selectedLanguage, selectedLanguage);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

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
      return null;
    }

    return { startDate, endDate };
  };

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const apiKey = TMDB_API_KEY;
        const { startDate } = getDateRange("last-week");

        const response = await axios.get(
          "https://api.themoviedb.org/3/discover/movie",
          {
            params: {
              api_key: apiKey,
              language: "en-US",
              sort_by: "release_date.desc",
              with_original_language: selectedLanguage,
              "primary_release_date.gte": format(startDate, "yyyy-MM-dd"),
              page: 1,
            },
          }
        );

        const detailedMovies = await Promise.all(
          response.data.results.map(async (movie) => {
            try {
              const details = await axios.get(
                `https://api.themoviedb.org/3/movie/${movie.id}`,
                {
                  params: {
                    api_key: apiKey,
                    language: "en-US",
                  },
                }
              );
              const credits = await axios.get(
                `https://api.themoviedb.org/3/movie/${movie.id}/credits`,
                {
                  params: {
                    api_key: apiKey,
                  },
                }
              );
              return { ...details.data, credits: credits.data };
            } catch (error) {
              console.error(
                `Error fetching details for movie ${movie.id}:`,
                error
              );
              return movie;
            }
          })
        );

        const sortedMovies = detailedMovies.sort(
          (a, b) => new Date(b.release_date) - new Date(a.release_date)
        );
        setFilteredMovies(sortedMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedFilter === "all") {
      fetchMovies();
    }
  }, [selectedLanguage, selectedFilter]);

  useEffect(() => {
    if (selectedFilter !== "all") {
      const fetchFilteredMovies = async () => {
        setLoading(true);
        try {
          const apiKey = TMDB_API_KEY;
          const { startDate, endDate } = getDateRange(selectedFilter);
          const response = await axios.get(
            "https://api.themoviedb.org/3/discover/movie",
            {
              params: {
                api_key: apiKey,
                language: "en-US",
                sort_by: "release_date.desc",
                with_original_language: selectedLanguage,
                "primary_release_date.gte": format(startDate, "yyyy-MM-dd"),
                "primary_release_date.lte": format(endDate, "yyyy-MM-dd"),
                page: 1,
              },
            }
          );

          const detailedMovies = await Promise.all(
            response.data.results.map(async (movie) => {
              try {
                const details = await axios.get(
                  `https://api.themoviedb.org/3/movie/${movie.id}`,
                  {
                    params: {
                      api_key: apiKey,
                      language: "en-US",
                    },
                  }
                );
                const credits = await axios.get(
                  `https://api.themoviedb.org/3/movie/${movie.id}/credits`,
                  {
                    params: {
                      api_key: apiKey,
                    },
                  }
                );
                return { ...details.data, credits: credits.data };
              } catch (error) {
                console.error(
                  `Error fetching details for movie ${movie.id}:`,
                  error
                );
                return movie;
              }
            })
          );

          const sortedMovies = detailedMovies.sort(
            (a, b) => new Date(b.release_date) - new Date(a.release_date)
          );
          setFilteredMovies(sortedMovies);
        } catch (error) {
          console.error("Error fetching filtered movies:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchFilteredMovies();
    }
  }, [selectedLanguage, selectedFilter]);

  useEffect(() => {
    if (debouncedSearchQuery) {
      const searchMovies = async () => {
        setLoading(true);
        try {
          const apiKey = TMDB_API_KEY;
          const response = await axios.get(
            "https://api.themoviedb.org/3/search/movie",
            {
              params: {
                api_key: apiKey,
                language: "en-US",
                query: debouncedSearchQuery,
                page: 1,
              },
            }
          );

          const detailedMovies = await Promise.all(
            response.data.results.map(async (movie) => {
              try {
                const details = await axios.get(
                  `https://api.themoviedb.org/3/movie/${movie.id}`,
                  {
                    params: {
                      api_key: apiKey,
                      language: "en-US",
                    },
                  }
                );
                const credits = await axios.get(
                  `https://api.themoviedb.org/3/movie/${movie.id}/credits`,
                  {
                    params: {
                      api_key: apiKey,
                    },
                  }
                );
                return { ...details.data, credits: credits.data };
              } catch (error) {
                console.error(
                  `Error fetching details for movie ${movie.id}:`,
                  error
                );
                return movie;
              }
            })
          );

          const sortedMovies = detailedMovies.sort(
            (a, b) => new Date(b.release_date) - new Date(a.release_date)
          );
          setFilteredMovies(sortedMovies);
        } catch (error) {
          console.error("Error searching movies:", error);
        } finally {
          setLoading(false);
        }
      };

      searchMovies();
    } else {
      setSelectedFilter("all");
      setSelectedLanguage("te");
    }
  }, [debouncedSearchQuery]);

  const handleLanguageClick = (code) => {
    setSelectedLanguage(code);
    setShowFilters(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-4xl font-bold text-center mb-4 hidden md:block">
          What's New in Movies? 🎬🍿
        </h1>
        <h1 className="text-2xl font-bold text-center mb-4 md:hidden">
          Movie Hub🍿
        </h1>
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <LanguageButtons
              languageOptions={languageOptions}
              selectedLanguage={selectedLanguage}
              handleLanguageClick={handleLanguageClick}
            />
          </div>
          <div
            className={`flex flex-wrap gap-2 mt-4 md:mt-0 ${
              !showFilters ? "hidden" : ""
            }`}
          >
            <DateFilters
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          </div>
        </div>
      </div>
      {loading ? <Loader /> : <MovieList movies={filteredMovies} />}
    </div>
  );
};

export default App;
