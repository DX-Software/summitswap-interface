/* eslint-disable react/no-array-index-key */
import { ArrowBackIcon, ArrowForwardIcon, Button, CloseIcon, Flex, Text } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { FormikProps } from 'formik'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { WhitelabelNft } from 'types/whitelabelNft'
import Divider from '../shared/Divider'

const StyledImageWrapper = styled.div`
  position: relative;
`

const StyledImage = styled.img`
  width: 100%;
  height: auto;
`

const RemoveImageButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 0;
  width: 16px;
  height: 16px;
  padding: 4px;
  z-index: 10;
`

type Props = {
  name: string
  canEdit?: boolean
  formik: FormikProps<WhitelabelNft>
}

function NftImageCarousel({ name, canEdit, formik }: Props) {
  const PER_PAGE = 8
  const [page, setPage] = useState(1)

  const images = useMemo(() => {
    return formik.values[name] as File[]
  }, [formik.values, name])

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

  const handleClickRemoveImage = useCallback(
    (index) => {
      const clonedImages = [...formik.values[name]]
      clonedImages.splice(index, 1)
      formik.setFieldValue(name, clonedImages)
    },
    [formik, name]
  )

  return (
    <>
      <Grid container spacing="6px" marginBottom="16px">
        {slicedImages.map((image, index) => (
          <Grid item xs={3} lg={1.5} key={`nft-image-${index}`}>
            <StyledImageWrapper>
              <StyledImage src={URL.createObjectURL(image)} alt={`NFT Image ${index}`} />
              {!!canEdit && (
                <RemoveImageButton variant="danger" onClick={() => handleClickRemoveImage(index)}>
                  <CloseIcon color="white" width={16} height={16} />
                </RemoveImageButton>
              )}
            </StyledImageWrapper>
          </Grid>
        ))}
      </Grid>

      <Flex alignItems="center" marginX="auto" marginBottom="16px" style={{ columnGap: '10px' }}>
        <ArrowBackIcon
          cursor={page === 1 ? 'default' : 'pointer'}
          color={page === 1 ? 'default' : 'primary'}
          onClick={handleClickPreviousPage}
        />
        <Text>
          Page {page} of {lastPage}
        </Text>
        <ArrowForwardIcon
          cursor={page === lastPage ? 'default' : 'pointer'}
          color={page === lastPage ? 'default' : 'primary'}
          onClick={handleClickNextPage}
        />
      </Flex>
      <Divider style={{ marginBottom: '8px' }} />
    </>
  )
}

export default React.memo(NftImageCarousel)

NftImageCarousel.defaultProps = {
  canEdit: false,
}
