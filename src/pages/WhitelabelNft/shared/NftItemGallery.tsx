import { useModal } from '@koda-finance/summitswap-uikit'
import { Grid, useMediaQuery } from '@mui/material'
import React, { useCallback, useMemo, useState } from 'react'
import { UseInfiniteQueryResult } from 'react-query'
import { WhitelabelNftItemGql } from 'types/whitelabelNft'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
import NftItemGalleryItem from './NftItemGalleryItem'
import NftItemGalleryItemConcealModal from './NftItemGalleryItemConcealModal'
import NftItemGalleryLoadingSection from './NftItemGalleryLoadingSection'
import PageNavigation from './PageNavigation'
import { HelperText } from './Text'

type Props = {
  queryResult: UseInfiniteQueryResult<WhitelabelNftItemGql[], unknown>
  displayCount?: number | undefined
  isRandom?: boolean
  disableOwnedTag?: boolean
  displayOwner?: boolean
  displayCollectionName?: boolean
}

function NftItemGallery({
  queryResult,
  displayCount,
  isRandom,
  disableOwnedTag = false,
  displayOwner = false,
  displayCollectionName = false,
}: Props) {
  const [page, setPage] = useState(0)
  const isMobileView = useMediaQuery('(max-width: 576px)')
  const { whitelabelNftId, setWhitelabelNtId, tokenId, setTokenId } = useWhitelabelNftContext()
  const [onPresentConcealModal] = useModal(<NftItemGalleryItemConcealModal />)

  const maxPage = useMemo(() => {
    return queryResult.data?.pageParams.length || 1
  }, [queryResult.data?.pageParams.length])

  const handleItemOnClick = useCallback(
    (item: WhitelabelNftItemGql) => {
      if (!item.collection?.isReveal) {
        onPresentConcealModal()
      } else {
        if (!whitelabelNftId) setWhitelabelNtId(item.collection.id)
        setTokenId(item.tokenId!)
      }
    },
    [whitelabelNftId, setWhitelabelNtId, setTokenId, onPresentConcealModal]
  )

  const data = useMemo(() => {
    let items = [...(queryResult.data?.pages[page] || [])]
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
  }, [queryResult.data, isRandom, displayCount, tokenId, page])

  const handlePrevPage = () => {
    setPage((prev) => prev - 1)
  }

  const handleNextPage = async () => {
    if (typeof queryResult.data?.pages[page + 1] === 'undefined') {
      await queryResult.fetchNextPage()
    }
    setPage((prev) => prev + 1)
  }

  return (
    <Grid container gap="40px">
      <Grid item xs={12}>
        <Grid container spacing={isMobileView ? '16px' : '24px'}>
          {queryResult.isLoading || queryResult.isFetchingNextPage ? (
            <NftItemGalleryLoadingSection />
          ) : queryResult.isFetched && queryResult.data?.pages[page].length === 0 ? (
            <Grid item xs={12}>
              <HelperText>
                {page === 0 ? 'No NFT Collections adopted yet. Let’s adopt one now!' : 'No more data to see.'}
              </HelperText>
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
      {(maxPage > 1 || queryResult.hasNextPage) && (
        <PageNavigation
          maxPage={maxPage}
          page={page}
          hasNextPage={queryResult.hasNextPage}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
        />
      )}
    </Grid>
  )
}

export default React.memo(NftItemGallery)

NftItemGallery.defaultProps = {
  displayCount: undefined,
  isRandom: false,
}
