import { GraphQLClient } from 'graphql-request'
import { BIT_QUERY_ENDPOINT, INFO_CLIENT } from 'constants/endpoints'

// Extra headers
// Mostly for dev environment
// No production env check since production preview might also need them
export const getGQLHeaders = (endpoint: string) => {
  if (endpoint === INFO_CLIENT) {
    return { 'X-Sf': process.env.NEXT_PUBLIC_SF_HEADER ?? '' }
  }
  return undefined
}

export const infoClient = new GraphQLClient(INFO_CLIENT, { headers: getGQLHeaders(INFO_CLIENT) })

export const infoServerClient = new GraphQLClient(INFO_CLIENT, {
  headers: {
    'X-Sf': process.env.SF_HEADER ?? '',
  },
  timeout: 5000,
})

export const bitQueryServerClient = new GraphQLClient(BIT_QUERY_ENDPOINT ?? '', {
  headers: {
    // only server, no `NEXT_PUBLIC` not going to expose in client
    'X-API-KEY': process.env.BIT_QUERY_HEADER ?? '',
  },
  timeout: 5000,
})