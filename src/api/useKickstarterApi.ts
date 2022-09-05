import { PER_PAGE } from 'constants/kickstarter'
import { useQuery } from 'react-query'
import { OrderDirection, OrderKickstarterBy } from 'types/kickstarter'
import { kickstarterClient } from 'utils/graphql'
import {
  convertToBackedKickstarter,
  convertToKickstarter,
  convertToKickstarterAccount,
  convertToKickstarterFactory,
} from 'utils/kickstarter'
import {
  BACKED_KICKSTARTERS_BY_CONTRIBUTOR_ID,
  BACKED_KICKSTARTERS_BY_KICKSTARTER_ADDRESS,
  BACKED_KICKSTARTER_BY_ID,
  KICKSTARTERS,
  KICKSTARTERS_BY_ACCOUNT_ID,
  KICKSTARTERS_BY_END_TIME_BETWEEN,
  KICKSTARTERS_SEARCH,
  KICKSTARTER_ACCOUNT_BY_ID,
  KICKSTARTER_BY_ID,
  KICKSTARTER_FACTORY_BY_ID,
} from './queries/kickstarterQueries'

export function useKickstarterFactoryById(kickstarterFactoryId: string) {
  return useQuery('useKickstarterFactoryById', async () => {
    const data = await kickstarterClient.request(KICKSTARTER_FACTORY_BY_ID, {
      address: kickstarterFactoryId.toLowerCase(),
    })
    const kickstarter = convertToKickstarterFactory(data.summitKickstarterFactory)
    return kickstarter
  })
}

export function useKickstarterById(kickstarterId: string) {
  return useQuery('useKickstarterById', async () => {
    const data = await kickstarterClient.request(KICKSTARTER_BY_ID, {
      address: kickstarterId.toLowerCase(),
    })
    const kickstarter = convertToKickstarter(data.kickstarter)
    return kickstarter
  })
}

export function useKickstarterAccountById(kickstarterAccountId: string) {
  return useQuery('useKickstarterAccountById', async () => {
    const data = await kickstarterClient.request(KICKSTARTER_ACCOUNT_BY_ID, {
      address: kickstarterAccountId.toLowerCase(),
    })
    const kickstarterAccount = convertToKickstarterAccount(data.account)
    return kickstarterAccount
  })
}

export function useKickstarterByAccountId(kickstarterAccountId: string, page = 1, perPage = PER_PAGE) {
  return useQuery('useKickstarterByAccountId', async () => {
    const data = await kickstarterClient.request(KICKSTARTERS_BY_ACCOUNT_ID, {
      address: kickstarterAccountId.toLowerCase(),
      first: perPage,
      skip: (page - 1) * perPage,
    })
    const kickstarters = data.kickstarters.map((kickstarter) => convertToKickstarter(kickstarter))
    return kickstarters
  })
}

export function useKickstarters(
  page = 1,
  perPage = PER_PAGE,
  orderBy = OrderKickstarterBy.TITLE,
  orderDirection = OrderDirection.ASC
) {
  return useQuery('useKickstarters', async () => {
    const data = await kickstarterClient.request(KICKSTARTERS, {
      first: perPage,
      skip: (page - 1) * perPage,
      orderBy,
      orderDirection,
    })
    const kickstarters = data.kickstarters.map((kickstarter) => convertToKickstarter(kickstarter))
    return kickstarters
  })
}

export function useKickstartersSearch(
  searchText: string,
  page = 1,
  perPage = PER_PAGE,
  orderBy = OrderKickstarterBy.TITLE,
  orderDirection = OrderDirection.ASC
) {
  return useQuery('useKickstartersSearch', async () => {
    const data = await kickstarterClient.request(KICKSTARTERS_SEARCH, {
      text: searchText,
      first: perPage,
      skip: (page - 1) * perPage,
      orderBy,
      orderDirection,
    })
    const kickstarters = data.kickstarterSearch.map((kickstarter) => convertToKickstarter(kickstarter))
    return kickstarters
  })
}

export function useKickstarterByEndTimeBetween(
  startTimestamp: number,
  endTimestamp: number,
  page = 1,
  perPage = PER_PAGE
) {
  return useQuery('useKickstarterByEndTimeBetween', async () => {
    const data = await kickstarterClient.request(KICKSTARTERS_BY_END_TIME_BETWEEN, {
      first: perPage,
      skip: (page - 1) * perPage,
      startTimestamp,
      endTimestamp,
    })
    const kickstarters = data.kickstarters.map((kickstarter) => convertToKickstarter(kickstarter))
    return kickstarters
  })
}

export function useBackedKickstartersByContributionId(contributorId: string, page = 1, perPage = PER_PAGE) {
  return useQuery('useBackedKickstartersByContributionId', async () => {
    const data = await kickstarterClient.request(BACKED_KICKSTARTERS_BY_CONTRIBUTOR_ID, {
      address: contributorId.toLowerCase(),
      first: perPage,
      skip: (page - 1) * perPage,
    })
    const backedKickstarters = data.backedKickstarters.map((backedKickstarter) =>
      convertToBackedKickstarter(backedKickstarter)
    )
    return backedKickstarters
  })
}

export function useBackedKickstarterById(backedKickstarterId: string) {
  return useQuery('useBackedKickstarterById', async () => {
    const data = await kickstarterClient.request(BACKED_KICKSTARTER_BY_ID, {
      id: backedKickstarterId.toLowerCase(),
    })
    const backedKickstarter = convertToBackedKickstarter(data.backedKickstarter)
    return backedKickstarter
  })
}

export function useBackedKickstartersByKickstarterAddress(kickstarterAddress: string, page = 1, perPage = PER_PAGE) {
  return useQuery('useBackedKickstartersByKickstarterAddress', async () => {
    const data = await kickstarterClient.request(BACKED_KICKSTARTERS_BY_KICKSTARTER_ADDRESS, {
      address: kickstarterAddress.toLowerCase(),
      first: perPage,
      skip: (page - 1) * perPage,
    })
    const backedKickstarters = data.backedKickstarters.map((backedKickstarter) =>
      convertToBackedKickstarter(backedKickstarter)
    )
    return backedKickstarters
  })
}
