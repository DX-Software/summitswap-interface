import {
  AutoRenewIcon,
  Box,
  Button,
  EtherIcon,
  Flex,
  Heading,
  InjectedModalProps,
  lightColors,
  Modal,
  Text
} from '@koda-finance/summitswap-uikit'
import { Grid, useMediaQuery } from '@mui/material'
import { BigNumber, BigNumberish } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { FormikProps } from 'formik'
import React from 'react'
import { UseQueryResult } from 'react-query'
import styled from 'styled-components'
import { WhitelabelMintDto, WhitelabelNftGql } from 'types/whitelabelNft'
import { HelperText } from '../shared/Text'

const Decorator = styled(Box)`
  width: 96px;
  height: 7px;
  background: ${({ theme }) => theme.colors.primary};

  @media (max-width: 576px) {
    width: 64px;
  }
`

interface MintSummaryModalProps extends InjectedModalProps {
  whitelabelNft: UseQueryResult<WhitelabelNftGql | undefined>
  mintPrice: BigNumberish
  formik: FormikProps<WhitelabelMintDto>
}

const MintSummaryModal: React.FC<MintSummaryModalProps> = ({ whitelabelNft, mintPrice, formik, onDismiss }) => {
  const isMobileView = useMediaQuery('(max-width: 576px)')

  return (
    <Box>
      <Modal title="" onDismiss={onDismiss} hideSeparator>
        <Flex flexDirection="column" marginTop="-72px">
          <Heading size="lg" color="primary" marginBottom="8px">
            Mint NFT
          </Heading>
          <HelperText color="text" marginBottom="16px">
            You are about to mint NFT from{' '}
            <HelperText bold color="primary" style={{ display: 'inline-block' }}>
              {whitelabelNft.data?.name}
            </HelperText>{' '}
            collection
          </HelperText>
          <Decorator marginBottom={isMobileView ? '24px' : '16px'} />
          <Grid container spacing="4px" marginBottom="8px">
            <Grid item container>
              <Grid item xs={8}>
                <Text fontSize="14px">Mint Price (per NFT)</Text>
              </Grid>
              <Grid item xs={4}>
                <Text fontSize="14px">{formatUnits(mintPrice, 18)} ETH</Text>
              </Grid>
            </Grid>
            <Grid item container>
              <Grid item xs={8}>
                <Text fontSize="14px">Mint Quantity</Text>
              </Grid>
              <Grid item xs={4}>
                <Text fontSize="14px">{formik.values.mintQuantity}</Text>
              </Grid>
            </Grid>
          </Grid>
          <Box borderBottom={`1px solid ${lightColors.inputColor}`} marginBottom="8px" />
          <Grid container spacing="4px" marginBottom="16px">
            <Grid item xs={12} lg={8}>
              <Text bold color="primary" fontSize="14px">
                Total Mint
              </Text>
            </Grid>
            <Grid item xs={12} lg={4} display="flex" flexDirection="row">
              <EtherIcon color="primary" marginLeft="-8px" />
              <Text bold color="primary" fontSize="14px">
                {formatUnits(BigNumber.from(mintPrice).mul(formik.values.mintQuantity), 18)} ETH
              </Text>
            </Grid>
          </Grid>
          <Button
            variant="primary"
            onClick={formik.submitForm}
            isLoading={formik.isSubmitting}
            startIcon={formik.isSubmitting && <AutoRenewIcon color="white" spin />}
          >
            Mint NFT Collection
          </Button>
        </Flex>
      </Modal>
    </Box>
  )
}

export default MintSummaryModal
