const { URL } = require("url");
const fetch = require("node-fetch");
const { queryHasura } = require("./utils/hasura");

exports.handler = async () => {
  const { movies } = await queryHasura({
    query: `
      query {
        movies {
          id
          title
          tagline
          poster
        }
      }
    `
  });

  const api = new URL("https://www.omdbapi.com/");
  api.searchParams.set("apikey", process.env.OMDB_API_KEY);

  const promises = movies.map(movie => {
    api.searchParams.set("i", movie.id);

    return fetch(api)
      .then(response => response.json())
      .then(data => {
        const scores = data.Ratings;
        return {
          ...movie,
          scores
        }
      });
  });

  const moviesWithRatings = await Promise.all(promises);
  return {
    statusCode: 200,
    body: JSON.stringify(moviesWithRatings)
  }
}