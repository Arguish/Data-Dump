const fs = require("fs");
const axios = require("axios");

const baseURL = "https://api.themoviedb.org/3/";
const apiKey = "?api_key=c4595d871c9878d6905a4403ba109c57";

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

const showConfig = (page) => {
  return {
    method: "GET",
    url: `https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=${page}`,
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

const options = (id) => {
  return {
    method: "GET",
    url: `https://api.themoviedb.org/3/tv/${id}?language=en-US`,
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNDU5NWQ4NzFjOTg3OGQ2OTA1YTQ0MDNiYTEwOWM1NyIsInN1YiI6IjY0NDdlMTYwZWY5ZDcyMDRhM2E2YmZjOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uJcxkptcKhf0a0-2legOYpLrgdnn2KJ07AmVf9u21r4",
    },
  };
};

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
   */ return result[0] ? result[0].name : "Other";
};

const getMovie = async (num, showPage) => {
  const response = await axios.request(showConfig(showPage));
  const res = response.data.results[num];
  const episodesRes = await axios.request(options(res.id));
  //console.log(episodesRes.data);
  return {
    originalId: res.id,
    title: res.name,
    description:
      res.overview.replace(/[^\s\d\w&,.]/gi, "").slice(0, 200) + "...",
    type: "show",
    season: episodesRes.data.number_of_seasons,
    season_episodes: episodesRes.data.number_of_episodes,
    categories: res.genre_ids[0],
    platform: "String",
    image: "https://image.tmdb.org/t/p/original" + res.poster_path,
  };
};

const THEREALDATADUMP = async (index, dumpPage) => {
  try {
    const getMovieRes = await getMovie(index, dumpPage);
    console.log(getMovieRes);
    const genNameRes = await genName(getMovieRes.categories);
    getMovieRes.categories = await genNameRes;
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
  const response = await axios.request(showConfig(indexPage));
  const array = response.data.results;
  for (let index = 0; index < array.length; index++) {
    THEREALDATADUMP(index, indexPage);
  }
};

loop(3);
