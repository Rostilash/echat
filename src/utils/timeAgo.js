// export const timeAgo = (timestamp) => {
//   const now = new Date();
//   const postDate = new Date(timestamp);
//   const diffInSeconds = Math.floor((now - postDate) / 1000);

//   const minutes = Math.floor(diffInSeconds / 60);
//   const hours = Math.floor(diffInSeconds / 3600);
//   const days = Math.floor(diffInSeconds / 86400);

//   if (days > 1) return `${days} days ago`;
//   if (days === 1) return `1 day ago`;
//   if (hours > 1) return `${hours} hours ago`;
//   if (hours === 1) return `1 hour ago`;
//   if (minutes > 1) return `${minutes} minutes ago`;
//   if (minutes === 1) return `1 minute ago`;

//   return "Just now";
// };

// const monthNames = {
//   січня: 0,
//   лютого: 1,
//   березня: 2,
//   квітня: 3,
//   травня: 4,
//   червня: 5,
//   липня: 6,
//   серпня: 7,
//   вересня: 8,
//   жовтня: 9,
//   листопада: 10,
//   грудня: 11,
// };
