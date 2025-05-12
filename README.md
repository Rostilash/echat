💬 eChat – Social Network Prototype
eChat is a prototype of a social media platform built with modern web technologies. It features messaging, emoji support, geolocation-based content, and news integration. The app is designed with scalability in mind and includes experiments with external APIs and performance tools.

🔗 Repository: https://github.com/Rostilash/echat

🚀 Features & Technologies
😄 Emoji Picker
Integrated using emoji-picker-react to add emojis in chat messages.
npm install emoji-picker-react

🌍 Google Maps Search by Coordinates
Users can view locations by clicking a link that opens Google Maps with specific latitude and longitude:
https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}

🏙 Nearby Places API (Overpass API)
Displays a list of nearby places (restaurants, pubs, cafes) using:
https://overpass-api.de/api/interpreter

📰 RSS News Feed Integration
Pulls live news from NV.ua using rss2json as a proxy:
const feedUrl = "https://nv.ua/rss/all.xml";
const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;

📅 Date Handling with dayjs
For easier manipulation and formatting of dates.
npm install dayjs

Future improvement 
🛡️ API Security (Cloudflare Worker)
For protecting API keys, the app uses Cloudflare Workers and Wrangler CLI:
🔐 Hide private API keys by proxying requests through a secure worker.
🌐 Cloudflare Dashboard – manage and deploy workers.
🧰 Wrangler – deploy and manage your worker environment.
npm install -g wrangler
