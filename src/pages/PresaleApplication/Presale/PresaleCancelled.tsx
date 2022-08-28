import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { BigNumber } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { Button, Box, darkColors } from '@koda-finance/summitswap-uikit'
import { usePresaleContract, useTokenContract } from 'hooks/useContract'
import { useToken } from 'hooks/Tokens'
import { fetchPresaleInfo, fetchFeeInfo } from 'utils/presale'
import { NULL_ADDRESS } from 'constants/index'
import { TOKEN_CHOICES } from 'constants/presale'
import { PresaleInfo, FeeInfo, LoadingForButton, LoadingButtonTypes } from '../types'
import { StyledText } from './Shared'
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

const PresaleCancelled = ({ presaleAddress, isMainLoading, setIsMainLoading }: Props) => {
  const { account, library } = useWeb3React()

  const [isLoadingButton, setIsLoadingButton] = useState<LoadingForButton>({
    type: LoadingButtonTypes.NotSelected,
    error: '',
    isClicked: false,
  })
  const [boughtAmount, setBoughtAmount] = useState(BigNumber.from('0'))
  const [presaleInfo, setPresaleInfo] = useState<PresaleInfo>()
  const [presaleFeeInfo, setPresaleFeeInfo] = useState<FeeInfo>()
  const [contributors, setContributors] = useState<string[]>([])
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
    async function fetchContributors() {
      setContributors(await presaleContract?.getContributors())
    }
    if (presaleContract) fetchContributors()
  }, [presaleContract, boughtAmount])

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

  const withdrawPaymentHandler = async () => {
    if (!presaleContract || !account || boughtAmount?.eq(0) || !presaleInfo?.isPresaleCancelled) {
      return
    }
    try {
      setIsLoadingButton({ type: LoadingButtonTypes.Withdraw, error: '', isClicked: true })
      setIsMainLoading(true)
      const result = await presaleContract?.withdrawPaymentToken()
      await result.wait()
      const prevBoughtAmount = boughtAmount
      setBoughtAmount(BigNumber.from(0))
      setPresaleInfo((prevState) =>
        prevState && prevBoughtAmount
          ? {
              ...prevState,
              totalBought: prevState.totalBought.sub(prevBoughtAmount),
            }
          : prevState
      )
      setIsLoadingButton({ type: LoadingButtonTypes.NotSelected, error: '', isClicked: false })
      setIsMainLoading(false)
    } catch (err) {
      setIsMainLoading(false)
      setIsLoadingButton({ type: LoadingButtonTypes.Withdraw, error: 'Withdrawal Failed.', isClicked: false })
      console.error(err)
    }
  }

  return account && boughtAmount.gt(0) ? (
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
        <Button onClick={withdrawPaymentHandler} height="40px" marginTop="16px" scale="md">
          Withdraw Fund
        </Button>
        <StyledText fontSize="10px" style={{ height: '10px' }} marginTop="4px" color="failure">
          {isLoadingButton.error}
        </StyledText>
        <StyledText fontSize="14px" marginTop="6px" color="textSubtle">
          The creator has cancelled this presale
        </StyledText>
      </Card>
    </Box>
  ) : (
    <></>
  )
}

export default PresaleCancelled
