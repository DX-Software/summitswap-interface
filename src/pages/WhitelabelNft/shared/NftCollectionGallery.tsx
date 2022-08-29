import React from 'react'
import { UseQueryResult } from 'react-query'
import { WhitelabelNftGraphql } from '../types'
import NftCollectionGalleryItem from './NftCollectionGalleryItem'

type Props = {
  queryResult: UseQueryResult<WhitelabelNftGraphql[], unknown>
}

function NftCollectionGallery({ queryResult }: Props) {
  if (queryResult.isLoading) {
    return null
  }

  const { data } = queryResult

  return (
    <>
      {data?.map((item) => (
        <NftCollectionGalleryItem data={item} />
      ))}
    </>
  )
}

export default React.memo(NftCollectionGallery)
