import React from 'react'
import { Box, Text } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'
import CustomLightSpinner from '../../components/CustomLightSpinner'

const LoadingCard = styled(Box)`
  width: 80%;
  max-width: 600px;
  padding: 30px;
  height: 467px;
  background: #000f18;
  border-radius: 20px;
  height: fit-content;
  padding-bottom: 50px;
`

const CreateTokenLoadingCard = () => (
  <LoadingCard>
    <Text mb={30} fontSize="27px" textAlign="center" fontWeight="700" fontFamily="Roboto">
      Generating Token
    </Text>
    <Box display="flex">
      <CustomLightSpinner src="/images/blue-loader.svg" size="30%" />
    </Box>
  </LoadingCard>
)

export default CreateTokenLoadingCard
