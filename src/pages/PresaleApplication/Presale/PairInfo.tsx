import { WETH } from '@koda-finance/summitswap-sdk'
import { Box, Button, Flex, darkColors, AutoRenewIcon } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import differenceInMinutes from 'date-fns/differenceInMinutes'
import { formatUnits, isAddress } from 'ethers/lib/utils'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { NULL_ADDRESS } from 'constants/index'
import { TOKEN_CHOICES, RADIO_VALUES } from 'constants/presale'
import {
  useFactoryContract,
  usePancakeswapFactoryContract,
  usePairContract,
  usePresaleContract,
} from 'hooks/useContract'
import { useToken } from 'hooks/Tokens'
import { shortenAddress } from 'utils'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import { LoadingButtonTypes, LoadingForButton, FeeInfo, PresaleInfo } from '../types'
import { DetailText, StyledText, Divider, DetailTextValue } from './Shared'

interface Props {
  presaleAddress: string
  presaleInfo: PresaleInfo | undefined
  setIsMainLoading: React.Dispatch<React.SetStateAction<boolean>>
  isMainLoading: boolean
  presaleFeeInfo: FeeInfo | undefined
}

const HeadingBorder = styled.div`
  width: 42px;
  height: 4px;
  background: ${({ theme }) => theme.colors.primaryDark};
`

