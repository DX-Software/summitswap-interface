import React, { useEffect, useState } from 'react'
import { formatUnits } from 'ethers/lib/utils'
import { Box, FewPeopleIcon, Flex, Progress } from '@koda-finance/summitswap-uikit'
import { usePresaleContract } from 'hooks/useContract'
import { useToken } from 'hooks/Tokens'
import { NULL_ADDRESS } from 'constants/index'
import { TOKEN_CHOICES } from 'constants/presale'
import { PresaleInfo, FeeInfo } from '../types'
import { StyledText, Divider } from './Shared'
import ProgressWrapper from '../ProgressWrapper'

interface Props {
  presaleAddress: string
  presaleInfo: PresaleInfo | undefined
  presaleFeeInfo: FeeInfo | undefined
}

const PresaleGoals = ({ presaleAddress, presaleInfo, presaleFeeInfo }: Props) => {
  const [contributors, setContributors] = useState<string[]>([])
  const [currency, setCurrency] = useState('BNB')

  const presaleContract = usePresaleContract(presaleAddress)
  const paymentToken = useToken(
    presaleFeeInfo?.paymentToken === NULL_ADDRESS ? undefined : presaleFeeInfo?.paymentToken
  )

  useEffect(() => {
    async function fetchContributors() {
      setContributors(await presaleContract?.getContributors())
    }
    if (presaleContract) fetchContributors()
  }, [presaleContract, presaleInfo])

  useEffect(() => {
    const currentCurrency = Object.keys(TOKEN_CHOICES).find(
      (key) => TOKEN_CHOICES[key] === presaleFeeInfo?.paymentToken
    )
    if (presaleFeeInfo) setCurrency(currentCurrency as string)
  }, [presaleFeeInfo])

  return (
    <>
      <StyledText bold fontSize="20px">
        Presale Goals
      </StyledText>
      <Flex justifyContent="space-between" alignItems="center">
        <ProgressWrapper style={{ flexGrow: 1 }} isPresale marginRight="8px">
          <Progress primaryStep={presaleInfo?.totalBought.mul(100).div(presaleInfo.hardcap).toNumber()} />
        </ProgressWrapper>
        <StyledText style={{ display: 'inline', width: 'fit-content' }} fontSize="14px">{`${formatUnits(
          presaleInfo?.hardcap || 0,
          paymentToken?.decimals || 18
        )} ${currency}`}</StyledText>
      </Flex>
      <StyledText color="textSubtle" fontSize="14px">
        <StyledText style={{ display: 'inline-block' }} bold color="linkColor" fontSize="14px">
          {`${presaleInfo?.totalBought.mul(100).div(presaleInfo.hardcap) || 0}%`}&nbsp;
        </StyledText>
        {`reached (${formatUnits(presaleInfo?.totalBought || 0, paymentToken?.decimals || 18)} ${currency})`}
      </StyledText>
      <Flex marginTop="16px" marginBottom="8px" justifyContent="space-between">
        <StyledText bold fontSize="14px" color="primary">
          Total Contributors
        </StyledText>
        <Box>
          <StyledText style={{ display: 'inline-block' }} bold fontSize="14px" color="primary" marginRight="2px">
            {contributors.length}
          </StyledText>
          <FewPeopleIcon width="14px" color="primary" />
        </Box>
      </Flex>
      <Divider />
    </>
  )
}

export default PresaleGoals
