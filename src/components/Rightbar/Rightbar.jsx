import { useState } from "react";
import style from "./Rightbar.module.css";
import { Button } from "./../Button/Button";
import { SearchLabels } from "./SearchLabels";
import { FilteredNews } from "./FilteredNews";
import { generateNewsBlocks } from "./../../utils/generateNewsBlocks";
import { RecomendedUsers } from "./RecomendedUsers";
import { useAuth } from "../../hooks/useAuth";

export const Rightbar = ({ onSelectFilter, posts = [], users }) => {
  const { currentUser } = useAuth();
  const [visibleBlocks, setVisibleBlocks] = useState(3);
  const [visibleUsers, setVisibleUsers] = useState(3);

  const newsBlocks = generateNewsBlocks(posts, visibleBlocks);

  const recommended = currentUser ? users.filter((user) => user.nickname !== currentUser.nickname) : [];

  //users shown now
  const visibleRecommended = recommended.slice(0, visibleUsers);

  // show more +3
  const handleShowMore = () => {
    setVisibleUsers((prev) => prev + 3);
  };

  return (
    <aside className={style.rightbar}>
      <SearchLabels newsBlocks={newsBlocks} onSelectFilter={onSelectFilter} />

      <FilteredNews
        posts={posts}
        newsBlocks={newsBlocks}
        visibleBlocks={visibleBlocks}
        onSelectFilter={onSelectFilter}
        setVisibleBlocks={setVisibleBlocks}
      />

      {/* Recommended Users */}
      <div className={style.news_block}>
        <h2>Рекомендовані</h2>

        {visibleRecommended.map((user) => (
          <RecomendedUsers key={user.nickname} user={user} />
        ))}

        {visibleUsers < recommended.length && (
          <div className={style.newsItem} onClick={handleShowMore} style={{ cursor: "pointer" }}>
            <p className={style.newsSeeMore_msg}>Показати більше</p>
          </div>
        )}
      </div>

      <div className={style.news_block}>
        <div className={style.newsItem}>
          © {new Date().getFullYear()} Ros<b>Dev</b>. Всі права захищено.
        </div>
      </div>
    </aside>
  );
};
