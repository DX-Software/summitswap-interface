import React, { useState, useEffect } from 'react'
import { Token } from '@koda-finance/summitswap-sdk'
import { Text, Box } from '@koda-finance/summitswap-uikit'
import { Contract } from 'ethers'
import LinkBox from 'components/LinkBox'
import CopyButton from 'components/CopyButton'

interface Props {
  referalContract: Contract | null
  account: string | null | undefined
  selectedToken: Token | undefined
  isCopySupported: boolean
}

export default function TokenReferrer({ referalContract, account, selectedToken, isCopySupported }: Props) {
  const [referrer, setReferrer] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReferrers() {
      if (!referalContract || !account || !selectedToken) {
        return
      }
      const isReferrer = await referalContract.referrers(selectedToken.address, account)
      const isEmptyAddress = /^0x0+$/.test(isReferrer)
      setReferrer(isEmptyAddress ? null : isReferrer)
    }
    fetchReferrers()
  }, [referalContract, account, selectedToken])

  return referrer ? (
    <>
      <Text mb="8px" bold>
        Who invited me
      </Text>
      <LinkBox>
        <Box>
          <Text style={{ whiteSpace: isCopySupported ? 'nowrap' : 'normal' }}>{referrer}</Text>
        </Box>
        <Box style={{ display: isCopySupported ? 'block' : 'none' }}>
          <CopyButton
            color="#fff"
            text={referrer}
            tooltipMessage="Copied"
            tooltipTop={-40}
            tooltipRight={-25}
            width="24px"
          />
        </Box>
      </LinkBox>
    </>
  ) : (
    <></>
  )
}