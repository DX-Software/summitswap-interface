import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { format, addMinutes } from 'date-fns'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { Box } from '@koda-finance/summitswap-uikit'
import { usePresaleContract } from 'hooks/useContract'
import { useToken } from 'hooks/Tokens'
import { fetchPresaleInfo } from 'utils/presale'
import { PresaleInfo } from '../types'
import { Grid, StyledText } from './HeadingContainer'

interface Props {
  presaleAddress: string
  selectPresaleHandler: (presaleAddress: string) => void
}

const ResponsiveGrid = styled(Grid)`
  margin-top: 16px;
  margin-bottom: 8px;
  @media (max-width: 852px) {
    margin-top: 8px;
    margin-bottom: 5px;
  }
`

const PresaleDetails = ({ presaleAddress, selectPresaleHandler }: Props) => {
  const [presaleInfo, setPresaleInfo] = useState<PresaleInfo>()
  const presaleContract = usePresaleContract(presaleAddress)

  const token = useToken(presaleInfo?.presaleToken)

  useEffect(() => {
    async function fetchData() {
      const preInfo = await fetchPresaleInfo(presaleContract)
      setPresaleInfo({ ...preInfo })
    }
    if (presaleContract) {
      fetchData()
    }
  }, [presaleContract])

  const formatDate = useCallback((date: BigNumber) => {
    const date_ = new Date(date.mul(1000).toNumber())
    return format(addMinutes(date_, date_.getTimezoneOffset()), "yyyy.MM.dd HH:mm ('UTC')")
  }, [])

  return (
    <ResponsiveGrid>
      <StyledText>{token?.name}</StyledText>
      <Box />
      <StyledText>{token?.symbol}</StyledText>
      <Box />
      <StyledText>{formatUnits(presaleInfo?.presaleRate || 0)}</StyledText>
      <Box />
      <StyledText>
        {formatUnits(presaleInfo?.softcap || 0)}/{formatUnits(presaleInfo?.hardcap || 0)}
      </StyledText>
      <Box />
      <StyledText>{presaleInfo?.refundType ? 'Burn' : 'Refund'}</StyledText>
      <Box />
      <StyledText>{presaleInfo?.startPresaleTime ? formatDate(presaleInfo.startPresaleTime) : ''}</StyledText>
      <Box />
      <StyledText>{presaleInfo?.endPresaleTime ? formatDate(presaleInfo.endPresaleTime) : ''}</StyledText>
      <StyledText
        style={{ cursor: 'pointer' }}
        color="linkColor"
        textAlign="right"
        onClick={() => selectPresaleHandler(presaleAddress)}
      >
        View
      </StyledText>
    </ResponsiveGrid>
  )
}

export default PresaleDetails
