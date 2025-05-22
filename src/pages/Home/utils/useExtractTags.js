// Function that matches all tags with # to post.tags
export const useExtractTags = (text) => {
  if (!text) return [];
  const matches = text.match(/#[\p{L}\p{N}_-]+/gu);
  return matches ? matches.map((tag) => tag.toLowerCase()) : [];
};
