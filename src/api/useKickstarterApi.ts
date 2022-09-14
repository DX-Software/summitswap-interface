import { PER_PAGE } from 'constants/kickstarter'
import { useMutation, useQuery } from 'react-query'
import {
  BackedKickstarter,
  Kickstarter,
  KickstarterContact,
  KickstarterContributor,
  OrderDirection,
  OrderKickstarterBy,
} from 'types/kickstarter'
import { kickstarterClient } from 'utils/graphql'
import {
  convertToBackedKickstarter,
  convertToKickstarter,
  convertToKickstarterAccount,
  convertToKickstarterFactory,
} from 'utils/kickstarter'
import httpClient from './http'
import {
  BACKED_KICKSTARTERS_BY_CONTRIBUTOR_ID,
  BACKED_KICKSTARTERS_BY_KICKSTARTER_ADDRESS,
  BACKED_KICKSTARTER_BY_ID,
  KICKSTARTERS,
  KICKSTARTERS_BY_ACCOUNT_ID,
  KICKSTARTERS_BY_APPROVAL_STATUSES,
  KICKSTARTERS_BY_END_TIME_BETWEEN,
  KICKSTARTERS_SEARCH,
  KICKSTARTER_ACCOUNT_BY_ID,
  KICKSTARTER_BY_ID,
  KICKSTARTER_FACTORY_BY_ID,
} from './queries/kickstarterQueries'

// GRAPHQL
export function useKickstarterFactoryById(kickstarterFactoryId: string) {
  return useQuery(['useKickstarterFactoryById', kickstarterFactoryId], async () => {
    // TODO: do lower case for this after updating sub-graph
    const data = await kickstarterClient.request(KICKSTARTER_FACTORY_BY_ID, {
      address: kickstarterFactoryId,
    })
    const kickstarter = convertToKickstarterFactory(data.summitKickstarterFactory)
    return kickstarter
  })
}

export function useKickstarterById(kickstarterId: string) {
  return useQuery(['useKickstarterById', kickstarterId], async () => {
    const data = await kickstarterClient.request(KICKSTARTER_BY_ID, {
      address: kickstarterId.toLowerCase(),
    })
    const kickstarter = convertToKickstarter(data.kickstarter)
    return kickstarter
  })
}

export function useKickstarterAccountById(kickstarterAccountId: string) {
  return useQuery(['useKickstarterAccountById', kickstarterAccountId], async () => {
    const data = await kickstarterClient.request(KICKSTARTER_ACCOUNT_BY_ID, {
      address: kickstarterAccountId.toLowerCase(),
    })
    const kickstarterAccount = convertToKickstarterAccount(data.account)
    return kickstarterAccount
  })
}

export function useKickstarterByAccountId(kickstarterAccountId: string, page = 1, perPage = PER_PAGE) {
  return useQuery(['useKickstarterByAccountId', page, kickstarterAccountId], async () => {
    const data = await kickstarterClient.request(KICKSTARTERS_BY_ACCOUNT_ID, {
      address: kickstarterAccountId.toLowerCase(),
      first: perPage,
      skip: (page - 1) * perPage,
    })
    const kickstarters: Kickstarter[] = data.kickstarters.map((kickstarter) => convertToKickstarter(kickstarter))
    return kickstarters
  })
}

export function useKickstarters(
  page = 1,
  perPage = PER_PAGE,
  orderBy = OrderKickstarterBy.TITLE,
  orderDirection = OrderDirection.ASC,
  searchText: string | undefined
) {
  return useQuery(['useKickstarters', page, orderDirection, searchText], async () => {
    const query = searchText ? KICKSTARTERS_SEARCH : KICKSTARTERS
    const key = searchText ? 'kickstarterSearch' : 'kickstarters'

    const filter = {
      text: searchText,
      first: perPage,
      skip: (page - 1) * perPage,
      orderBy,
      orderDirection,
    }
    if (!searchText) delete filter.text

    const data = await kickstarterClient.request(query, filter)
    const kickstarters: Kickstarter[] = data[key].map((kickstarter) => convertToKickstarter(kickstarter))
    return kickstarters
  })
}

export function useKickstartersByApprovalStatuses(
  approvalStatuses: string[],
  page = 1,
  perPage = PER_PAGE,
  orderBy = OrderKickstarterBy.TITLE,
  orderDirection = OrderDirection.ASC,
  searchText?: string | undefined
) {
  return useQuery(['useKickstartersByApprovalStatuses', page, searchText, orderBy, orderDirection], async () => {
    const query = searchText ? KICKSTARTERS_SEARCH : KICKSTARTERS_BY_APPROVAL_STATUSES
    const key = searchText ? 'kickstarterSearch' : 'kickstarters'

    const filter = {
      approvalStatuses,
      text: searchText,
      first: perPage,
      skip: (page - 1) * perPage,
      orderBy,
      orderDirection,
    }
    if (!searchText) delete filter.text

    const data = await kickstarterClient.request(query, filter)
    const kickstarters: Kickstarter[] = data[key].map((kickstarter) => convertToKickstarter(kickstarter))
    return kickstarters
  })
}

