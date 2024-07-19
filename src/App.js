import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieList from "./MovieList";
import LanguageButtons from "./LanguageButtons";
import DateFilters from "./DateFilters";
import "./App.css";
import { format } from "date-fns";
import { TMDB_API_KEY } from "./constants";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("te"); // Default to Telugu
  const [selectedFilter, setSelectedFilter] = useState("this-week"); // Default to This Week
  const [languageOptions] = useState([
    { code: "te", name: "Telugu" },
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
  ]);

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
      startDate = new Date(today.getFullYear(), 0, 1);
      endDate = new Date(today.getFullYear(), 11, 31);
    }

    return { startDate, endDate };
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const apiKey = "YOUR_TMDB_API_KEY";
        const { startDate, endDate } = getDateRange(selectedFilter);
        const response = await axios.get(
          "https://api.themoviedb.org/3/discover/movie",
          {
            params: {
              api_key: TMDB_API_KEY,
              language: "en-US",
              sort_by: "release_date.desc",
              with_original_language: selectedLanguage,
              "primary_release_date.gte": format(startDate, "yyyy-MM-dd"),
              "primary_release_date.lte": format(endDate, "yyyy-MM-dd"),
              page: 1,
            },
          }
        );

        // Fetch detailed information for each movie
        const detailedMovies = await Promise.all(
          response.data.results.map(async (movie) => {
            try {
              const details = await axios.get(
                `https://api.themoviedb.org/3/movie/${movie.id}`,
                {
                  params: {
                    api_key: TMDB_API_KEY,
                    language: "en-US",
                  },
                }
              );
              const credits = await axios.get(
                `https://api.themoviedb.org/3/movie/${movie.id}/credits`,
                {
                  params: {
                    api_key: TMDB_API_KEY,
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
        setMovies(sortedMovies);
        setFilteredMovies(sortedMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, [selectedLanguage, selectedFilter]);

  useEffect(() => {
    // Reset filter to "This Week" when language changes
    setSelectedFilter("this-week");
  }, [selectedLanguage]);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-4xl font-bold text-center mb-4">Upcoming Movies</h1>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <LanguageButtons
            languageOptions={languageOptions}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
          <DateFilters
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
        </div>
      </div>
      <MovieList movies={filteredMovies} />
    </div>
  );
};

export default App;
