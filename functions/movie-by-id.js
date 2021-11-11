const { queryHasura } = require("./utils/hasura");

exports.handler = async ({ queryStringParameters }) => {
  const { id } = queryStringParameters;

  const { movies_by_pk } = await queryHasura({
    query: `
      query ($id: String = "") {
        movies_by_pk(id: $id) {
          id
          title
          tagline
          poster
        }
      }
    `,
    variables: {
      id
    }
  });

  if (!movies_by_pk) {
    return {
      statusCode: 404,
      body: "Sorry, no movie found."
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(movies_by_pk)
  }
}