export function useKickstarterByEndTimeBetween(
  approvalStatuses: string[],
  startTimestamp: number,
  endTimestamp: number,
  page = 1,
  perPage = PER_PAGE
) {
  return useQuery(['useKickstarterByEndTimeBetween', startTimestamp, endTimestamp, page], async () => {
    const data = await kickstarterClient.request(KICKSTARTERS_BY_END_TIME_BETWEEN, {
      first: perPage,
      skip: (page - 1) * perPage,
      startTimestamp,
      endTimestamp,
      approvalStatuses,
    })
    const kickstarters: Kickstarter[] = data.kickstarters.map((kickstarter) => convertToKickstarter(kickstarter))
    return kickstarters
  })
}

export function useBackedKickstartersByContributionId(contributorId: string, page = 1, perPage = PER_PAGE) {
  return useQuery(['useBackedKickstartersByContributionId', contributorId, page], async () => {
    const data = await kickstarterClient.request(BACKED_KICKSTARTERS_BY_CONTRIBUTOR_ID, {
      address: contributorId.toLowerCase(),
      first: perPage,
      skip: (page - 1) * perPage,
    })
    const backedKickstarters: Kickstarter[] = data.backedKickstarters.map((backedKickstarter) =>
      convertToKickstarter(backedKickstarter.kickstarter)
    )
    return backedKickstarters
  })
}

export function useBackedKickstarterById(backedKickstarterId: string) {
  return useQuery(['useBackedKickstarterById', backedKickstarterId], async () => {
    const data = await kickstarterClient.request(BACKED_KICKSTARTER_BY_ID, {
      id: backedKickstarterId.toLowerCase(),
    })
    const backedKickstarter = convertToBackedKickstarter(data.backedKickstarter)
    return backedKickstarter
  })
}

export function useBackedKickstartersByKickstarterAddress(kickstarterAddress: string, page = 1, perPage = PER_PAGE) {
  return useQuery(['useBackedKickstartersByKickstarterAddress', kickstarterAddress, page], async () => {
    const data = await kickstarterClient.request(BACKED_KICKSTARTERS_BY_KICKSTARTER_ADDRESS, {
      address: kickstarterAddress.toLowerCase(),
      first: perPage,
      skip: (page - 1) * perPage,
    })
    const backedKickstarters: BackedKickstarter[] = data.backedKickstarters.map((backedKickstarter) =>
      convertToBackedKickstarter(backedKickstarter)
    )
    return backedKickstarters
  })
}

// API BACKEND
const contactUrl = 'kickstarter/contact'
const contributorUrl = 'kickstarter/contributor'

export function useKickstarterContactMethod(kickstarterAddress: string) {
  return useQuery('useKickstarterContactMethod', async () => {
    const res = await httpClient.get(`${contactUrl}/${kickstarterAddress}`)
    return res.data as KickstarterContact
  })
}

export function useKickstarterContactMethodStore() {
  return useMutation(
    ({
      kickstarterAddress,
      contactMethod,
      contactValue,
    }: {
      kickstarterAddress: string
      contactMethod: string
      contactValue: string
    }) => {
      return httpClient.post(contactUrl, { kickstarterAddress, contactMethod, contactValue })
    }
  )
}

export function useKickstarterContactMethodUpdate() {
  return useMutation(
    ({
      kickstarterAddress,
      contactMethod,
      contactValue,
    }: {
      kickstarterAddress: string
      contactMethod: string
      contactValue: string
    }) => {
      return httpClient.post(`${contactUrl}/${kickstarterAddress}`, { contactMethod, contactValue })
    }
  )
}

export function useKickstarterContributors(kickstarterAddress: string) {
  return useQuery('useKickstarterContributors', async () => {
    const res = await httpClient.get(`${contributorUrl}/${kickstarterAddress}`)
    return res.data as KickstarterContributor[]
  })
}

export function useKickstarterContributorStore() {
  return useMutation(
    ({
      kickstarterAddress,
      walletAddress,
      currencyAddress,
      currencySymbol,
      email,
      contributionAmount,
    }: {
      kickstarterAddress: string
      walletAddress: string
      currencyAddress: string
      currencySymbol: string
      email: string
      contributionAmount: string
    }) => {
      return httpClient.post(contributorUrl, {
        kickstarterAddress,
        walletAddress,
        currencyAddress,
        currencySymbol,
        email,
        contributionAmount,
      })
    }
  )
}
