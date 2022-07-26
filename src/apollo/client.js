import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

const linkNodeGraph = process.env.REACT_APP_LINK_GRAPH_NODE

/* eslint-disable import/prefer-default-export */
export const client = new ApolloClient({
  link: new HttpLink({
    uri: linkNodeGraph,
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})
