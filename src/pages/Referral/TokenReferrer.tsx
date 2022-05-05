import React, { useEffect, useState, useCallback } from 'react'
import { Token } from '@koda-finance/summitswap-sdk'
import { Text, Box } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'
import { Contract } from 'ethers'
import LinkBox from 'components/LinkBox'

const Tooltip = styled.div<{ isTooltipDisplayed: boolean }>`
  display: ${({ isTooltipDisplayed }) => (isTooltipDisplayed ? 'block' : 'none')};
  position: absolute;
  bottom: 36px;
  right: 0;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  background-color: ${({ theme }) => theme.colors.sidebarBackground} !important;
  color: ${({ theme }) => theme.colors.invertedContrast};
  border-radius: 16px;
  opacity: 0.7;
  width: fit-content;
  padding: 10px;
`

interface Props {
  referalContract: Contract | null
  account: string | null | undefined
  selectedToken: Token | undefined
  isCopySupported: boolean
  copyAddress: (address: string, displayCopiedTooltip: () => void) => void
}

export default function TokenReferrer({
  referalContract,
  account,
  selectedToken,
  isCopySupported,
  copyAddress,
}: Props) {
  const [referrer, setReferrer] = useState<{ token: Token; referrer: string } | null>(null)
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)

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

  const displayCopiedTooltip = useCallback(() => {
    setIsTooltipDisplayed(true)
    setTimeout(() => {
      setIsTooltipDisplayed(false)
    }, 1000)
  }, [])

  return referrer ? (
    <>
      <Text mb="8px" bold>
        Who invited me
      </Text>
      <LinkBox>
        <Box>
          <Text style={{ whiteSpace: isCopySupported ? 'nowrap' : 'normal' }}>{referrer}</Text>
        </Box>
        <Box
          style={{ display: isCopySupported ? 'block' : 'none' }}
          onClick={() => copyAddress('0x7411184d3b0308Af7c5A14550A9239Aa9db2f45B', displayCopiedTooltip)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="22" viewBox="0 0 19 22" fill="none">
            <path
              d="M13 0L2 0C0.9 0 0 0.9 0 2L0 15C0 15.55 0.45 16 1 16C1.55 16 2 15.55 2 15L2 3C2 2.45 2.45 2 3 2L13 2C13.55 2 14 1.55 14 1C14 0.45 13.55 0 13 0ZM17 4L6 4C4.9 4 4 4.9 4 6L4 20C4 21.1 4.9 22 6 22H17C18.1 22 19 21.1 19 20V6C19 4.9 18.1 4 17 4ZM16 20H7C6.45 20 6 19.55 6 19L6 7C6 6.45 6.45 6 7 6L16 6C16.55 6 17 6.45 17 7V19C17 19.55 16.55 20 16 20Z"
              fill="white"
            />
          </svg>
          <Tooltip isTooltipDisplayed={isTooltipDisplayed}>Copied</Tooltip>
        </Box>
      </LinkBox>
    </>
  ) : (
    <></>
  )
}