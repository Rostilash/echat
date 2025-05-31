import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { fetchMovieDetails, getBookmarkedMovieIds, hasUserBookmarkedMovie, toggleMovieBookmark } from "./../../services/bookmarksService";
import { Action } from "../Home/components/Action";

export const BookmarkedMovies = () => {
  const { currentUser } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const loadBookmarkedMovies = async () => {
      if (!currentUser) return;

      setLoading(true);
      try {
        const ids = await getBookmarkedMovieIds(currentUser?.uid);
        const validIds = ids.filter((id) => typeof id === "number" || typeof id === "string");

        const moviesData = await Promise.all(
          validIds.map(async (id) => {
            console.log("Fetching movie with id:", id);
            try {
              return await fetchMovieDetails(id);
            } catch (err) {
              console.error(`Error fetching movie ${id}:`, err);
              return null;
            }
          })
        );

        setMovies(moviesData.filter(Boolean)); // видаляємо null
      } catch (err) {
        console.error("Failed to load bookmarked movies:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBookmarkedMovies();
  }, [currentUser]);

  const handleBookmark = async (movieId) => {
    if (!currentUser) {
      alert("Щоб додати у вибране, увійдіть у свій акаунт.");
      return;
    }
    await toggleMovieBookmark(movieId, currentUser?.uid);

    // setMovies(movies.filter((movie) => movie.id !== movieId));
    // setIsBookmarked(false);
  };

  useEffect(() => {
    const checkBookmark = async () => {
      if (!selectedMovie || !currentUser) return;
      const result = await hasUserBookmarkedMovie(selectedMovie.id, currentUser.uid);
      setIsBookmarked(result);
    };

    checkBookmark();
  }, [selectedMovie, currentUser]);
  if (loading) return <div>Завантаження...</div>;

  return (
    <div>
      {movies.length === 0 ? (
        <p style={{ textAlign: "center" }}>Немає збережених.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          {movies.map((movie) => (
            <div key={movie.id} style={{ border: "1px solid #ccc", padding: "10px", width: "200px" }}>
              <img src={movie.medium_cover_image} alt={movie.title} style={{ width: "100%" }} />
              <h4>{movie.title}</h4>
              <p>Рейтинг: {movie.rating}</p>
              <p>Рік: {movie.year}</p>
              <p>
                <Action
                  handleClick={() => handleBookmark(movie.id)}
                  isActive={!isBookmarked}
                  activeImage="https://cdn-icons-png.flaticon.com/128/4942/4942550.png"
                  defaultImage="https://cdn-icons-png.flaticon.com/128/3983/3983871.png"
                />
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
