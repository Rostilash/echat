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
        <h2>Останні новини України (НВ)</h2>
        {loading ? (
          <div className={style.loader}>
            <LoaderSmall />
          </div>
        ) : (
          <ul className={style.news_list}>
            {articles.map((article) => (
              <li key={article.guid} className={style.news_item}>
                {article.enclosure?.link && <img src={article.enclosure.link} alt={article.title} className={style.news_image} />}
                <div className={style.news_body}>
                  <a href={article.link} target="_blank" rel="noopener noreferrer" className={style.news_title}>
                    {article.title}
                  </a>
                  <p className={style.news_date}>{new Date(article.pubDate).toLocaleString("uk-UA")}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
