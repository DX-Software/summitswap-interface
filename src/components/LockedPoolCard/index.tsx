import React from 'react'
import { Pair } from '@koda-finance/summitswap-sdk'
import { useWeb3React } from '@web3-react/core'
import { Button, Card as UIKitCard, CardBody, Text } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'
import { BigNumber, utils } from 'ethers'
import AnimatedBar from './AnimatedBar'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import { RowBetween, RowFixed, RowFlatCenter } from '../Row'

const FixedHeightRow = styled(RowBetween)`
  height: 28px;
`

const UnlockText = styled(Text)`
  @media (max-width: 680px) {
    font-size: 10px;
  }
  @media (max-width: 480px) {
    font-size: 7px;
  }
`

interface Props {
  pair: Pair
  lockId: number
  isLoading: boolean
  lock: (string | BigNumber)[]
  withdrawLiquidity: (lockId: any, owner: any) => void
  timeLeftToUnLock: (
    date: Date
  ) => {
    monthWithYears: number | undefined
    days: number | undefined
    hours: number | undefined
    minutes: number | undefined
  }
  // eslint-disable-next-line react/no-unused-prop-types
  showUnwrapped?: boolean
}

export default function LockedPoolCard({
  pair,
  lock,
  lockId,
  isLoading,
  timeLeftToUnLock,
  withdrawLiquidity,
  showUnwrapped = true,
}: Props) {
  const { account } = useWeb3React()

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const [, owner, tokenAmount, unlockDate] = lock

  const date = new Date(Number(unlockDate) * 1000)
  const { monthWithYears, days, hours, minutes } = timeLeftToUnLock(date)

  return owner === account ? (
    <UIKitCard style={{ marginBottom: '10px' }}>
      <CardBody>
        <AutoColumn gap="12px">
          <RowFlatCenter>
            <RowFixed>
              <CurrencyLogo size="28px" style={{ marginRight: '8px' }} currency={currency0} />
              <Text fontSize="16px" fontWeight={600}>
                {currency0.symbol}/{currency1.symbol}
              </Text>
              <CurrencyLogo size="28px" style={{ marginLeft: '8px' }} currency={currency1} />
            </RowFixed>
          </RowFlatCenter>
          <AnimatedBar />
          <FixedHeightRow>
            <RowFixed>
              <UnlockText fontSize="14px" color="inputColor">
                {`Unlocks ${date.toLocaleString([], { hour12: true }).toLocaleUpperCase()}`}
              </UnlockText>
            </RowFixed>
            <RowFixed>
              <UnlockText color="inputColor" fontSize="14px">
                {monthWithYears ? `${monthWithYears} Months ` : ''}
              </UnlockText>
              <UnlockText color="inputColor" fontSize="14px">
                {days ? `, ${days} Days ` : ''}
              </UnlockText>
              <UnlockText color="inputColor" fontSize="14px">
                {hours ? `, ${hours} hours ` : ''}
              </UnlockText>
              <UnlockText color="inputColor" fontSize="14px">
                {minutes ? `, ${minutes} Minutes ` : ''}
              </UnlockText>
            </RowFixed>
          </FixedHeightRow>
          <AutoColumn gap="4px">
            <FixedHeightRow>
              <RowFixed>
                <Text>{`LP: ${Number(utils.formatEther(tokenAmount)).toFixed(8)}`}</Text>
              </RowFixed>
              <RowFixed>
                <Button
                  scale="xxs"
                  disabled={isLoading || account !== owner || date >= new Date()}
                  onClick={() => withdrawLiquidity(lockId, owner)}
                >
                  Withdraw
                </Button>
              </RowFixed>
            </FixedHeightRow>
          </AutoColumn>
        </AutoColumn>
      </CardBody>
    </UIKitCard>
  ) : (
    <></>
  )
}
