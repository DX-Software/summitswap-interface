import { Box, Button, CloseIcon, Flex, ImageAddIcon, lightColors, Text } from '@koda-finance/summitswap-uikit'
import { SUPPORTED_IMAGE_FORMAT } from 'constants/whitelabel'
import { FormikProps } from 'formik'
import React, { useRef } from 'react'
import styled from 'styled-components'
import { WhitelabelNft } from 'types/whitelabelNft'

const ImageWrapper = styled(Flex)`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
`

const SelectedImage = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: cover;
`

const RemoveImageButton = styled(Button)`
  position: absolute;
  border-radius: 0;
  width: 20px;
  height: 20px;
  padding: 4px;
  z-index: 10;
`

const SelectedPlaceholder = styled.div`
  position: absolute;
  color: white;
  bottom: 0;
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  background-color: ${({ theme }) => theme.colors.dropdownBackground};
  opacity: 0.8;
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
  selectedPlaceholder?: string
  color?: string
  formik: FormikProps<WhitelabelNft>
  children: React.ReactNode
}

function UploadImageInput({ name, selectedPlaceholder, color, formik, children }: Props) {
  const inputFileElement = useRef<HTMLInputElement>(null)

  const handleImageSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    formik.setFieldValue(name, event.target.files[0])
  }

  const handleImageRemove = () => {
    formik.setFieldValue(name, undefined)
    if (inputFileElement.current) {
      inputFileElement.current.value = ''
    }
  }

  const handleChooseImage = () => {
    inputFileElement.current?.click()
  }

  return (
    <>
      {formik.values[name] ? (
        <ImageWrapper>
          <RemoveImageButton variant="danger" onClick={handleImageRemove}>
            <CloseIcon color="white" width={16} height={16} />
          </RemoveImageButton>
          <Box onClick={handleChooseImage} width="100%" background="black">
            <SelectedImage src={URL.createObjectURL(formik.values[name])} alt="Whitelabel NFT" />
            {selectedPlaceholder && <SelectedPlaceholder>{selectedPlaceholder}</SelectedPlaceholder>}
          </Box>
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
        accept={SUPPORTED_IMAGE_FORMAT.join(',')}
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
