const fs = require("fs");
const axios = require("axios").default;

const baseURL = "https://api.themoviedb.org/3/";
const apiKey = "?api_key=c4595d871c9878d6905a4403ba109c57";

console.log("require OK");

const randomPlatform = () => {
  let arr = [
    "Netflix",
    "Amazon Prime Video",
    "Hulu",
    "Disney+",
    "HBO Max",
    "Peacock",
    "Apple TV+",
    "Paramount+",
    "Crave",
  ];
  const str = arr[Math.floor(Math.random() * (arr.length - 1))];
  return str;
};

const data = JSON.parse(
  fs.readFileSync("./json/tv_series_ids_04_24_2023.json", "utf-8")
);

async function dataDump(data) {
  await fs.appendFileSync("./tv_series.json", `{"tv_series":[\n`);
  const index = await data.map((a) => {
    return a.id;
  });
  console.log(index);
  const rng = () => {
    return Math.floor(Math.random() * (index.length - 1));
  };
  console.log(rng());

  for (let i = 0; i < 100; i++) {
    const element = await axios.get(baseURL + `tv/${index[rng()]}` + apiKey);

    const elementResult = {
      title: element.data.name,
      description: element.data.overview,
      season: element.data.number_of_season,
      season_episodes: element.data.number_of_episodes,
      category:
        typeof element.data.genres[0] !== "undefined"
          ? element.data.genres[0].name
          : "Other",
      platform: randomPlatform(),
    };
    await fs.appendFileSync("./tv_series.json", JSON.stringify(elementResult));
    await fs.appendFileSync("./tv_series.json", ", \n");
  }
  await fs.appendFileSync("./tv_series.json", "]}");
  clearInterval("timer");
}

dataDump(data.tv_series);
