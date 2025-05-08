import React, { useState } from "react";
import style from "./Rightbar.module.css";
import { Input } from "./../Input/Input";
import { Button } from "./../Button/Button";

export const Rightbar = ({ onSelectFilter, posts = [] }) => {
  const [formData, setFormData] = useState({ search: "" });
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [errors, setErrors] = useState({});

  const [visibleBlocks, setVisibleBlocks] = useState(3);

  // We group posts by tags and calculate the rating
  const tagStats = {};
  posts.forEach((post) => {
    post.tags?.forEach((tag) => {
      const score = post.likes + post.reposts;
      if (tagStats[tag]) {
        tagStats[tag].count += 1;
        tagStats[tag].score += score;
      } else {
        tagStats[tag] = { count: 1, score };
      }
    });
  });

  const defaultTags = [
    { tag: "#економіка", count: 12 },
    { tag: "#технології", count: 7 },
    { tag: "#освіта", count: 4 },
  ];

  const displayedTags = posts.length
    ? Object.entries(tagStats)
        .sort(([, a], [, b]) => b.score - a.score)
        .slice(0, visibleBlocks)
    : defaultTags.slice(0, visibleBlocks);

  // today posts
  const today = new Date().toISOString().split("T")[0]; // "2025-05-08"

  const todayPosts = posts.filter((p) => {
    const baseDate = (p.timestamp || p.scheduledFor)?.split("T")[0];
    return baseDate === today;
  });

  // tomorrow posts
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = tomorrow.toISOString().split("T")[0];
  const tomorrowPosts = posts.filter((p) => p.scheduledFor?.split("T")[0] === tomorrowFormatted);

  // Search posts for today
  const newsBlocks = [];

  if (todayPosts.length > 0) {
    newsBlocks.push({
      label: "Сьогодні",
      description: "Заплановано / Сьогодні",
      count: todayPosts.length,
      icon: "📅",
      filter: "Сьогодні",
    });
  }

  // Search posts for tomorrow
  if (tomorrowPosts.length > 0) {
    newsBlocks.push({
      label: "Завтра",
      description: "Заплановано / Завтра",
      count: tomorrowPosts.length,
      icon: "🗓️",
      filter: "Завтра",
    });
  }

  //   // Search posts for #tags
  displayedTags.forEach((item) => {
    const tag = posts.length ? item[0] : item.tag;
    const stats = posts.length ? item[1] : { count: item.count };

    if (stats.count > 0) {
      newsBlocks.push({
        label: tag,
        description: "Україна / Актуальне",
        count: stats.count,
        icon: "⋯",
        filter: tag,
      });
    }
  });

  // Input Search
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "search") {
      if (value.trim().length > 0) {
        const filtered = newsBlocks.filter((block) => block.label.toLowerCase().includes(value.toLowerCase()));

        setSearchResults(filtered);
        setShowSuggestions(true);
      } else {
        setSearchResults([]);
        setShowSuggestions(false);
      }
    }
  };
  console.log(newsBlocks);

  return (
    <aside className={style.rightbar}>
      {/* search bar */}
      <Input
        type="search"
        name="search"
        placeholder="Пошук"
        value={formData.search}
        onChange={handleChange}
        error={errors.name}
        size="small"
        icon="https://cdn-icons-png.flaticon.com/128/13984/13984009.png"
        focusIcon="https://cdn-icons-png.flaticon.com/128/18290/18290728.png"
      />

      {/* dropdown search input */}
      {showSuggestions && (
        <div className={style.suggestions}>
          {searchResults.length > 0 ? (
            searchResults.map((block) => (
              <div
                key={block.label}
                className={style.suggestionItem}
                onClick={() => {
                  onSelectFilter(block.filter);
                  setFormData({ search: "" });
                  setShowSuggestions(false);
                }}
              >
                {block.label} — {block.description}
              </div>
            ))
          ) : (
            <div className={style.noResults}>Нічого не знайдено</div>
          )}
        </div>
      )}

      {/* News Block */}
      <div className={style.news_block}>
        <h2>Що відбувається</h2>

        {/* Put only 3 post items */}
        {newsBlocks.slice(0, visibleBlocks).map((block) => (
          <div key={block.label} className={style.newsItem}>
            <div className={style.newsContent}>
              <div className={style.newsTitles}>
                <p className={style.newsInfoText}>{block.description}</p>
                <p className={style.newsName} onClick={() => onSelectFilter(block.filter)}>
                  {block.label}
                </p>
                <p className={style.newsInfoText}>Постів: {block.count}</p>
              </div>
              <div className={style.newsOptions}>
                <span>{block.icon}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Add posts button*/}
        <div className={style.newsItem}>
          {visibleBlocks < newsBlocks.length && (
            <p className={style.newsSeeMore_msg} onClick={() => setVisibleBlocks((prev) => prev + 3)}>
              Показати більше
            </p>
          )}
          {visibleBlocks > 3 && (
            <p className={style.newsSeeMore_msg} onClick={() => setVisibleBlocks((prev) => (prev = 3))}>
              Приховати
            </p>
          )}
        </div>
      </div>

      {/* Recommended  */}
      <div className={style.news_block}>
        <h2>Рекомендовані</h2>
        <div className={style.newsItem}>
          <div className={style.newsContent}>
            <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
              <div className={style.recommended_users}>
                <img
                  src="https://yt3.ggpht.com/0Ssoys0iSd5yNdmPoIFeOqQKT4GzvYAGzaTKo30QIbMro9JZ8IxwMBl_rsaxOoo6CsWlv9GJZA=s68-c-k-c0x00ffffff-no-rj"
                  alt="user-image"
                />
              </div>
              <div className={style.newsTitles}>
                <p className={style.newsName}>
                  Introleranter <img src="https://cdn-icons-png.flaticon.com/128/594/594847.png" alt="icon" />
                </p>
                <p className={style.newsInfoText}>@Koelnnemez</p>
              </div>
            </div>
            <div className={style.newsOptions}>
              <Button size="small">Читати</Button>
            </div>
          </div>
        </div>

        <div className={style.newsItem}>
          <div className={style.newsContent}>
            <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
              <div className={style.recommended_users}>
                <img
                  src="https://yt3.ggpht.com/by9Fh1prHd_mmc52XM3nscTy2U7qssX0D3sE4w2e6OQAIlEz3wE3MRFImIk9L-xoWtSSYmgkQg=s68-c-k-c0x00ffffff-no-rj"
                  alt="user-image"
                />
              </div>
              <div className={style.newsTitles}>
                <p className={style.newsName}>
                  Flawour trip <img src="https://cdn-icons-png.flaticon.com/128/7641/7641727.png" alt="icon" />
                </p>
                <p className={style.newsInfoText}>@Flawour_trip</p>
              </div>
            </div>
            <div className={style.newsOptions}>
              <Button size="small">Читати</Button>
            </div>
          </div>
        </div>

        <div className={style.newsItem}>
          <div className={style.newsContent}>
            <div className={style.recommended_info}>
              <div className={style.recommended_users}>
                <img
                  src="https://yt3.ggpht.com/o-LSuWM1x97q-lo5pM3a6tKzfjlHKT-VbQRV8Wq4bhVVzhRQvROpGUkZ0VmkmWxp6giB9EumnQ=s68-c-k-c0x00ffffff-no-rj"
                  alt="user-image"
                />
              </div>
              <div className={style.newsTitles}>
                <p className={style.newsName}>
                  The Kyiv Independent
                  <img src="https://cdn-icons-png.flaticon.com/128/7641/7641727.png" alt="icon" />
                </p>
                <p className={style.newsInfoText}>@KyivIndependent</p>
              </div>
            </div>
            <div className={style.newsOptions}>
              <Button size="small">Читати</Button>
            </div>
          </div>
        </div>

        <div className={style.newsItem}>
          <p className={style.newsSeeMore_msg}>Показати більше</p>
        </div>
      </div>

      {/* bottom info */}
      <div className={style.news_block}>
        <div className={style.newsItem}>
          © {new Date().getFullYear()} Ros<b>Dev</b>. Всі права захищено.
        </div>
      </div>
    </aside>
  );
};
