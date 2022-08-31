import React from 'react'
import styled from 'styled-components'
import { CSVLink } from 'react-csv'
import CopyButton from 'components/CopyButton'
import { Box, Button, Flex, Modal, FileIcon } from '@koda-finance/summitswap-uikit'
import { StyledText, Divider } from './Shared'

const AddressWrapper = styled(Box)`
  overflow: hidden;
  width: 370px;
  margin-right: 8px;
  word-break: break-all;
`

const ViewAddressesModal = ({ headers, data, title, onDismiss, addresses, isContributorsModal = false }) => {
  return (
    <Modal onDismiss={onDismiss} bodyPadding="0 30px" hideSeparator title={title}>
      <Box marginBottom="20px" maxWidth="500px">
        <Flex marginBottom="8px">
          <StyledText color="textDisabled" style={{ width: '40px' }}>
            No.
          </StyledText>
          <StyledText color="textDisabled">Address</StyledText>
        </Flex>
        <Divider />
        <Box marginTop="8px" marginBottom="24px" height="290px" maxHeight="290px" overflowY="auto">
          {addresses.map((address: string, index: number) => (
            <Flex marginBottom="8px" key={address}>
              <StyledText fontSize="14px" style={{ width: '40px', flexShrink: 0 }}>
                {index < 9 ? `0${index + 1}` : index + 1}
              </StyledText>
              <AddressWrapper>
                <StyledText fontSize="14px">{address}</StyledText>
              </AddressWrapper>
              <Box marginRight="16px" style={{ position: 'relative' }}>
                <CopyButton
                  color="linkColor"
                  text={address}
                  tooltipMessage="Copied"
                  tooltipTop={20}
                  tooltipRight={-30}
                  width="15px"
                />
              </Box>
            </Flex>
          ))}
        </Box>
        <Divider />
        <StyledText marginY="8px" color="textDisabled">
          Total of{' '}
          <StyledText fontWeight={700} style={{ display: 'inline' }} color="success">
            {addresses.length}{' '}
          </StyledText>
          {isContributorsModal ? 'contributors' : 'whitelist addresses'}
        </StyledText>
        <Divider />
        <Button
          width="100%"
          marginTop="24px"
          startIcon={<FileIcon color="currentColor" />}
          variant="tertiary"
          as={CSVLink}
          data={data}
          headers={headers}
          filename={`${isContributorsModal ? 'contributors' : 'whitelist'}.csv`}
        >
          Download CSV
        </Button>
      </Box>
    </Modal>
  )
}

export default ViewAddressesModal
