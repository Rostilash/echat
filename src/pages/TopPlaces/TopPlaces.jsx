import React, { useEffect, useState } from "react";
import { fetchPlaces } from "../../services/fetchTopPlaces";
import style from "./TopPlaces.module.css";
import { LoaderSmall } from "./../../components/Loader/LoaderSmall";

export function TopPlaces() {
  const [places, setPlaces] = useState({
    cafes: [],
    restaurants: [],
    bars: [],
    pubs: [],
    historic: [],
  });

  const [visible, setVisible] = useState({
    cafes: 5,
    restaurants: 5,
    bars: 5,
    pubs: 5,
    historic: 5,
  });

  const [loading, setLoading] = useState(true);

  // Load data from fetchPlaces, only that have names.
  useEffect(() => {
    fetchPlaces().then((data) => {
      const filteredData = {};
      for (const key in data) {
        filteredData[key] = data[key].filter((el) => el.tags && el.tags.name);
      }
      setPlaces(filteredData);
      setLoading(false);
    });
  }, []);

  const showMore = (type) => {
    setVisible((prev) => ({
      ...prev,
      [type]: prev[type] + 10,
    }));
  };

  const hideShow = (type) => {
    setVisible((prev) => ({
      ...prev,
      [type]: 0,
    }));
  };

  // Render HTML
  const renderList = (items, type, label, emoji) => (
    <div className={style.show_block}>
      <h2>
        {emoji} {label}
      </h2>
      <ul>
        {items.slice(0, visible[type]).map((place, index) => (
          <li
            key={place.id}
            className={style.visible} // додається клас для анімації
          >
            <span>{index + 1} </span>
            <a href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`} target="_blank" rel="noopener noreferrer">
              {place.tags.name}
            </a>
          </li>
        ))}
      </ul>
      <div className={style.buttons}>
        {items.length > visible[type] && (
          <>
            <button className={style.show_more_button} onClick={() => showMore(type)}>
              Показати ще
            </button>
            {" / "}
          </>
        )}
        <button className={style.show_more_button} onClick={() => hideShow(type)}>
          Приховати
        </button>
      </div>
    </div>
  );

  return (
    <>
      {loading ? (
        <div className={style.loader}>
          <LoaderSmall />
        </div>
      ) : (
        <div className={style.top_places}>
          <h1>
            <img alt="icon" src="https://cdn-icons-png.flaticon.com/128/9908/9908202.png" style={{ height: "30px", width: "30px" }} /> Топ місця
          </h1>
          {renderList(places.historic, "historic", "Історичні місця", "🏛️")}
          {renderList(places.pubs, "pubs", "Паби", "🍺")}
          {renderList(places.restaurants, "restaurants", "Ресторани", "🍽️")}
          {renderList(places.cafes, "cafes", "Кафе", "☕")}
          {renderList(places.bars, "bars", "Бари", "🍸")}
        </div>
      )}
    </>
  );
}
