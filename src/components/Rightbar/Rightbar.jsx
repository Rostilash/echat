import React, { useState } from "react";
import style from "./Rightbar.module.css";
import { Button } from "./../Button/Button";
import { SearchLabels } from "./SearchLabels";
import { FilteredNews } from "./FilteredNews";
import { generateNewsBlocks } from "./../../utils/generateNewsBlocks";

export const Rightbar = ({ onSelectFilter, posts = [] }) => {
  const [visibleBlocks, setVisibleBlocks] = useState(3);
  const newsBlocks = generateNewsBlocks(posts, visibleBlocks);

  return (
    <aside className={style.rightbar}>
      {/* Input Search tags */}
      <SearchLabels newsBlocks={newsBlocks} onSelectFilter={onSelectFilter} />

      {/* Filtered news block / Block */}
      <FilteredNews
        posts={posts}
        newsBlocks={newsBlocks}
        visibleBlocks={visibleBlocks}
        onSelectFilter={onSelectFilter}
        setVisibleBlocks={setVisibleBlocks}
      />

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
