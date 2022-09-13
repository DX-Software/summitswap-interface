import { Button, Heading, UploadIcon } from '@koda-finance/summitswap-uikit'
import { FormikProps } from 'formik'
import React, { useCallback, useMemo, useRef } from 'react'
import { WhitelabelNft } from 'types/whitelabelNft'
import { HelperText } from '../shared/Text'
import NftImageCarousel from './NftImageCarousel'

type Props = {
  name: string
  formik: FormikProps<WhitelabelNft>
}

function UploadNftImages({ name, formik }: Props) {
  const inputFileElement = useRef<HTMLInputElement>(null)

  const hasSelected = useMemo(() => {
    return formik.values[name].length > 0
  }, [formik, name])

  const handleImageOnChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files)
        formik.setFieldValue(name, files)
      }
    },
    [formik, name]
  )

  const handleImageOnAbort = useCallback(() => {
    formik.setFieldValue(name, [])
  }, [formik, name])

  const handleChooseImages = () => {
    inputFileElement.current?.click()
  }

  return (
    <>
      <Heading size="md" marginBottom="8px">
        Upload Your NFTs
      </Heading>
      <HelperText marginBottom="8px">Upload all of your NFTs images here</HelperText>

      {hasSelected && <NftImageCarousel name={name} formik={formik} />}

      <input
        ref={inputFileElement}
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleImageOnChange}
        onAbort={handleImageOnAbort}
        multiple
        hidden
      />
      <Button
        variant={hasSelected ? 'secondary' : 'awesome'}
        startIcon={<UploadIcon color={hasSelected ? 'primary' : 'default'} />}
        marginBottom="32px"
        onClick={handleChooseImages}
      >
        <b>Upload NFT Images</b>
      </Button>
    </>
  )
}

export default React.memo(UploadNftImages)
