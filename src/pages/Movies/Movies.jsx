import React, { useEffect, useState } from "react";
import style from "./Movies.module.css";

export const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams();
    params.append("limit", "12");

    if (!query && !genre) {
      params.append("page", page.toString());
    }

    if (query) {
      params.append("query_term", query);
    }

    if (genre) {
      params.append("genre", genre);
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
  }, [query, genre, page]);

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

  return (
    <div className={style.container}>
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
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
        <button onClick={handleSearch}>🔍 Пошук</button>
      </div>

      {loading && <div>Завантаження...</div>}
      {!loading && movies.length === 0 && <p>Фільми не знайдено.</p>}

      <div className={style.movies_items}>
        {!loading &&
          movies.map((movie) => {
            const translatedGenre = genreMap[movie.genres?.[0]] || movie.genres?.[0];
            return (
              <div key={movie.id} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "10px" }}>
                <img src={movie.medium_cover_image} alt={movie.title} style={{ width: "100%" }} />
                <h3>{movie.title}</h3>
                <p>Рейтинг: {movie.rating}</p>
                <p>Рік: {movie.year}</p>
                <p>Жанр: {translatedGenre ? translatedGenre : ""}</p>
              </div>
            );
          })}
      </div>

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
    </div>
  );
};
