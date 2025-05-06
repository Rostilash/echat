export const fetchPlaces = async () => {
  const query = `
    [out:json];
    (
      node[amenity="restaurant"](48.6000,22.2900,48.6500,22.3500);
      node[amenity="cafe"](48.6000,22.2900,48.6500,22.3500);
      node[amenity="bar"](48.6000,22.2900,48.6500,22.3500);
      node[amenity="pub"](48.6000,22.2900,48.6500,22.3500);
      node[historic](48.6000,22.2900,48.6500,22.3500);
    );
    out;
  `;

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });

  const data = await response.json();

  const elements = data.elements;

  // Фільтрація
  const cafes = elements.filter((el) => el.tags?.amenity === "cafe");
  const restaurants = elements.filter((el) => el.tags?.amenity === "restaurant");
  const bars = elements.filter((el) => el.tags?.amenity === "bar");
  const pubs = elements.filter((el) => el.tags?.amenity === "pub");
  const historic = elements.filter((el) => el.tags?.historic);

  return { cafes, restaurants, bars, pubs, historic };
};
