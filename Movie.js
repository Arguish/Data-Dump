const axios = require("axios");

console.log("require OK");

const genresConfig = {
  method: "GET",
  url: "https://api.themoviedb.org/3/genre/movie/list?language=en",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNDU5NWQ4NzFjOTg3OGQ2OTA1YTQ0MDNiYTEwOWM1NyIsInN1YiI6IjY0NDdlMTYwZWY5ZDcyMDRhM2E2YmZjOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uJcxkptcKhf0a0-2legOYpLrgdnn2KJ07AmVf9u21r4",
  },
};

const moviesConfig = (page) => {
  return {
    method: "GET",
    url: `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}`,
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNDU5NWQ4NzFjOTg3OGQ2OTA1YTQ0MDNiYTEwOWM1NyIsInN1YiI6IjY0NDdlMTYwZWY5ZDcyMDRhM2E2YmZjOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uJcxkptcKhf0a0-2legOYpLrgdnn2KJ07AmVf9u21r4",
    },
  };
};

const MFConfig = axios.create({
  //baseURL: 'http://localhost:3000/api',

  baseURL: "https://mf-api.onrender.com/api",
  headers: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluYXRvckBhZG1pbmF0b3IiLCJpYXQiOjE2ODM0MDIzNzV9.7JoK0cvKcUm5Za65WEj9drKyJUOXCnba5TqeJEapF3g",
  },
});

const getPlatform = async () => {
  const { data } = await MFConfig.get("/platform");
  return data;
};

const postMedia = async (body) => {
  const { data } = await MFConfig.post("/media", body);
  return data;
};

const genName = async (num) => {
  const res = await axios.request(genresConfig);
  const genres = res.data.genres;
  const result = genres.filter((a) => a.id === num);
  /*   console.log(result);
   */ return result[0].name;
};

const getMovie = async (num, moviepage) => {
  const response = await axios.request(moviesConfig(moviepage));
  const res = response.data.results[num];
  console.log(response.data.results.length);
  return {
    originalId: res.id,
    title: res.title,
    description:
      res.overview.replace(/[^\s\d\w&,.]/gi, "").slice(0, 200) + "...",
    type: "movie",
    season: 1,
    season_episodes: 1,
    category: res.genre_ids[0],
    platform: "String",
    image: "https://image.tmdb.org/t/p/original" + res.poster_path,
  };
};

const THEREALDATADUMP = async (index, dumpPage) => {
  try {
    const getMovieRes = await getMovie(index, dumpPage);
    const genNameRes = await genName(getMovieRes.category);
    getMovieRes.category = await genNameRes;
    const getPlatformRes = await getPlatform();
    const rndPlat = await getPlatformRes[
      Math.floor(Math.random() * getPlatformRes.length)
    ];
    getMovieRes.platform = await rndPlat.name;
    console.log(getMovieRes);
    await postMedia(getMovieRes);
    console.log("ok");
  } catch (error) {
    console.log(error);
  }
};

const loop = async (indexPage) => {
  const response = await axios.request(moviesConfig(indexPage));
  const array = response.data.results;
  for (let index = 0; index < array.length; index++) {
    THEREALDATADUMP(index, indexPage);
  }
};

loop(1);
loop(2);
loop(3);
loop(4);
