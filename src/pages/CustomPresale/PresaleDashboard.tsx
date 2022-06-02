import React from 'react'
import { BigNumber } from 'ethers'
import { Text } from '@koda-finance/summitswap-uikit'
import { Card } from './components'
import { RowBetween } from '../../components/Row'
import { PresaleInfo, FEE_DECIMALS } from './types'

interface Props {
  presaleInfo: PresaleInfo | undefined
  presaleAddress: string
  whitelistAddresses: string[]
  formatUnits: (amount: BigNumber | undefined, decimals: number) => string
}

export default function PresaleDashboard({ presaleInfo, presaleAddress, whitelistAddresses, formatUnits }: Props) {
  return (
    <Card>
      <RowBetween>
        <Text bold>Presale</Text>
        <Text>{presaleAddress}</Text>
      </RowBetween>
      <RowBetween>
        <Text bold>Token</Text>
        <Text>{presaleInfo?.presaleToken}</Text>
      </RowBetween>
      <RowBetween>
        <Text bold>Tokens For Presale</Text>
        <Text>{presaleInfo ? formatUnits(presaleInfo.presaleRate.mul(presaleInfo.hardcap), 36) : ''}</Text>
      </RowBetween>
      <RowBetween>
        <Text bold>Tokens For Liquidity</Text>
        <Text>
          {presaleInfo &&
            formatUnits(presaleInfo.liquidity.mul(presaleInfo.hardcap).mul(presaleInfo.listingRate), 36 + FEE_DECIMALS)}
        </Text>
      </RowBetween>
      <RowBetween>
        <Text bold>Presale Rate</Text>
        <Text>{formatUnits(presaleInfo?.presaleRate, 18)}</Text>
      </RowBetween>
      <RowBetween>
        <Text bold>Listing Rate</Text>
        <Text>{formatUnits(presaleInfo?.listingRate, 18)}</Text>
      </RowBetween>
      <RowBetween>
        <Text bold>Softcap </Text>
        <Text>{formatUnits(presaleInfo?.softcap, 18)}</Text>
      </RowBetween>
      <RowBetween>
        <Text bold>Hardcap </Text>
        <Text>{formatUnits(presaleInfo?.hardcap, 18)}</Text>
      </RowBetween>
      <RowBetween>
        <Text bold>Presale Start Time </Text>
        <Text>{presaleInfo ? new Date(presaleInfo.startPresaleTime.mul(1000).toNumber()).toUTCString() : ''}</Text>
      </RowBetween>
      <RowBetween>
        <Text bold>Presale End Time </Text>
        <Text>{presaleInfo ? new Date(presaleInfo.endPresaleTime.mul(1000).toNumber()).toUTCString() : ''}</Text>
      </RowBetween>
      {presaleInfo?.isWhitelistEnabled && whitelistAddresses && (
        <>
          <Text>Whitelist Addresses:</Text>
          {whitelistAddresses.map((add) => (
            <Text>{add}</Text>
          ))}
        </>
      )}
    </Card>
  )
}
