/* eslint-disable react/no-array-index-key */
import { ArrowBackIcon, ArrowForwardIcon, Button, CloseIcon, lightColors, Text } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import Divider from '../shared/Divider'
import { HelperText } from '../shared/Text'

const StyledImageWrapper = styled.div`
  position: relative;
`

const StyledImage = styled.img`
  width: 60px;
  height: 60px;
  border: 1px solid white;
`

const RemoveImageButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 0;
  width: 20px;
  height: 20px;
  padding: 4px;
  z-index: 10;
`

type Props = {
  images: File[]
}

function NftImageCarousel({ images }: Props) {
  const PER_PAGE = 8
  const [page, setPage] = useState(1)

  const slicedImages = useMemo(() => {
    return images.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  }, [images, page])

  const lastPage = useMemo(() => {
    return Math.ceil(images.length / PER_PAGE)
  }, [images])

  const handleClickPreviousPage = useCallback(() => {
    if (page === 1) return
    setPage((prev) => prev - 1)
  }, [page])

  const handleClickNextPage = useCallback(() => {
    if (page === lastPage) return
    setPage((prev) => prev + 1)
  }, [page, lastPage])

  const handleClickRemoveImage = useCallback((index) => {
    console.log(index)
  }, [])

  return (
    <>
      <Grid container spacing="6px">
        {slicedImages.map((image, index) => (
          <Grid item xs={3} sm={1.5}>
            <StyledImageWrapper>
              <StyledImage key={`nft-image-${index}`} src={URL.createObjectURL(image)} alt={`NFT Image ${index}`} />
              <RemoveImageButton variant="danger" onClick={() => handleClickRemoveImage(index)}>
                <CloseIcon color="white" width={16} height={16} />
              </RemoveImageButton>
            </StyledImageWrapper>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing="12px" marginBottom="16px">
        <Grid item>
          <ArrowBackIcon
            cursor={page === 1 ? 'default' : 'pointer'}
            color={page === 1 ? 'default' : 'primary'}
            onClick={handleClickPreviousPage}
          />
        </Grid>
        <Grid item>
          <Text>
            Page {page} of {lastPage}
          </Text>
        </Grid>
        <Grid item>
          <ArrowForwardIcon
            cursor={page === lastPage ? 'default' : 'pointer'}
            color={page === lastPage ? 'default' : 'primary'}
            onClick={handleClickNextPage}
          />
        </Grid>
      </Grid>
      <Divider style={{ marginBottom: '8px' }} />
      <HelperText marginBottom="16px">
        Total images uploaded:{' '}
        <HelperText bold style={{ display: 'inline-block', color: lightColors.primary }}>
          {images.length}
        </HelperText>{' '}
        image(s)
      </HelperText>
    </>
  )
}

export default React.memo(NftImageCarousel)
