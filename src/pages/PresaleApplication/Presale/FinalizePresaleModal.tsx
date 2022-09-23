import React, { useMemo } from 'react'
import styled from 'styled-components'
import { formatUnits } from 'ethers/lib/utils'
import { FEE_DECIMALS } from 'constants/presale'
import { Box, Button, Flex, Modal } from '@koda-finance/summitswap-uikit'
import { StyledText, Divider as SDivider } from './Shared'

const Divider = styled.div`
  height: 7px;
  width: 96px;
  background: ${({ theme }) => theme.colors.primaryDark};
  margin: 16px 0;
`

const FinalizePresaleModal = ({
  onDismiss,
  presaleInfo,
  currency,
  projectName,
  presaleToken,
  presaleAddress,
  presaleFeeInfo,
  presaleFinalizeHandler,
}) => {
  const feePresaleToken: string = useMemo(() => {
    if (presaleInfo && presaleFeeInfo) {
      return presaleInfo.totalBought
        .mul(presaleFeeInfo.feePresaleToken)
        .div(10 ** FEE_DECIMALS)
        .mul(presaleInfo.presaleRate)
    }
    return ''
  }, [presaleInfo, presaleFeeInfo])

  const feeBnbToken: string = useMemo(() => {
    if (presaleInfo && presaleFeeInfo) {
      return presaleInfo.totalBought.mul(presaleFeeInfo.feePaymentToken).div(10 ** FEE_DECIMALS)
    }
    return ''
  }, [presaleInfo, presaleFeeInfo])

  return (
    <Modal onDismiss={onDismiss} bodyPadding="0 30px" hideSeparator title="Finalize Presale">
      <Box marginBottom="20px" maxWidth="500px">
        <StyledText>
          You are about to finalize
          <StyledText fontWeight={700} style={{ display: 'inline' }}>
            &nbsp;{projectName}&nbsp;
          </StyledText>
          presale. You will be charged some fees to finalize this presale
        </StyledText>
        <Divider />
        <StyledText fontWeight={700}>{projectName}</StyledText>
        <Flex marginTop="8px">
          <StyledText fontSize="14px" style={{ width: '170px' }}>
            Presale Address
          </StyledText>
          <StyledText fontSize="14px">
            {`${presaleAddress.substr(0, 10)}...${presaleAddress.substr(
              presaleAddress.length - 9,
              presaleAddress.length
            )}`}
          </StyledText>
        </Flex>
        <Flex marginTop="4px">
          <StyledText fontSize="14px" style={{ width: '170px' }}>
            Presale Token
          </StyledText>
          <StyledText fontSize="14px">{`${presaleToken?.name} (${presaleToken?.symbol})`}</StyledText>
        </Flex>
        <Flex marginTop="4px">
          <StyledText fontSize="14px" style={{ width: '170px' }}>
            Funds Collected
          </StyledText>
          <StyledText fontSize="14px">
            {`${formatUnits(presaleInfo?.totalBought, presaleToken?.decimals)}  ${currency} / ${formatUnits(
              presaleInfo?.hardcap,
              presaleToken?.decimals
            )}  ${currency}`}
          </StyledText>
        </Flex>
        <Flex marginTop="4px">
          <StyledText fontSize="14px" color="failure" style={{ width: '170px' }}>
            Payment Token Fee
          </StyledText>
          <StyledText color="failure" fontSize="14px">
            {`${formatUnits(feeBnbToken, presaleToken?.decimals)}  ${currency}`}
          </StyledText>
        </Flex>
        <Flex marginTop="4px" marginBottom="8px">
          <StyledText fontSize="14px" color="failure" style={{ width: '170px' }}>
            Presale Token Fee
          </StyledText>
          <StyledText color="failure" fontSize="14px">
            {`${formatUnits(feePresaleToken, (presaleToken?.decimals || 18) + 18)}  ${presaleToken?.symbol}`}
          </StyledText>
        </Flex>
        <SDivider />
        <Flex marginTop="4px" marginBottom="16px">
          <StyledText color="primary" fontWeight={700} style={{ width: '170px' }}>
            Total Funds Raised
          </StyledText>
          <StyledText color="primary" fontWeight={700}>
            {`${formatUnits(presaleInfo?.totalBought.sub(feeBnbToken), presaleToken?.decimals)}  ${currency}`}
          </StyledText>
        </Flex>
        <Button onClick={presaleFinalizeHandler} width="100%">
          Finalize Presale
        </Button>
        <Flex justifyContent="center">
          <StyledText fontSize="12px" color="warning" marginTop="8px">
            To Finalize presale, you have to exclude token transfer fee for presale contract.
          </StyledText>
        </Flex>
      </Box>
    </Modal>
  )
}

export default FinalizePresaleModal
