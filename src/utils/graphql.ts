import { GraphQLClient } from 'graphql-request'
import { REFERRAL_CLIENT } from 'constants/graphs'

// eslint-disable-next-line import/prefer-default-export
export const referralClient = new GraphQLClient(REFERRAL_CLIENT)
