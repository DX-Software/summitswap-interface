import { Box, lightColors, Text, useModal } from '@koda-finance/summitswap-uikit'
import React from 'react'
import styled from 'styled-components'
import MetadataValidationModal from './MetadataValidationModal'

const Wrapper = styled(Box)<{ isSuccess?: boolean }>`
  background-color: ${({ isSuccess }) => (isSuccess ? '#126954' : '#935211')};
  padding: 12px 16px;
  border-radius: 5px;

  @media (max-width: 576px) {
    padding: 8px 16px;
  }
`

const ValidationMessage = styled(Text)<{ isSuccess?: boolean }>`
  color: ${({ isSuccess }) => (isSuccess ? lightColors.success : lightColors.warning)};

  @media (max-width: 576px) {
    font-size: 14px;
  }
`

const ViewDetail = styled.div`
  cursor: pointer;
  display: inline-block;
  text-decoration: underline;
`

type Props = {
  isSuccess?: boolean
  errors?: string[]
  children: React.ReactNode
}

function ValidationMessageAlert({ isSuccess, errors, children }: Props) {
  const [onPresent] = useModal(<MetadataValidationModal title="Error Validation Review" errors={errors} />)

  return (
    <Wrapper isSuccess={isSuccess} marginTop="24px">
      <ValidationMessage isSuccess={isSuccess}>
        {children} {isSuccess ? '' : <ViewDetail onClick={onPresent}>View Details</ViewDetail>}
      </ValidationMessage>
    </Wrapper>
  )
}

ValidationMessageAlert.defaultProps = {
  isSuccess: false,
}

export default ValidationMessageAlert
