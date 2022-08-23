import React from 'react'
import { formatUnits } from 'ethers/lib/utils'
import { Box, Flex, darkColors } from '@koda-finance/summitswap-uikit'
import { PresaleInfo } from '../types'
import { DetailText, StyledText, Divider, DetailTextValue } from './Shared'

interface Props {
  presaleInfo: PresaleInfo | undefined
  currency: string
}

const GoalSystem = ({ presaleInfo, currency }: Props) => {
  return (
    <Box>
      <StyledText marginBottom="2px" bold color={darkColors.primaryDark}>
        Goal System
      </StyledText>
      <Divider />
      <Flex marginTop="4px" justifyContent="space-between">
        <DetailText>Softcap</DetailText>
        <DetailTextValue>{`${formatUnits(presaleInfo?.softcap || 0)} ${currency}`}</DetailTextValue>
      </Flex>
      <Flex marginTop="4px" justifyContent="space-between">
        <DetailText>Hardcap</DetailText>
        <DetailTextValue>{`${formatUnits(presaleInfo?.hardcap || 0)} ${currency}`}</DetailTextValue>
      </Flex>
    </Box>
  )
}

export default GoalSystem
