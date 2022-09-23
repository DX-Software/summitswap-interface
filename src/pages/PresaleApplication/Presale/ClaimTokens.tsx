import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { BigNumber } from 'ethers'
import { format, add, set } from 'date-fns'
import { useWeb3React } from '@web3-react/core'
import { formatUnits } from 'ethers/lib/utils'
import { AutoRenewIcon, Button, Box, CoinBagIcon, Flex, darkColors } from '@koda-finance/summitswap-uikit'
import { usePresaleContract } from 'hooks/useContract'
import { useToken } from 'hooks/Tokens'
import { fetchPresaleInfo, fetchFeeInfo } from 'utils/presale'
import { TOKEN_CHOICES } from 'constants/presale'
import { NULL_ADDRESS } from 'constants/index'
import { PresaleInfo, FeeInfo, LoadingForButton, LoadingButtonTypes } from '../types'
import { StyledText, Divider } from './Shared'
import ContributionBox from './ContributionBox'
import PresaleGoals from './PresaleGoals'

interface Props {
  presaleAddress: string
  isMainLoading: boolean
  setIsMainLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const Card = styled(Box)`
  background: ${({ theme }) => theme.colors.menuItemBackground};
  border-radius: 8px;
  padding: 20px 24px;
  margin-bottom: 16px;
  border: 1px solid ${darkColors.borderColor};
  border-radius: 8px;
`

const ClaimTokens = ({ presaleAddress, isMainLoading, setIsMainLoading }: Props) => {
  const { account } = useWeb3React()

  const [isLoadingButton, setIsLoadingButton] = useState<LoadingForButton>({
    type: LoadingButtonTypes.NotSelected,
    error: '',
    isClicked: false,
  })
  const [boughtAmount, setBoughtAmount] = useState(BigNumber.from('0'))
  const [presaleInfo, setPresaleInfo] = useState<PresaleInfo>()
  const [presaleFeeInfo, setPresaleFeeInfo] = useState<FeeInfo>()
  const [availableTokensToClaim, setAvailableToClaim] = useState(BigNumber.from('0'))
  const [claimedTokens, setClaimedTokens] = useState(BigNumber.from('0'))
  const [totalTokens, setTotalTokens] = useState(BigNumber.from('0'))
  const [currency, setCurrency] = useState('BNB')

  const presaleContract = usePresaleContract(presaleAddress)
  const presaleToken = useToken(presaleInfo?.presaleToken)
  const paymentToken = useToken(
    presaleFeeInfo?.paymentToken === NULL_ADDRESS ? undefined : presaleFeeInfo?.paymentToken
  )

  useEffect(() => {
    if (isLoadingButton?.error !== '') {
      setTimeout(() => {
        setIsLoadingButton((prevState) => ({ ...prevState, error: '' }))
      }, 3000)
    }
  }, [isLoadingButton])

  useEffect(() => {
    async function fetchTokenAmounts() {
      setAvailableToClaim(await presaleContract?.getAvailableTokenToClaim(account))
      setClaimedTokens(await presaleContract?.totalClaimToken(account))
    }
    if (presaleContract && account && presaleInfo) fetchTokenAmounts()
  }, [presaleContract, account, presaleInfo])

  useEffect(() => {
    async function fetchTotalTokens() {
      setTotalTokens(await presaleContract?.calculateBnbToPresaleToken(boughtAmount, presaleInfo?.presaleRate))
    }
    if (presaleContract && presaleInfo && account && boughtAmount.gt('0')) fetchTotalTokens()
  }, [account, boughtAmount, presaleContract, presaleInfo])

  useEffect(() => {
    async function fetchData() {
      const preInfo = await fetchPresaleInfo(presaleContract)
      const feeInfo = await fetchFeeInfo(presaleContract)
      setPresaleInfo({ ...preInfo })
      setPresaleFeeInfo({ ...feeInfo })
    }
    if (presaleContract) {
      fetchData()
    }
  }, [presaleContract])

  useEffect(() => {
    async function fetchBoughtAmount() {
      setBoughtAmount(await presaleContract?.bought(account))
    }
    if (presaleContract && account) fetchBoughtAmount()
  }, [presaleContract, account])

  useEffect(() => {
    if (presaleFeeInfo) {
      const currentCurrency = Object.keys(TOKEN_CHOICES).find(
        (key) => TOKEN_CHOICES[key] === presaleFeeInfo?.paymentToken
      )
      setCurrency(currentCurrency as string)
    }
  }, [presaleFeeInfo])

  const formattedDate = useMemo(() => {
    const date = new Date()
    const claimDay = presaleInfo?.claimIntervalDay.toNumber()
    const claimHour = presaleInfo?.claimIntervalHour.toNumber()

    if (!claimDay || !claimHour) return ''
    let currentTime = set(new Date(), { date: claimDay, hours: claimHour })
    if (date.getUTCDate() > claimDay || (date.getUTCDate() === claimDay && date.getUTCHours() >= claimHour)) {
      currentTime = add(currentTime, { months: 1 })
    }
    return `${format(currentTime, 'MMMM do yyyy HH:00')} UTC`
  }, [presaleInfo])

  const onClaimHandler = async () => {
    if (!presaleContract || !account || availableTokensToClaim.eq('0')) {
      return
    }
    try {
      setIsMainLoading(true)
      setIsLoadingButton({
        type: LoadingButtonTypes.Claim,
        isClicked: true,
        error: '',
      })
      const result = await presaleContract.claim(availableTokensToClaim)
      await result.wait()
      setIsLoadingButton({
        type: LoadingButtonTypes.NotSelected,
        isClicked: false,
        error: '',
      })
      setIsMainLoading(false)
      const availableT = availableTokensToClaim
      setAvailableToClaim(BigNumber.from('0'))
      setClaimedTokens((prevVal) => prevVal.add(availableT))
    } catch (err) {
      setIsMainLoading(false)
      setIsLoadingButton({
        type: LoadingButtonTypes.Claim,
        isClicked: false,
        error: 'Failed to claim tokens.',
      })
      console.error(err)
    }
  }

  return (
    <Box>
      <ContributionBox
        paymentDecimals={paymentToken?.decimals || 18}
        currency={currency}
        boughtAmount={boughtAmount}
        presaleInfo={presaleInfo}
        tokenSymbol={presaleToken?.symbol}
        isMainLoading={isMainLoading}
        isLoadingButton={isLoadingButton}
      />
      <Card>
        <PresaleGoals presaleAddress={presaleAddress} presaleInfo={presaleInfo} presaleFeeInfo={presaleFeeInfo} />
        <StyledText bold fontSize="16px" marginTop="16px" color="success">
          Claim Tokens
        </StyledText>
        <Flex justifyContent="space-between">
          <StyledText fontSize="14px">Total Contribution</StyledText>
          <StyledText fontSize="14px">{`${formatUnits(boughtAmount, paymentToken?.decimals)} ${currency}`}</StyledText>
        </Flex>
        <Flex justifyContent="space-between" marginBottom="8px">
          <StyledText fontSize="14px">Token Conversion</StyledText>
          <StyledText fontSize="14px">
            {`${formatUnits(totalTokens, presaleToken?.decimals)} ${presaleToken?.symbol || ''}`}
          </StyledText>
        </Flex>
        {presaleInfo?.isVestingEnabled && (
          <>
            <Divider />
            <Flex marginTop="16px" justifyContent="space-between">
              <StyledText fontSize="14px">Available for Claim</StyledText>
              <StyledText color="primary" fontSize="14px">{`${formatUnits(
                availableTokensToClaim,
                presaleToken?.decimals || 0
              )} ${presaleToken?.symbol || ''}`}</StyledText>
            </Flex>
            <StyledText color="textDisabled" fontSize="10px">
              Next distribution on {formattedDate}
            </StyledText>
            <Flex marginTop="2px" justifyContent="space-between" marginBottom="16px">
              <StyledText fontSize="14px">Total Claimed</StyledText>
              <StyledText fontSize="14px">{`${formatUnits(claimedTokens, presaleToken?.decimals || 0)} ${
                presaleToken?.symbol || ''
              }`}</StyledText>
            </Flex>
          </>
        )}
        <Button
          variant={!presaleInfo?.isClaimPhase || presaleInfo?.isPresaleCancelled ? 'awesome' : 'primary'}
          onClick={onClaimHandler}
          disabled={
            !presaleInfo?.isClaimPhase ||
            presaleInfo?.isPresaleCancelled ||
            isMainLoading ||
            isLoadingButton.isClicked ||
            availableTokensToClaim.eq('0')
          }
          marginBottom="8px"
          scale="sm"
          width="100%"
          startIcon={!isLoadingButton.isClicked && <CoinBagIcon color="currentColor" />}
          endIcon={isLoadingButton.isClicked && <AutoRenewIcon spin color="currentColor" />}
        >
          Claim My Token
        </Button>
        <Flex justifyContent="center">
          {isLoadingButton.error ? (
            <StyledText color="failure" fontSize="12px">
              {isLoadingButton.error}
            </StyledText>
          ) : (
            <>
              {presaleInfo?.isClaimPhase ? (
                <StyledText color="sidebarActiveColor" fontSize="12px">
                  {totalTokens.gt('0') && totalTokens.eq(claimedTokens)
                    ? 'You have claimed your tokens'
                    : '  The creator has finalized the project.'}
                </StyledText>
              ) : (
                <StyledText color="textDisabled" fontSize="12px">
                  The creator hasn’t finalized the project
                </StyledText>
              )}
            </>
          )}
        </Flex>
      </Card>
    </Box>
  )
}

export default ClaimTokens
