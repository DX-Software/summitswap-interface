import React, { useEffect, useState } from 'react'
import { Token } from '@koda-finance/summitswap-sdk'
import { Text, Box } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'
import CurrencyLogo from 'components/CurrencyLogo'
import { RowBetween, RowFixed, AutoRow } from 'components/Row'
import { Contract } from 'ethers'

const LinkBox = styled(Box)`
  color: ${({ theme }) => theme.colors.invertedContrast};
  padding: 16px;
  border-radius: 16px;
  background: #011724;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
`

const ReferrerText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
`
const BorderBox = styled(Box)`
  width: 95%;
  margin: 10px auto;
  opacity: 0.1;
  margin-bottom: 0;
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
      <RowBetween mt="30px" mb="30px">
        <h2 className="float-title">Who invited me</h2>
      </RowBetween>
      <LinkBox>
        {referrers.map((ref, i) => (
          <>
            <AutoRow mx="10px" mt="10px">
              <RowFixed>
                <CurrencyLogo currency={ref?.token} size="20px" style={{ marginRight: '8px' }} />
                <ReferrerText>
                  {ref?.token?.symbol} - {ref?.token?.address}
                </ReferrerText>
              </RowFixed>
              <RowFixed>
                <ReferrerText>Referrer - {ref?.referrer}</ReferrerText>
              </RowFixed>
              <BorderBox borderBottom={referrers.length !== i + 1 ? '1px solid white;' : 'none;'} />
            </AutoRow>
          </>
        ))}
      </LinkBox>
    </>
  ) : (
    <></>
  )
}