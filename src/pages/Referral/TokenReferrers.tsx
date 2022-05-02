import React, { useEffect, useState } from 'react'
import { Token } from '@koda-finance/summitswap-sdk'
import { Text } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'
import CurrencyLogo from 'components/CurrencyLogo'
import { RowBetween, RowFixed, AutoRow } from 'components/Row'
import { Contract } from 'ethers'

const ReferrerText = styled(Text)`
  font-size: 14px;
  @media (max-width: 1230px) {
    font-size: 10px;
  }
  @media (max-width: 730px) {
    font-size: 8px;
  }
  @media (max-width: 560px) {
    font-size: 6px;
  }
  @media (max-width: 440px) {
    font-size: 7px;
  }
`

const Row = styled(AutoRow)`
  justify-content: space-between;
  @media (max-width: 440px) {
    justify-content: center;
  }
`

interface Props {
  referalContract: Contract | null
  account: string | null | undefined
  tokens: Array<Token>
}

export default function TokenReferrers({ referalContract, account, tokens }: Props) {
  const [referrers, setReferrers] = useState<({ token: Token; referrer: string } | null)[]>([])

  useEffect(() => {
    async function fetchReferrers() {
      if (!referalContract || !account || !tokens) {
        return
      }
      setReferrers(
        (
          await Promise.all(
            tokens.map(async (token) => {
              const referrer = await referalContract.referrers(token.address, account)
              const isEmptyAddress = /^0x0+$/.test(referrer)
              return !isEmptyAddress ? { token, referrer } : null
            })
          )
        ).filter((ref) => ref)
      )
    }
    fetchReferrers()
  }, [referalContract, account, tokens])

  return referrers.length ? (
    <>
      <RowBetween mb="8px">
        <Text bold>Coins</Text>
        <Text bold>Referrers</Text>
      </RowBetween>
      {referrers.map((ref) => (
        <>
          <Row mb="10px">
            <RowFixed>
              <CurrencyLogo currency={ref?.token} size="15px" style={{ marginRight: '8px' }} />
              <ReferrerText>{`${ref?.token?.symbol} - ${ref?.token?.address}`}</ReferrerText>
            </RowFixed>
            <RowFixed>
              <ReferrerText>{ref?.referrer}</ReferrerText>
            </RowFixed>
          </Row>
        </>
      ))}
    </>
  ) : (
    <></>
  )
}
