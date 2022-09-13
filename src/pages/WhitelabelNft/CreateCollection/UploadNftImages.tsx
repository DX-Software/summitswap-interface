import { Button, Heading, UploadIcon } from '@koda-finance/summitswap-uikit'
import { FormikProps } from 'formik'
import React, { useCallback, useRef, useState } from 'react'
import { WhitelabelNft } from 'types/whitelabelNft'
import { HelperText } from '../shared/Text'
import NftImageCarousel from './NftImageCarousel'

type Props = {
  formik: FormikProps<WhitelabelNft>
}

function UploadNftImages({ formik }: Props) {
  const inputFileElement = useRef<HTMLInputElement>(null)

  const [nftImages, setNftImages] = useState<File[]>([])

  const handleImageOnChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setNftImages(files)
    }
  }, [])

  const handleChooseImages = () => {
    inputFileElement.current?.click()
  }

  return (
    <>
      <Heading size="md" marginBottom="8px">
        Upload Your NFTs
      </Heading>
      <HelperText marginBottom="8px">Upload all of your NFTs images here</HelperText>

      {nftImages.length > 0 && <NftImageCarousel images={nftImages} />}

      <input
        ref={inputFileElement}
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleImageOnChange}
        multiple
        hidden
      />
      <Button
        variant={nftImages.length > 0 ? 'secondary' : 'awesome'}
        startIcon={<UploadIcon color={nftImages.length > 0 ? 'primary' : 'default'} />}
        marginBottom="32px"
        onClick={handleChooseImages}
      >
        <b>Upload NFT Images</b>
      </Button>
    </>
  )
}

export default React.memo(UploadNftImages)