const PairInfo = ({ setIsMainLoading, isMainLoading, presaleAddress, presaleInfo, presaleFeeInfo }: Props) => {
  const { account, chainId } = useWeb3React()

  const [pairAddressSummit, setPairAddressSummit] = useState(NULL_ADDRESS)
  const [pairAddressPancake, setPairAddressPancake] = useState(NULL_ADDRESS)
  const [amountSummit, setAmountSummit] = useState(0)
  const [amountPancake, setAmountPancake] = useState(0)
  const [liquidityLockDate, setLiquidityLockDate] = useState<number>()
  const [isLoadingButton, setIsLoadingButton] = useState<LoadingForButton>({
    type: LoadingButtonTypes.NotSelected,
    error: '',
    isClicked: false,
  })

  const presaleContract = usePresaleContract(presaleAddress)
  const pairContractSummit = usePairContract(pairAddressSummit !== NULL_ADDRESS ? pairAddressSummit : undefined)
  const pairContractPancake = usePairContract(pairAddressPancake !== NULL_ADDRESS ? pairAddressPancake : undefined)
  const presaleToken = useToken(presaleInfo?.presaleToken)

  const factoryContract = useFactoryContract()
  const pancakeFactoryContract = usePancakeswapFactoryContract()

  const listingTokenPancake = useMemo(() => {
    if (presaleFeeInfo && chainId) {
      if (presaleFeeInfo.paymentToken === NULL_ADDRESS) {
        return WETH[chainId].address
      }
      return presaleFeeInfo.paymentToken
    }
    return ''
  }, [presaleFeeInfo, chainId])

  const listingTokenSummit = useMemo(() => {
    if (presaleInfo && chainId) {
      if (presaleInfo.listingToken === NULL_ADDRESS) {
        return WETH[chainId].address
      }
      return presaleInfo.listingToken
    }
    return ''
  }, [presaleInfo, chainId])

  useEffect(() => {
    async function fetchLiquidityLockTimestamp() {
      setLiquidityLockDate((await presaleContract?.startDateClaim()).toNumber())
    }
    if (presaleContract && presaleInfo?.isClaimPhase) fetchLiquidityLockTimestamp()
  }, [presaleContract, presaleInfo?.isClaimPhase])

  useEffect(() => {
    async function fetchPresaleBalance() {
      const decimals = await pairContractSummit?.decimals()
      setAmountSummit(Number(formatUnits(await pairContractSummit?.balanceOf(presaleAddress), decimals)))
    }
    if (pairContractSummit) fetchPresaleBalance()
  }, [pairContractSummit, presaleAddress])

  useEffect(() => {
    async function fetchPresaleBalance() {
      const decimals = await pairContractPancake?.decimals()
      setAmountPancake(Number(formatUnits(await pairContractPancake?.balanceOf(presaleAddress), decimals)))
    }
    if (pairContractPancake) fetchPresaleBalance()
  }, [pairContractPancake, presaleAddress])

  useEffect(() => {
    async function fetchPairAddress() {
      setPairAddressSummit(await factoryContract?.getPair(listingTokenSummit, presaleInfo?.presaleToken))
    }
    if (isAddress(listingTokenSummit) && presaleInfo && factoryContract) fetchPairAddress()
  }, [factoryContract, listingTokenSummit, presaleInfo])

  useEffect(() => {
    async function fetchPairAddress() {
      setPairAddressPancake(await pancakeFactoryContract?.getPair(listingTokenPancake, presaleInfo?.presaleToken))
    }
    if (isAddress(listingTokenPancake) && presaleInfo && pancakeFactoryContract) fetchPairAddress()
  }, [pancakeFactoryContract, listingTokenPancake, presaleInfo])

  const getListingTokenSymbol = useCallback((address: string | undefined) => {
    if (address) {
      return Object.keys(TOKEN_CHOICES).find((key) => TOKEN_CHOICES[key] === address)
    }
    return ''
  }, [])

  useEffect(() => {
    if (isLoadingButton?.error !== '') {
      setTimeout(() => {
        setIsLoadingButton({
          isClicked: false,
          type: LoadingButtonTypes.NotSelected,
          error: '',
        })
      }, 3000)
    }
  }, [isLoadingButton])

  const unLockDate = useMemo(() => {
    return new Date(
      presaleInfo?.liquidyLockTimeInMins
        .add(liquidityLockDate || 0)
        .mul(1000)
        .toNumber() || 0
    )
  }, [presaleInfo, liquidityLockDate])

  const withdrawLpTokensHandler = async () => {
    if (!presaleContract || presaleInfo?.owner !== account) {
      return
    }
    try {
      setIsMainLoading(true)
      setIsLoadingButton({
        isClicked: true,
        type: LoadingButtonTypes.WithdrawLpTokens,
        error: '',
      })
      const result = await presaleContract?.withdrawLpTokens([pairAddressSummit, pairAddressPancake], account)
      await result.wait()

      setIsMainLoading(false)
      setIsLoadingButton({
        isClicked: false,
        type: LoadingButtonTypes.NotSelected,
        error: '',
      })
      setAmountSummit(0)
      setAmountPancake(0)
    } catch (err) {
      setIsMainLoading(false)
      setIsLoadingButton({
        isClicked: false,
        type: LoadingButtonTypes.WithdrawLpTokens,
        error: 'Withdrawal Failed.',
      })
      console.error(err)
    }
  }

  return (
    <Box>
      {presaleInfo && (
        <>
          <StyledText marginBottom="8px" marginTop="24px" fontSize="20px" bold>
            Pair Info
          </StyledText>

          <Flex style={{ columnGap: '90px' }} flexWrap="wrap">
            {presaleInfo.listingChoice !== RADIO_VALUES.LISTING_PS_100 && (
              <Box marginBottom="8px">
                <StyledText color="textSubtle" fontSize="12px">
                  Listing Router/DEX
                </StyledText>
                <StyledText marginBottom="2px" bold color={darkColors.primaryDark}>
                  SummitSwap
                </StyledText>
                <HeadingBorder />
                {pairAddressSummit !== NULL_ADDRESS && (
                  <Flex marginTop="8px">
                    <StyledText style={{ width: '140px' }} fontSize="14px">
                      Pair Address
                    </StyledText>
                    <StyledText style={{ width: '100px' }} color="linkColor" fontSize="14px">
                      {shortenAddress(pairAddressSummit)}
                    </StyledText>
                  </Flex>
                )}
                <Flex marginTop="4px">
                  <StyledText style={{ width: '140px' }} fontSize="14px">
                    Pair Name
                  </StyledText>
                  <StyledText style={{ width: '100px' }} fontSize="14px">
                    {`${presaleToken?.symbol || ''} / ${getListingTokenSymbol(presaleInfo?.listingToken)}`}
                  </StyledText>
                </Flex>
              </Box>
            )}

            {presaleInfo.listingChoice !== RADIO_VALUES.LISTING_SS_100 && (
              <Box marginBottom="8px">
                <StyledText color="textSubtle" fontSize="12px">
                  Listing Router/DEX
                </StyledText>
                <StyledText marginBottom="2px" bold color={darkColors.primaryDark}>
                  PancakeSwap
                </StyledText>
                <HeadingBorder />
                {pairAddressPancake !== NULL_ADDRESS && (
                  <Flex marginTop="8px">
                    <StyledText style={{ width: '140px' }} fontSize="14px">
                      Pair Address
                    </StyledText>
                    <StyledText style={{ width: '100px' }} color="linkColor" fontSize="14px">
                      {shortenAddress(pairAddressPancake)}
                    </StyledText>
                  </Flex>
                )}
                <Flex marginTop="4px">
                  <StyledText style={{ width: '140px' }} fontSize="14px">
                    Pair Name
                  </StyledText>
                  <StyledText style={{ width: '100px' }} fontSize="14px">
                    {`${presaleToken?.symbol || ''} / ${getListingTokenSymbol(presaleFeeInfo?.paymentToken)}`}
                  </StyledText>
                </Flex>
              </Box>
            )}
          </Flex>

          {account && presaleInfo.isClaimPhase && presaleInfo?.owner === account && (
            <>
              <StyledText marginBottom="8px" marginTop="16px" fontSize="20px" bold>
                Liquidity Lockup Info
              </StyledText>
              <Flex style={{ columnGap: '90px' }} flexWrap="wrap">
                {presaleInfo.listingChoice !== RADIO_VALUES.LISTING_PS_100 && (
                  <Box marginBottom="8px">
                    <StyledText marginBottom="2px" bold color={darkColors.primaryDark}>
                      SummitSwap
                    </StyledText>
                    <HeadingBorder />
                    <Flex marginTop="8px">
                      <StyledText style={{ width: '140px' }} fontSize="14px">
                        Amount Locked
                      </StyledText>
                      <StyledText style={{ width: '100px' }} fontSize="14px">
                        {amountSummit.toPrecision(6)}
                      </StyledText>
                    </Flex>
                  </Box>
                )}
                {presaleInfo.listingChoice !== RADIO_VALUES.LISTING_SS_100 && (
                  <Box marginBottom="8px">
                    <StyledText marginBottom="2px" bold color={darkColors.primaryDark}>
                      PancakeSwap
                    </StyledText>
                    <HeadingBorder />
                    <Flex marginTop="8px">
                      <StyledText style={{ width: '140px' }} fontSize="14px">
                        Amount Locked
                      </StyledText>
                      <StyledText style={{ width: '100px' }} fontSize="14px">
                        {amountPancake.toPrecision(6)}
                      </StyledText>
                    </Flex>
                  </Box>
                )}
              </Flex>
              <Divider />
              <Flex marginTop="12px" justifyContent="space-between">
                <DetailText>Owner</DetailText>
                <DetailTextValue color="linkColor">{presaleInfo?.owner || ''}</DetailTextValue>
              </Flex>
              <Flex marginTop="4px" justifyContent="space-between">
                <DetailText>Lock Date</DetailText>
                <DetailTextValue>{new Date((liquidityLockDate || 0) * 1000).toUTCString()}</DetailTextValue>
              </Flex>
              <Flex marginTop="4px" justifyContent="space-between">
                <DetailText>Unlock Date</DetailText>
                <DetailTextValue>{unLockDate.toUTCString()}</DetailTextValue>
              </Flex>
              <Flex justifyContent="end">
                {differenceInSeconds(unLockDate, new Date()) > 0 ? (
                  <StyledText textAlign="right" fontSize="12px" style={{ minWidth: '100%' }} color="failure">
                    {`(in ${differenceInMinutes(unLockDate, new Date())} minutes)`}
                  </StyledText>
                ) : (
                  <StyledText textAlign="right" fontSize="12px" style={{ minWidth: '100%' }} color="success">
                    (Liquidity is unlocked)
                  </StyledText>
                )}
              </Flex>
              <Box marginY="16px">
                <Button
                  height="35px"
                  onClick={withdrawLpTokensHandler}
                  isLoading={isMainLoading || isLoadingButton.isClicked}
                  disabled={
                    !!isLoadingButton.error ||
                    differenceInSeconds(unLockDate, new Date()) > 0 ||
                    (amountSummit === 0 && amountPancake === 0)
                  }
                  endIcon={
                    isLoadingButton.isClicked &&
                    isLoadingButton.type === LoadingButtonTypes.WithdrawLpTokens && (
                      <AutoRenewIcon spin color="currentColor" />
                    )
                  }
                >
                  Unlock Locked Liquidity
                </Button>
                {isLoadingButton.error && (
                  <StyledText fontSize="12px" color="failure">
                    {isLoadingButton.error}
                  </StyledText>
                )}
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  )
}

export default PairInfo
