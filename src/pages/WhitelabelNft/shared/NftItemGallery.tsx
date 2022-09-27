import { Flex, useModal } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import Pagination from 'components/Pagination/Pagination'
import { PER_PAGE } from 'constants/whitelabel'
import { useWhitelabelNftContract } from 'hooks/useContract'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
}

// const WHITELABEL_ABI = new Interface(WhitelabelAbi)

function NftItemGallery({ queryResult, totalItem, page, onPageChange }: Props) {
  const [baseUrl, setBaseUrl] = useState('')
  const { whitelabelNftId, setTokenId } = useWhitelabelNftContext()
  const whitelabelNftContract = useWhitelabelNftContract(whitelabelNftId)

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

  const getBaseUrl = useCallback(async () => {
    const baseTokenUrl = (await whitelabelNftContract?.baseTokenURI()) as string
    setBaseUrl(baseTokenUrl)
  }, [whitelabelNftContract])

  useEffect(() => {
    getBaseUrl()
  }, [getBaseUrl])

  return (
    <>
      <Grid container spacing="40px">
        <Grid item xs={12}>
          <Grid container spacing="24px">
            {queryResult.isLoading ? (
              <NftItemGalleryLoadingSection />
            ) : queryResult.isFetched && queryResult.data?.length === 0 ? (
              <Grid item xs={12}>
                <HelperText>No NFT Collections adopted yet. Let’s adopt one now!</HelperText>
              </Grid>
            ) : (
              queryResult.data?.map((item) => (
                <Grid item xs={6} sm={6} md={4} lg={3} key={`nft-item-${item.id}`}>
                  <NftItemGalleryItem data={item} baseUrl={baseUrl} onClick={() => handleItemOnClick(item)} />
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
    </>
  )
}

export default React.memo(NftItemGallery)
