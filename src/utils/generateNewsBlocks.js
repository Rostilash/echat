// utils/generateNewsBlocks.js

export function generateNewsBlocks(posts, visibleBlocks = 3) {
  const newsBlocks = [];

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = tomorrow.toISOString().split("T")[0];

  const todayPosts = posts.filter((p) => (p.timestamp || p.scheduledFor)?.split("T")[0] === today);
  const tomorrowPosts = posts.filter((p) => p.scheduledFor?.split("T")[0] === tomorrowFormatted);

  if (todayPosts.length > 0) {
    newsBlocks.push({
      label: "Сьогодні",
      description: "Заплановано / Сьогодні",
      count: todayPosts.length,
      icon: "📅",
      filter: "Сьогодні",
    });
  }

  if (tomorrowPosts.length > 0) {
    newsBlocks.push({
      label: "Завтра",
      description: "Заплановано / Завтра",
      count: tomorrowPosts.length,
      icon: "🗓️",
      filter: "Завтра",
    });
  }

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

  const sortedTags = Object.entries(tagStats)
    .sort(([, a], [, b]) => b.score - a.score)
    .slice(0, visibleBlocks);

  sortedTags.forEach(([tag, stats]) => {
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

  return newsBlocks;
}
