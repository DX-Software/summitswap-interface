import { Box, Flex, ImageAddIcon, lightColors, Text } from '@koda-finance/summitswap-uikit'
import { FormikProps, FormikValues } from 'formik'
import React, { useRef } from 'react'
import styled from 'styled-components'

const ImageWrapper = styled(Flex)`
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;

  > img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
`

const ImagePlaceholderWrapper = styled(Flex)`
  width: 100%;
  height: 200px;
  border: 3px dashed ${({ color, theme }) => color || theme.colors.primary};
  border-radius: 8px;
  cursor: pointer;

  @media (max-width: 576px) {
    width: 100%;
  }
`

type Props = {
  name: string
  color?: string
  formik: FormikProps<FormikValues>
  children: React.ReactNode
}

function UploadImageInput({ name, color, formik, children }: Props) {
  const inputFileElement = useRef<HTMLInputElement>(null)

  const handleImageSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    formik.setFieldValue(name, event.target.files[0])
  }

  const handleChooseImage = () => {
    inputFileElement.current?.click()
  }

  return (
    <>
      {formik.values[name] ? (
        <ImageWrapper onClick={handleChooseImage}>
          <img src={URL.createObjectURL(formik.values[name])} alt="Whitelabel NFT" />
        </ImageWrapper>
      ) : (
        <ImagePlaceholderWrapper
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          color={color}
          onClick={handleChooseImage}
        >
          <Box>
            <ImageAddIcon width={74} marginBottom="8px" color={color} />
          </Box>
          <Text color={color} style={{ maxWidth: '150px' }} textAlign="center" fontFamily="Poppins">
            {children}
          </Text>
        </ImagePlaceholderWrapper>
      )}
      <input
        ref={inputFileElement}
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleImageSelected}
        style={{ display: 'none' }}
      />
    </>
  )
}

export default React.memo(UploadImageInput)

UploadImageInput.defaultProps = {
  color: lightColors.primary,
}
