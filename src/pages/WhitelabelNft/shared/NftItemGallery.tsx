import { Flex, useModal } from '@koda-finance/summitswap-uikit'
import { Grid, useMediaQuery } from '@mui/material'
import Pagination from 'components/Pagination/Pagination'
import { PER_PAGE } from 'constants/whitelabel'
import React, { useCallback, useMemo } from 'react'
import { UseQueryResult } from 'react-query'
import { WhitelabelNftItemGql } from 'types/whitelabelNft'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
import NftItemGalleryItem from './NftItemGalleryItem'
import NftItemGalleryItemConcealModal from './NftItemGalleryItemConcealModal'
import NftItemGalleryLoadingSection from './NftItemGalleryLoadingSection'
import { HelperText } from './Text'

type Props = {
  queryResult: UseQueryResult<WhitelabelNftItemGql[], unknown>
  totalItem: number
  page: number
  onPageChange: React.Dispatch<React.SetStateAction<number>>
  displayCount?: number | undefined
  isRandom?: boolean
  disableOwnedTag?: boolean
  displayOwner?: boolean
  displayCollectionName?: boolean
}

function NftItemGallery({
  queryResult,
  totalItem,
  page,
  onPageChange,
  displayCount,
  isRandom,
  disableOwnedTag = false,
  displayOwner = false,
  displayCollectionName = false,
}: Props) {
  const isMobileView = useMediaQuery('(max-width: 576px)')
  const { tokenId, setTokenId } = useWhitelabelNftContext()
  const [onPresentConcealModal] = useModal(<NftItemGalleryItemConcealModal />)

  const maxPage = useMemo(() => {
    return Math.ceil(totalItem / PER_PAGE)
  }, [totalItem])

  const handleItemOnClick = useCallback(
    (item: WhitelabelNftItemGql) => {
      if (!item.collection?.isReveal) {
        onPresentConcealModal()
      } else {
        setTokenId(item.tokenId!)
      }
    },
    [setTokenId, onPresentConcealModal]
  )

  const data = useMemo(() => {
    let items = [...(queryResult.data || [])]
    if (isRandom) {
      items.sort(() => 0.5 - Math.random())
    }
    if (tokenId) {
      items = items.filter((item) => item.tokenId !== tokenId)
    }
    if (displayCount) {
      items = items.slice(0, displayCount)
    }
    return items
  }, [queryResult.data, isRandom, displayCount, tokenId])

  return (
    <Grid container gap="40px">
      <Grid item xs={12}>
        <Grid container spacing={isMobileView ? '16px' : '24px'}>
          {queryResult.isLoading ? (
            <NftItemGalleryLoadingSection />
          ) : queryResult.isFetched && queryResult.data?.length === 0 ? (
            <Grid item xs={12}>
              <HelperText>No NFT Collections adopted yet. Let’s adopt one now!</HelperText>
            </Grid>
          ) : (
            data.map((item) => (
              <Grid item xs={6} sm={6} md={4} lg={3} key={`nft-item-${item.id}`}>
                <NftItemGalleryItem
                  data={item}
                  baseUrl={item.collection?.baseTokenURI || ''}
                  onClick={() => handleItemOnClick(item)}
                  disableOwnedTag={disableOwnedTag}
                  displayOwner={displayOwner}
                  displayCollectionName={displayCollectionName}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Grid>
      {maxPage > 1 && (
        <Grid item xs={12}>
          <Flex justifyContent="flex-end" style={{ columnGap: '8px' }}>
            <Pagination maxPage={maxPage} page={page} onPageChange={onPageChange} />
          </Flex>
        </Grid>
      )}
    </Grid>
  )
}

export default React.memo(NftItemGallery)

NftItemGallery.defaultProps = {
  displayCount: undefined,
  isRandom: false,
}
