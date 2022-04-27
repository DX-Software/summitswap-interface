import React from 'react'
import { Pair } from '@koda-finance/summitswap-sdk'
import { Button, Card as UIKitCard, CardBody, Text } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'
import { BigNumber, utils } from 'ethers'
import AnimatedBar from './AnimatedBar'
import { useActiveWeb3React } from '../../hooks'

import { unwrappedToken } from '../../utils/wrappedCurrency'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import { RowBetween, RowFixed, RowFlatCenter } from '../Row'

const FixedHeightRow = styled(RowBetween)`
  height: 28px;
`

interface Props {
  pair: Pair
  lockId: number
  // eslint-disable-next-line react/no-unused-prop-types
  showUnwrapped?: boolean
  isLoading: boolean
  lock: (string|BigNumber)[]
  widthdarLiquidity: (lockId: any, owner: any) => void
  timeLeft: (date: Date) => {
    months: number;
    days: number;
    hours: number;
    mins: number;
}
}

export default function LockedPoolCard({
  pair,
  widthdarLiquidity,
  lockId,
  isLoading,
  lock,
  timeLeft,
  showUnwrapped = true,
}: Props) {
  const { account } = useActiveWeb3React()

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const [, owner, tokenAmount, unlockDate] = lock;

  const date = new Date(Number(unlockDate) * 1000)

  const { months, days, hours, mins } = timeLeft(date)

  return owner === account ? (
    <UIKitCard>
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
          <AnimatedBar/>
          <FixedHeightRow>
            <RowFixed>
              <Text fontSize="14px" color="inputColor">
                {`Unlocks ${date.toLocaleString([], { hour12: true }).toLocaleUpperCase()}`}
              </Text>
            </RowFixed>
            <RowFixed>
              <Text color="inputColor" fontSize="14px">
                {months ? `${months} Months ` : ''}
              </Text>
              <Text color="inputColor" fontSize="14px">
                {days ? `, ${days} Days `: ''}
              </Text>
              <Text color="inputColor" fontSize="14px">
                {hours ? `, ${hours} hours `: ''}
              </Text>
              <Text color="inputColor" fontSize="14px">
                {mins ? `, ${mins} Minutes ` : ''}
              </Text>
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
                  disabled={isLoading || account !== owner || (date>= new Date())}
                  onClick={() => widthdarLiquidity(lockId, owner)}
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

