import React, { useEffect, useState } from "react";
import style from "./Movies.module.css";
import { useAuth } from "./../../hooks/useAuth";
import { hasUserBookmarkedMovie, toggleMovieBookmark } from "../../services/bookmarksService";
import { Action } from "../Home/components/Action";
import { Button } from "./../../components/Button/Button";

export const Movies = () => {
  const { currentUser } = useAuth();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [sortBy, setSortBy] = useState("");

  const genreMap = {
    Action: "Бойовик",
    Drama: "Драма",
    Comedy: "Комедія",
    Horror: "Жахи",
    Romance: "Романтика",
    Thriller: "Трилер",
    Sci_Fi: "Фантастика",
    Animation: "Анімація",
    Documentary: "Документальний",
    Crime: "Кримінал",
    Biography: "Біографія",
    Sport: "Спорт",
    Fantasy: "Фантастика",
    Adventure: "Пригоди",
    Mystery: "Містика",
    Music: "Музика",
  };

  const openMovieModal = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMovie(null);
  };

  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams();
    params.append("limit", "15");
    params.append("page", page.toString());

    if (query) {
      params.append("query_term", query);
    }

    if (genre) {
      params.append("genre", genre);
    }

    if (sortBy) {
      params.append("sort_by", sortBy);
    }

    const url = `https://yts.mx/api/v2/list_movies.json?${params.toString()}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const { movie_count, movies, limit, page_number } = data.data;
        setTotalPages(Math.ceil(movie_count / limit));
        setPage(page_number);
        setMovies(movies || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query, genre, page, sortBy]);

  const handleSearch = () => {
    setQuery(searchTerm.trim());
    setGenre(selectedGenre);
    setPage(1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handleBookmark = async () => {
    if (!currentUser) {
      alert("Щоб додати у вибране, увійдіть у свій акаунт.");
      return;
    }
    await toggleMovieBookmark(selectedMovie?.id, currentUser?.uid);
    setIsBookmarked(true);
  };

  useEffect(() => {
    const checkBookmark = async () => {
      if (!selectedMovie || !currentUser) return;
      const result = await hasUserBookmarkedMovie(selectedMovie.id, currentUser.uid);
      setIsBookmarked(result);
    };

    checkBookmark();
  }, [selectedMovie, currentUser]);

  return (
    <div className={style.container}>
      <div className={style.movie_actions}>
        <input
          type="text"
          placeholder="Введіть на англійській"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "8px", width: "300px" }}
        />
        <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
          <option value="">Всі жанри</option>
          {Object.entries(genreMap).map(([eng, ukr]) => (
            <option key={eng} value={eng}>
              {ukr}
            </option>
          ))}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Сортувати за...</option>
          <option value="rating">Рейтингом</option>
          <option value="year">Роком</option>
          <option value="title">Назвою</option>
          <option value="download_count">Популярністю</option>
          <option value="like_count">Вподобаннями</option>
        </select>

        <Button onClick={handleSearch} variant="empty" size="small" position="left">
          {" "}
          Пошук
        </Button>
      </div>

      {loading && <div>Завантаження...</div>}
      {!loading && movies.length === 0 && <p>Фільми не знайдено.</p>}

      <div className={style.movies_items}>
        {!loading &&
          movies.map((movie) => {
            const translatedGenre = genreMap[movie.genres?.[0]] || movie.genres?.[0];
            return (
              <div
                key={movie.id}
                onClick={() => openMovieModal(movie)}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
              >
                <img src={movie.medium_cover_image} alt={movie.title} style={{ width: "100%" }} />
                <h3>{movie.title}</h3>
                <p>Рейтинг: {movie.rating}</p>
                <p>Рік: {movie.year}</p>
                <p>Жанр: {translatedGenre ? translatedGenre : ""}</p>
              </div>
            );
          })}
      </div>
      {!loading && (
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
          <button onClick={handlePrevPage} disabled={page === 1}>
            ⬅ Попередня
          </button>
          <span>
            Сторінка {page} з {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={page === totalPages}>
            Наступна ➡
          </button>
        </div>
      )}
      {/* Our modal window */}
      {showModal && selectedMovie && (
        <div className={style.modalBackdrop} onClick={closeModal}>
          <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={style.closeButton} onClick={closeModal}>
              ✖
            </button>
            <h2>{selectedMovie.title}</h2>
            <img src={selectedMovie.large_cover_image} alt={selectedMovie.title} style={{ width: "100%" }} />
            <p>
              <strong>Рік:</strong> {selectedMovie.year}
            </p>
            <p>
              <strong>Рейтинг:</strong> {selectedMovie.rating}
            </p>
            <p>
              <strong>Опис:</strong> {selectedMovie.description_full || "Немає опису."}
            </p>
            <p>
              <strong>Жанри:</strong> {(selectedMovie.genres || []).map((g) => genreMap[g] || g).join(", ")}
            </p>
            {selectedMovie.torrents && (
              <>
                <h3>Торренти:</h3>
                <ul>
                  {selectedMovie.torrents.map((t, idx) => (
                    <li key={idx}>
                      <a href={t.url} target="_blank" rel="noopener noreferrer">
                        {t.quality} / {t.type} — {t.size}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <h3>Додати у вибране: </h3>
            <Action
              handleClick={handleBookmark}
              isActive={isBookmarked}
              activeImage="https://cdn-icons-png.flaticon.com/128/4942/4942550.png"
              defaultImage="https://cdn-icons-png.flaticon.com/128/3983/3983871.png"
            />
          </div>
        </div>
      )}
    </div>
  );
};
