import React, { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import styled from 'styled-components'
import { formatUnits } from 'ethers/lib/utils'
import { useWeb3React } from '@web3-react/core'
import { Box, Flex } from '@koda-finance/summitswap-uikit'
import { usePresaleContract } from 'hooks/useContract'
import { StyledText } from './Shared'

interface Props {
  presaleAddress: string
  currency: string
  tokenSymbol: string | undefined
  presaleRate: BigNumber | undefined
}

const ContributionCard = styled(Box)`
  background: ${({ theme }) => theme.colors.primaryDark};
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
`

const ContributionBox = ({ presaleAddress, currency, tokenSymbol, presaleRate }: Props) => {
  const { account } = useWeb3React()
  const [contributionAmount, setContributionAmount] = useState(BigNumber.from('0'))

  const presaleContract = usePresaleContract(presaleAddress)

  useEffect(() => {
    async function fetchContribution() {
      setContributionAmount(await presaleContract?.bought(account))
    }
    if (presaleContract && account) fetchContribution()
  }, [presaleContract, account])

  return contributionAmount.gte(0) ? (
    <ContributionCard>
      <StyledText fontSize="14px" marginBottom="2px" bold>
        You have contributed to this presale
      </StyledText>
      <Flex justifyContent="space-between">
        <StyledText fontSize="12px">Total Contribution</StyledText>
        <StyledText fontSize="12px">{`${formatUnits(contributionAmount)} ${currency}`}</StyledText>
      </Flex>
      <Flex justifyContent="space-between">
        <StyledText fontSize="12px">Token Conversion</StyledText>
        <StyledText fontSize="12px">
          {`${formatUnits(contributionAmount.mul(presaleRate || 0), 36)} ${tokenSymbol}`}
        </StyledText>
      </Flex>
    </ContributionCard>
  ) : (
    <></>
  )
}

export default ContributionBox
