import React, { useEffect, useState } from "react";
import style from "./News.module.css";
import { LoaderSmall } from "../../components/Loader/LoaderSmall";

export const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const feedUrl = "https://tsn.ua/rss/full.rss";
  const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(proxyUrl);
        const data = await response.json();
        setArticles(data.items || []);
      } catch (error) {
        console.error("Помилка при завантаженні новин:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className={style.news_main}>
      <div className={style.news_content}>
        <h2>Останні новини України(НВ)</h2>
        {loading ? (
          <div className={style.loader}>
            <LoaderSmall />
          </div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {articles.map((article) => (
              <li key={article.guid} style={{ marginBottom: "25px", borderBottom: "1px solid #ccc", paddingBottom: "15px" }}>
                {article.enclosure?.link && (
                  <img
                    src={article.enclosure.link}
                    alt={article.title}
                    style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px" }}
                  />
                )}
                <a href={article.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#0077cc" }}>
                  <h3>{article.title}</h3>
                </a>
                <p style={{ fontSize: "14px", color: "#555" }}>{new Date(article.pubDate).toLocaleString("uk-UA")}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
