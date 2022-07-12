/* eslint-disable no-nested-ternary */
import {
  Box,
  Breadcrumbs,
  Button,
  ButtonMenu,
  ButtonMenuItem,
  Card,
  Flex,
  Heading,
  HelpIcon,
  LinkExternal,
  Spinner,
  Text,
  Percent,
  useMatchBreakpoints,
  ChartCard,
} from '@koda-finance/summitswap-uikit'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import React, { useState } from 'react'
import { usePoolChartData, usePoolDatas, usePoolTransactions } from 'state/info/hooks'
import styled from 'styled-components'
import { getBscScanLink } from 'utils'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/CurrencyLogoByAddress'
import TransactionTable from 'components/InfoTables/TransactionsTable'
import { formatAmount } from 'utils/formatInfoNumbers'
import { useActiveWeb3React } from 'hooks'
import InfoPageLayout from '../index'

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-gap: 1em;
  margin-top: 16px;
  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
`

const TokenButton = styled(Flex)`
  padding: 8px 0px;
  margin-right: 16px;
  :hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const LockedTokensContainer = styled(Flex)`
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  border-radius: 16px;
  max-width: 280px;
`

export default function PoolPage({
  match: {
    params: { address: routeAddress },
  },
}) {
  const { chainId } = useActiveWeb3React()
  const { isXs, isSm } = useMatchBreakpoints()
  const { t } = useTranslation()
  const [showWeeklyData, setShowWeeklyData] = useState(0)

  // In case somebody pastes checksummed address into url (since GraphQL expects lowercase address)
  const address = routeAddress.toLowerCase()

  const poolData = usePoolDatas([address])[0]
  const chartData = usePoolChartData(address)
  const transactions = usePoolTransactions(address)

  return (
    <InfoPageLayout>
      {poolData ? (
        <>
          <Flex justifyContent="space-between" mb="16px" flexDirection={['column', 'column', 'row']}>
            <Breadcrumbs mb="32px">
              <Link to="/info">
                <Text color="primary">{t('Info')}</Text>
              </Link>
              <Link to="/info/pools">
                <Text color="primary">{t('Pools')}</Text>
              </Link>
              <Flex>
                <Text mr="8px">{`${poolData.token0.symbol} / ${poolData.token1.symbol}`}</Text>
              </Flex>
            </Breadcrumbs>
            <Flex justifyContent={[null, null, 'flex-end']} mt={['8px', '8px', 0]}>
              {chainId && (
                <LinkExternal mr="8px" href={getBscScanLink(chainId, address, 'address')}>
                  {t('View on BscScan')}
                </LinkExternal>
              )}
            </Flex>
          </Flex>
          <Flex flexDirection="column">
            <Flex alignItems="center" mb={['8px', null]}>
              <DoubleCurrencyLogo address0={poolData.token0.address} address1={poolData.token1.address} size={32} />
              <Text
                ml="38px"
                bold
                fontSize={isXs || isSm ? '24px' : '40px'}
                id="info-pool-pair-title"
              >{`${poolData.token0.symbol} / ${poolData.token1.symbol}`}</Text>
            </Flex>
            <Flex justifyContent="space-between" flexDirection={['column', 'column', 'column', 'row']}>
              <Flex flexDirection={['column', 'column', 'row']} mb={['8px', '8px', null]}>
                <Link to={`/info/token/${poolData.token0.address}`}>
                  <TokenButton>
                    <CurrencyLogo address={poolData.token0.address} size="24px" />
                    <Text fontSize="16px" ml="4px" style={{ whiteSpace: 'nowrap' }}>
                      {`1 ${poolData.token0.symbol} =  ${formatAmount(poolData.token1Price, {
                        notation: 'standard',
                        displayThreshold: 0.001,
                        tokenPrecision: true,
                      })} ${poolData.token1.symbol}`}
                    </Text>
                  </TokenButton>
                </Link>
                <Link to={`/info/token/${poolData.token1.address}`}>
                  <TokenButton ml={[null, null, '10px']}>
                    <CurrencyLogo address={poolData.token1.address} size="24px" />
                    <Text fontSize="16px" ml="4px" style={{ whiteSpace: 'nowrap' }}>
                      {`1 ${poolData.token1.symbol} =  ${formatAmount(poolData.token0Price, {
                        notation: 'standard',
                        displayThreshold: 0.001,
                        tokenPrecision: true,
                      })} ${poolData.token0.symbol}`}
                    </Text>
                  </TokenButton>
                </Link>
              </Flex>
              <Flex>
                <Link to={`/add/${poolData.token0.address}/${poolData.token1.address}`}>
                  <Button mr="8px" variant="primary">
                    {t('Add Liquidity')}
                  </Button>
                </Link>
                <Link to={`/swap?inputCurrency=${poolData.token0.address}&outputCurrency=${poolData.token1.address}`}>
                  <Button>{t('Trade')}</Button>
                </Link>
              </Flex>
            </Flex>
          </Flex>
          <ContentLayout>
            <Box>
              <Card>
                <Box p="24px">
                  <Flex justifyContent="space-between">
                    <Flex flex="1" flexDirection="column">
                      <Text color="primary" bold fontSize="12px" textTransform="uppercase">
                        {t('Liquidity')}
                      </Text>
                      <Text fontSize="24px" bold>
                        ${formatAmount(poolData.liquidityUSD)}
                      </Text>
                      <Percent value={poolData.liquidityUSDChange} />
                    </Flex>
                    <Flex flex="1" flexDirection="column">
                      <Text color="primary" bold fontSize="12px" textTransform="uppercase">
                        {t('LP reward APR')}
                      </Text>
                      <Text fontSize="24px" bold>
                        {formatAmount(poolData.lpApr7d)}%
                      </Text>
                      <Flex alignItems="center">
                        <span>
                          <HelpIcon color="textSubtle" />
                        </span>
                        <Text ml="4px" fontSize="12px" color="textSubtle">
                          {t('7D performance')}
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                  <Text color="primary" bold mt="24px" fontSize="12px" textTransform="uppercase">
                    {t('Total Tokens Locked')}
                  </Text>
                  <LockedTokensContainer>
                    <Flex justifyContent="space-between">
                      <Flex>
                        <CurrencyLogo address={poolData.token0.address} size="24px" />
                        <Text small color="textSubtle" ml="8px">
                          {poolData.token0.symbol}
                        </Text>
                      </Flex>
                      <Text small>{formatAmount(poolData.liquidityToken0)}</Text>
                    </Flex>
                    <Flex justifyContent="space-between">
                      <Flex>
                        <CurrencyLogo address={poolData.token1.address} size="24px" />
                        <Text small color="textSubtle" ml="8px">
                          {poolData.token1.symbol}
                        </Text>
                      </Flex>
                      <Text small>{formatAmount(poolData.liquidityToken1)}</Text>
                    </Flex>
                  </LockedTokensContainer>
                </Box>
              </Card>
              <Card mt="16px">
                <Flex flexDirection="column" p="24px">
                  <ButtonMenu
                    activeIndex={showWeeklyData}
                    onItemClick={(index) => setShowWeeklyData(index)}
                    scale="sm"
                    variant="primary"
                  >
                    <ButtonMenuItem width="100%" color="primary">
                      {t('24H')}
                    </ButtonMenuItem>
                    <ButtonMenuItem width="100%">
                      {t('7D')}
                    </ButtonMenuItem>
                  </ButtonMenu>
                  <Flex mt="24px">
                    <Flex flex="1" flexDirection="column">
                      <Text color="primary" fontSize="12px" bold textTransform="uppercase">
                        {showWeeklyData ? t('Volume 7D') : t('Volume 24H')}
                      </Text>
                      <Text fontSize="24px" bold>
                        ${showWeeklyData ? formatAmount(poolData.volumeUSDWeek) : formatAmount(poolData.volumeUSD)}
                      </Text>
                      <Percent value={showWeeklyData ? poolData.volumeUSDChangeWeek : poolData.volumeUSDChange} />
                    </Flex>
                    <Flex flex="1" flexDirection="column">
                      <Text color="primary" fontSize="12px" bold textTransform="uppercase">
                        {showWeeklyData ? t('LP reward fees 7D') : t('LP reward fees 24H')}
                      </Text>
                      <Text fontSize="24px" bold>
                        ${showWeeklyData ? formatAmount(poolData.lpFees7d) : formatAmount(poolData.lpFees24h)}
                      </Text>
                      <Text color="textSubtle" fontSize="12px">
                        {/* eslint-disable-next-line */}
                        {t('out of ${{ totalFees }} total fees', {
                          totalFees: showWeeklyData
                          ? formatAmount(poolData.totalFees7d)
                          : formatAmount(poolData.totalFees24h),
                        })}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Card>
            </Box>
            <ChartCard variant="pool" chartData={chartData ?? []} />
          </ContentLayout>
          <Heading mb="16px" mt="40px" size="lg">
            {t('Transactions')}
          </Heading>
          <TransactionTable transactions={transactions ?? []} />
        </>
      ) : (
        <Flex mt="80px" justifyContent="center">
          <Spinner />
        </Flex>
      )}
    </InfoPageLayout>
  )
}
