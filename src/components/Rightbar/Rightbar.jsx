import style from "./Rightbar.module.css";
import { useState, useEffect } from "react";
import { SearchLabels } from "./SearchLabels";
import { FilteredNews } from "./FilteredNews";
import { generateNewsBlocks } from "./../../utils/generateNewsBlocks";
import { RecomendedUsers } from "./RecomendedUsers";
import { useAuth } from "../../hooks/useAuth";

export const Rightbar = ({ onSelectFilter, posts = [], users }) => {
  const { currentUser, findUserByUid } = useAuth();

  const [visibleBlocks, setVisibleBlocks] = useState(3);
  const [visibleUsers, setVisibleUsers] = useState(3);

  const newsBlocks = generateNewsBlocks(posts, visibleBlocks);

  const [recommendedUsers, setRecommendedUsers] = useState([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      // 1. Filter only unique authorIds that are not currentUser.id
      const uniqueAuthorIds = [...new Set(posts.filter((post) => post.authorId && post.authorId !== currentUser.uid).map((post) => post.authorId))];

      // 2. We make queries for each id
      const users = await Promise.all(uniqueAuthorIds.map((uid) => findUserByUid(uid)));

      // 3. Save in the state
      setRecommendedUsers(users);
    };

    if (posts.length > 0 && currentUser?.uid) {
      fetchAuthors();
    }
  }, [posts, currentUser]);

  // show more +3
  const handleShowMore = () => {
    setVisibleUsers((prev) => prev + 3);
  };

  const recomendedUsers = posts.filter((post) => post.authorId !== currentUser.uid);
  const visibleRecomendedUsers = recommendedUsers.slice(0, visibleUsers);
  const filteredUsers = visibleRecomendedUsers.filter((user) => user != null && user.uid);
  const filteredFollowerUsers = filteredUsers.filter((user) => !user.followers.includes(currentUser.uid));

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

        {filteredFollowerUsers.map((user) => (
          <RecomendedUsers key={user.id} user={user} />
        ))}

        {visibleUsers < recomendedUsers.length && (
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
