import React from 'react'
import { Trade, TradeType } from '@koda-finance/summitswap-sdk'
import { Card, CardBody, Text } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'
import { Field } from '../../state/swap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import { SectionBreak } from './styleds'
import SwapRoute from './SwapRoute'

const Title = styled(Text)`
  font-size: 14px;
  font-family: Raleway;
  color: ${({ theme }) => theme.colors.invertedContrast};
`;

const Description = styled(Text)`
  font-size: 14px;
  font-family: Oswald;
  color: ${({ theme }) => theme.colors.invertedContrast};
  text-align: right;
`

function TradeSummary({ trade, allowedSlippage }: { trade: Trade; allowedSlippage: number }) {
  const { realizedLPFee } = computeTradePriceBreakdown(trade)
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)

  return (
    <Card>
      <CardBody>
        <RowBetween>
          <RowFixed>
            <Title>Slippage Tolerance</Title>
            <QuestionHelper
              isGray
              text="This is a setting for the limit of price slippage you are willing to accept."
            />
          </RowFixed>
          <Description>{allowedSlippage / 100}</Description>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <Title>{isExactIn ? 'Minimum received' : 'Maximum sold'}</Title>
            <QuestionHelper
              isGray
              text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed."
            />
          </RowFixed>
          <RowFixed>
            <Description>
              {isExactIn
                ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ??
                  '-'
                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ??
                  '-'}
            </Description>
          </RowFixed>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <Title>Liquidity Provider Fee</Title>
            <QuestionHelper
              isGray
              text="For each trade a 0.2% fee is paid. 0.17% goes to liquidity providers and 0.03% goes to the Summitswap treasury."
            />
          </RowFixed>
          <Description>
            {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}
          </Description>
        </RowBetween>
      </CardBody>
    </Card>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const [allowedSlippage] = useUserSlippageTolerance()

  const showRoute = Boolean(trade && trade.route.path.length > 2)

  return (
    <AutoColumn gap="md">
      {trade && (
        <>
          <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
          {showRoute && (
            <>
              <SectionBreak />
              <AutoColumn style={{ padding: '0 24px' }}>
                <RowFixed>
                  <Text fontSize="14px">Route</Text>
                  <QuestionHelper text="Routing through these tokens resulted in the best price for your trade." />
                </RowFixed>
                <SwapRoute trade={trade} />
              </AutoColumn>
            </>
          )}
        </>
      )}
    </AutoColumn>
  )
}
