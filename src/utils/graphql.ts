import { INFO_CLIENT, KICKSTARTER_CLIENT, WHITELABEL_NFT_CLIENT } from 'constants/graphs'
import { GraphQLClient } from 'graphql-request'

export const infoClient = new GraphQLClient(INFO_CLIENT)

export const kickstarterClient = new GraphQLClient(KICKSTARTER_CLIENT)
export const whitelabelNftClient = new GraphQLClient(WHITELABEL_NFT_CLIENT)
