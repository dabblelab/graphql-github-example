const express = require('express');
const app = express()
const { ApolloClient, InMemoryCache, HttpLink, gql } = require('@apollo/client');
const fetch = require('node-fetch');

//Fill in the GraphQL endpoint and your Github Secret Access Token inside secrets.

const cache = new InMemoryCache();
const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env['GRAPHQL_ENDPOINT'], fetch, headers: {
      'Authorization': `Bearer ${process.env['GITHUB_API_TOKEN']}`,
    },
  }),
  cache
});

app.get('/', function(req, res) {
  client
    .query({
      query: gql`{
  search(query: "topic:alexa-skill-template sort:updated-desc", type: REPOSITORY, first: 5) {
    repositoryCount
    nodes {
      ... on Repository {
        nameWithOwner
        description
        updatedAt
        createdAt
        diskUsage
      }
    }
  }
}
`})
    .then(res => {
      const data = JSON.stringify(res, null, 2);
      console.log(data)
    })
    .catch(error => console.error(error))
  res.send('Check your Console for the JSON you requested!')
});

app.listen(8000, () => console.log(`Example app listening on port 8000!`))