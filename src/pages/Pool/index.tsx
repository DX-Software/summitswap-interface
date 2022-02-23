import React, { useMemo } from 'react'
import { Pair } from '@koda-finance/summitswap-sdk'
import { Button, CardBody, Text } from '@koda-finance/summitswap-uikit'
import { Link } from 'react-router-dom'
import CardNav from 'components/CardNav'
import Question from 'components/QuestionHelper'
import FullPositionCard from 'components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import { StyledInternalLink } from 'components/Shared'
import { LightCard } from 'components/Card'
import { RowBetween } from 'components/Row'
import { AutoColumn } from 'components/Column'
import { useActiveWeb3React } from 'hooks'
import { usePairs } from 'data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { Dots } from 'components/swap/styleds'
import TranslatedText from 'components/TranslatedText'
import { TranslateString } from 'utils/translateTextHelpers'
import PageHeader from 'components/PageHeader'
import AppBody from '../AppBody'

export default function Pool() {
  const { account } = useActiveWeb3React()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens,
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  return (
    <>
      <AppBody>
        <PageHeader
        // title={TranslateString(262, 'Liquidity')}
        // description={TranslateString(1168, 'Add liquidity to receive LP tokens')}
        />
        <CardNav activeIndex={1} />
        <AutoColumn gap="40px" justify="center" >
          <div style={{ marginTop: 16, padding: '0 19px', justifySelf: 'flex-start' }}>
            <Button id="join-pool-button" variant='primary' scale='xxs' as={Link} to="/add/ETH" style={{ borderRadius: 30, padding: '25px 40px', fontSize: '18px', fontWeight: 800 }}>
              <TranslatedText translationId={100}>{TranslateString(168, 'ADD LIQUIDITY')}</TranslatedText>
            </Button>
          </div>
          <CardBody style={{ padding: 0, width: '100%' }}>
            <AutoColumn gap="20px" style={{ width: '100%' }}>
              <RowBetween padding="0 19px">
                <Text color='sidebarColor' fontWeight='900' fontSize='18px'>
                  <TranslatedText translationId={102}>{TranslateString(107, 'Your Liquidity')}</TranslatedText>
                </Text>
                <Question
                  text={TranslateString(
                    1170,
                    'When you add liquidity, you are given pool tokens that represent your share. If you don’t see a pool you joined in this list, try importing a pool below.'
                  )}
                />
              </RowBetween>

              {!account ? (
                <LightCard padding="30px">
                  <Text color="inputColor" fontWeight='600' fontSize='16px'>
                    Connect to a wallet to view your liquidity.
                  </Text>
                </LightCard>
              ) : v2IsLoading ? (
                <LightCard padding="30px">
                  <Text color="inputColor" fontWeight='600' fontSize='16px'>
                    <Dots>Loading</Dots>
                  </Text>
                </LightCard>
              ) : allV2PairsWithLiquidity?.length > 0 ? (
                <>
                  {allV2PairsWithLiquidity.map((v2Pair) => (
                    <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                  ))}
                </>
              ) : (
                <LightCard padding="30px">
                  <Text color="inputColor" fontWeight='600' fontSize='16px'>
                    <TranslatedText translationId={104}>No liquidity found.</TranslatedText>
                  </Text>
                </LightCard>
              )}

              <div>
                <Text color='sidebarColor' fontSize="16px" style={{ padding: '0 19px' }}>
                  {TranslateString(106, "Don't see a pool you joined?")}{' '}
                  <StyledInternalLink id="import-pool-link" to="/find">
                    {TranslateString(108, 'Import it.')}
                  </StyledInternalLink>
                </Text>
                {/* <Text color='sidebarColor' fontSize="16px" style={{ marginTop: 20, padding: '0 19px' }}>
                  Or, if you staked your FLIP tokens in a farm,<br />unstake them to see them here.
                </Text> */}
              </div>
            </AutoColumn>
          </CardBody>
        </AutoColumn>
      </AppBody>
    </>
  )
}
