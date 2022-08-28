import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { format, addMinutes } from 'date-fns'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { usePresaleContract } from 'hooks/useContract'
import { useToken } from 'hooks/Tokens'
import { TOKEN_CHOICES } from 'constants/presale'
import { NULL_ADDRESS } from 'constants/index'
import { fetchPresaleInfo, fetchFeeInfo, fetchProjectDetails } from 'utils/presale'
import { PresaleInfo, FeeInfo, ProjectDetails } from '../types'
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
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>()
  const [presaleFeeInfo, setPresaleFeeInfo] = useState<FeeInfo>()
  const [currency, setCurrency] = useState('BNB')

  const presaleContract = usePresaleContract(presaleAddress)
  const paymentToken = useToken(
    presaleFeeInfo?.paymentToken !== NULL_ADDRESS ? presaleFeeInfo?.paymentToken : undefined
  )

  useEffect(() => {
    async function fetchData() {
      const preInfo = await fetchPresaleInfo(presaleContract)
      const feeInfo = await fetchFeeInfo(presaleContract)
      const projDetails = await fetchProjectDetails(presaleContract)

      setPresaleInfo({ ...preInfo })
      setPresaleFeeInfo({ ...feeInfo })
      setProjectDetails({ ...projDetails })
    }
    if (presaleContract) {
      fetchData()
    }
  }, [presaleContract])

  const formatDate = useCallback((date: BigNumber) => {
    const date_ = new Date(date.mul(1000).toNumber())
    return format(addMinutes(date_, date_.getTimezoneOffset()), "yyyy.MM.dd HH:mm ('UTC')")
  }, [])

  useEffect(() => {
    if (presaleFeeInfo) {
      const currentCurrency = Object.keys(TOKEN_CHOICES).find(
        (key) => TOKEN_CHOICES[key] === presaleFeeInfo?.paymentToken
      )
      setCurrency(currentCurrency as string)
    }
  }, [presaleFeeInfo])

  return (
    <ResponsiveGrid>
      <StyledText>{projectDetails?.projectName}</StyledText>
      <StyledText>{currency}</StyledText>
      <StyledText>{formatUnits(presaleInfo?.presaleRate || 0)}</StyledText>
      <StyledText>
        {formatUnits(presaleInfo?.softcap || 0, paymentToken?.decimals)} /{' '}
        {formatUnits(presaleInfo?.hardcap || 0, paymentToken?.decimals)}
      </StyledText>
      <StyledText>{presaleInfo?.refundType ? 'Burn' : 'Refund'}</StyledText>
      <StyledText>{presaleInfo?.startPresaleTime ? formatDate(presaleInfo.startPresaleTime) : ''}</StyledText>
      {presaleInfo?.isApproved ? (
        <StyledText color="primary">Approved</StyledText>
      ) : (
        <StyledText color="info">Need Approval</StyledText>
      )}
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
