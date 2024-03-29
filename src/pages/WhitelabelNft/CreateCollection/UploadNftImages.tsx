import { Box, Button, Heading, lightColors, UploadIcon } from '@koda-finance/summitswap-uikit'
import { SUPPORTED_IMAGE_FORMAT } from 'constants/whitelabel'
import { ErrorMessage, FormikProps } from 'formik'
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
    <Box marginBottom="32px">
      <Heading size="md" marginBottom="8px">
        Upload Your NFTs
      </Heading>
      <HelperText marginBottom="8px">Upload all of your NFTs images here</HelperText>

      {hasSelected && (
        <>
          <NftImageCarousel name={name} canEdit formik={formik} />
          <HelperText marginBottom="16px">
            Total images uploaded:{' '}
            <HelperText bold style={{ display: 'inline-block', color: lightColors.primary }}>
              {formik.values[name].length}
            </HelperText>{' '}
            image(s)
          </HelperText>
        </>
      )}

      <input
        ref={inputFileElement}
        type="file"
        accept={SUPPORTED_IMAGE_FORMAT.join(',')}
        onChange={handleImageOnChange}
        onAbort={handleImageOnAbort}
        multiple
        hidden
      />
      <Button
        variant={hasSelected ? 'secondary' : 'awesome'}
        startIcon={<UploadIcon color={hasSelected ? 'primary' : 'default'} />}
        onClick={handleChooseImages}
      >
        <b>Upload NFT Images</b>
      </Button>
      <ErrorMessage name={name}>
        {(msg) => (
          <HelperText fontSize="12px" marginTop="4px" color="failure">
            {msg.replace(name, "NFT Images")}
          </HelperText>
        )}
      </ErrorMessage>
    </Box>
  )
}

export default React.memo(UploadNftImages)
