const fs = require("fs");
const axios = require("axios");

const baseURL = "https://api.themoviedb.org/3/";
const apiKey = "?api_key=c4595d871c9878d6905a4403ba109c57";

console.log("require OK");

const page = 1;

const options2 = {
  method: "GET",
  url: "https://api.themoviedb.org/3/genre/movie/list?language=en",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNDU5NWQ4NzFjOTg3OGQ2OTA1YTQ0MDNiYTEwOWM1NyIsInN1YiI6IjY0NDdlMTYwZWY5ZDcyMDRhM2E2YmZjOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uJcxkptcKhf0a0-2legOYpLrgdnn2KJ07AmVf9u21r4",
  },
};

const genName = async (num) => {
  const res = await axios.request(options2);
  const genres = res.data.genres;
  const result = genres.filter((a) => a.id === num);
  /*   console.log(result);
   */ return result[0].name;
};

const options = {
  method: "GET",
  url: `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}`,
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNDU5NWQ4NzFjOTg3OGQ2OTA1YTQ0MDNiYTEwOWM1NyIsInN1YiI6IjY0NDdlMTYwZWY5ZDcyMDRhM2E2YmZjOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uJcxkptcKhf0a0-2legOYpLrgdnn2KJ07AmVf9u21r4",
  },
};

axios
  .request(options)
  .then(function (response) {
    const res = response.data.results[0];
    console.log(response.data.results.length);
    console.log({
      originalId: res.id,
      title: res.title,
      description: res.overview,
      type: "movie",
      season: 1,
      season_episodes: 1,
      categories: "String" /* genName(res.genre_ids[0]) */,
      platform: "String",
      image: "https://image.tmdb.org/t/p/original/" + res.poster_path,
    });
  })
  .catch(function (error) {
    console.error(error);
  });

genName(28).then((a) => console.log(a));
