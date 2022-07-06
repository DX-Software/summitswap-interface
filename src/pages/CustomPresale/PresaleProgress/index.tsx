import { Token } from '@koda-finance/summitswap-sdk'
import { Box, Progress } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import { RowBetween } from 'components/Row'
import Tag from 'components/Tag'
import { BigNumber, Contract } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { checkSalePhase } from 'utils/presale'
import { TextContributor, TextHeading, TextSubHeading } from '../StyledTexts'
import { LoadingForButton, PresaleInfo } from '../types'
import BuyTokens from './BuyTokens'
import ClaimWithdrawSection from './ClaimWithdrawSection'
import ProgressBox from './ProgressBox'
import WhitelistSection from './WhitelistSection'

interface Props {
  token: Token | null | undefined
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setPresaleInfo: React.Dispatch<React.SetStateAction<PresaleInfo | undefined>>
  setLoadingForButton: React.Dispatch<React.SetStateAction<LoadingForButton>>
  presaleInfo: PresaleInfo | undefined
  loadingForButton: LoadingForButton
  whitelistAddresses: string[]
  presaleContract: Contract | null
}

export const Card = styled.div`
  background: #011724;
  border-radius: 20px;
  padding: 25px 28px;
  width: 100%;
`

const PresaleProgress = ({
  token,
  loadingForButton,
  isLoading,
  presaleContract,
  presaleInfo,
  whitelistAddresses,
  setIsLoading,
  setLoadingForButton,
  setPresaleInfo,
}: Props) => {
  const { account } = useWeb3React()
  const [youBought, setYouBought] = useState<BigNumber>()
  const [presalePhase, setPresalePhase] = useState('')
  const [contributors, setContributors] = useState<string[]>([])

  useEffect(() => {
    async function getContributors() {
      setContributors(await presaleContract?.getContributors())
    }
    if (presaleInfo && presaleContract) getContributors()
  }, [presaleInfo, presaleContract])

  useEffect(() => {
    async function fetchYouBought() {
      setYouBought(await presaleContract?.bought(account))
    }
    if (presaleContract && account) {
      fetchYouBought()
    }
  }, [presaleContract, account])

  useEffect(() => {
    setPresalePhase(checkSalePhase(presaleInfo))
  }, [presaleInfo])

  return (
    <Card>
      <RowBetween>
        <TextHeading>{token?.name} Presale</TextHeading>
        <TextContributor>Contributors: {contributors.length}</TextContributor>
      </RowBetween>
      <Tag saleTypeTag>{presaleInfo?.isWhitelistEnabled ? 'WHITELIST' : 'PUBLIC'}</Tag>
      <Tag>{presalePhase !== '' ? presalePhase : 'LOADING PRESALE'}</Tag>
      <Box marginTop="30px" marginBottom="30px">
        <TextHeading marginBottom="5px">Total Progress:</TextHeading>
        <ProgressBox marginBottom={1} isProgressBnb>
          <Progress primaryStep={presaleInfo?.totalBought.mul(100).div(presaleInfo.hardcap).toNumber()} />
        </ProgressBox>
        <RowBetween>
          <TextSubHeading>{presaleInfo?.totalBought.mul(100).div(presaleInfo.hardcap).toString()}%</TextSubHeading>
          <TextSubHeading>
            {`${formatUnits(presaleInfo?.totalBought || 0, 18)}/${formatUnits(presaleInfo?.hardcap || 0, 18)} BNB`}
          </TextSubHeading>
        </RowBetween>
      </Box>
      <BuyTokens
        token={token}
        presaleContract={presaleContract}
        loadingForButton={loadingForButton}
        isLoading={isLoading}
        presaleInfo={presaleInfo}
        whitelistAddresses={whitelistAddresses}
        youBought={youBought}
        setIsLoading={setIsLoading}
        setPresaleInfo={setPresaleInfo}
        setYouBought={setYouBought}
      />
      <ClaimWithdrawSection
        token={token}
        youBought={youBought}
        isLoading={isLoading}
        presaleInfo={presaleInfo}
        presaleContract={presaleContract}
        loadingForButton={loadingForButton}
        setPresaleInfo={setPresaleInfo}
        setYouBought={setYouBought}
        setIsLoading={setIsLoading}
        setLoadingForButton={setLoadingForButton}
      />
      {presaleInfo?.isWhitelistEnabled && whitelistAddresses.length && (
        <WhitelistSection whitelistAddresses={whitelistAddresses} />
      )}
    </Card>
  )
}

export default PresaleProgress
