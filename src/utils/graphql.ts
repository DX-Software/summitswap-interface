import { INFO_CLIENT, WHITELABEL_NFT_CLIENT } from 'constants/graphs'
import { GraphQLClient } from 'graphql-request'

/* eslint-disable import/prefer-default-export */
export const infoClient = new GraphQLClient(INFO_CLIENT)

export const whitelabelNftClient = new GraphQLClient(WHITELABEL_NFT_CLIENT)
