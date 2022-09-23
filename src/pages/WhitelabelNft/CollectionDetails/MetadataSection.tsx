import {
  AutoRenewIcon,
  Box,
  Button,
  Flex,
  Heading,
  lightColors,
  Select,
  Skeleton,
  Text,
  useModal,
  WalletIcon,
} from '@koda-finance/summitswap-uikit'
import { Grid, useMediaQuery } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { Phase, PHASE_OPTIONS } from 'constants/whitelabel'
import { getAddress } from 'ethers/lib/utils'
import { FormikProps, FormikProvider, FormikValues, useFormik } from 'formik'
import { useWhitelabelNftContract } from 'hooks/useContract'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { UseQueryResult } from 'react-query'
import { useETHBalances } from 'state/wallet/hooks'
import styled from 'styled-components'
import { WhitelabelNftCollectionGql, WhitelabelNftFormField, WhitelabelNftUpdatePhase } from 'types/whitelabelNft'
import { getPhaseString } from 'utils/whitelabelNft'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
import { PhaseTag } from '../shared/CustomTag'
import ImageSkeleton from '../shared/ImageSkeleton'
import NftCollectionGalleryItemImage from '../shared/NftCollectionGalleryItemImage'
import { DescriptionText, HelperText } from '../shared/Text'
import WithdrawModal from './WithdrawModal'

const ActionWrapper = styled(Flex)`
  margin-bottom: 16px;
  gap: 8px;
  flex-direction: row;

  @media (max-width: 576px) {
    flex-direction: column-reverse;
  }
`

type MetadataProps = {
  isOwner: boolean
  totalSupply: number
  whitelabelNft: UseQueryResult<WhitelabelNftCollectionGql | undefined>
}

type StatsCardProps = {
  label: string
  value?: number
}

function StatsCard({ label, value = 0 }: StatsCardProps) {
  const isMobileView = useMediaQuery('(max-width: 576px)')

  return (
    <Box padding="16px" background={lightColors.inputColor} borderRadius="4px" height="100%">
      <Heading size="lg" color={value === 0 ? 'textSubtle' : 'sidebarColor'}>
        {value}
      </Heading>
      <Text color="primary" fontSize={isMobileView ? '14px' : '16px'}>
        {label}
      </Text>
    </Box>
  )
}

function MetadataSection({ isOwner, totalSupply, whitelabelNft }: MetadataProps) {
  const isMobileView = useMediaQuery('(max-width: 576px)')
  const { account } = useWeb3React()
  const { whitelabelNftId } = useWhitelabelNftContext()
  const whitelabelNftContract = useWhitelabelNftContract(whitelabelNftId)

  const contractBalance = useETHBalances([whitelabelNftId])[getAddress(whitelabelNftId)]

  const isWithdrawButtonDisabled = useMemo(() => {
    return contractBalance?.toExact() === '0'
  }, [contractBalance])

  const formikUpdatePhase: FormikProps<WhitelabelNftUpdatePhase> = useFormik<WhitelabelNftUpdatePhase>({
    enableReinitialize: true,
    initialValues: {
      phase: whitelabelNft.data?.phase || Phase.Pause,
    },
    onSubmit: async (values, { setSubmitting }) => {
      if (!account || !whitelabelNftContract) return

      const tx = await whitelabelNftContract[`enter${getPhaseString(values.phase)}Phase`]()
      await tx.wait()

      setSubmitting(false)
    },
  })

  const handlePhaseChange = (value: string) => {
    formikUpdatePhase.setFieldValue(WhitelabelNftFormField.phase, value)
  }

  const formikReveal: FormikProps<FormikValues> = useFormik<FormikValues>({
    initialValues: {},
    onSubmit: async (values, { setSubmitting }) => {
      if (!account || !whitelabelNftContract) return

      const tx = await whitelabelNftContract.toggleIsReveal()
      await tx.wait()

      whitelabelNft.refetch()
      setSubmitting(false)
    },
  })

  const [onPresentWithdrawModal] = useModal(
    <WithdrawModal
      whitelabelNftId={whitelabelNftId}
      whitelabelNft={whitelabelNft}
      collectedFunds={contractBalance?.toSignificant(6) || '0'}
    />
  )

  if (whitelabelNft.isLoading) {
    return (
      <Grid container columnSpacing="40px" rowGap="24px">
        <Grid item xs={12} sm={5}>
          <Box marginTop="12px">
            <ImageSkeleton />
          </Box>
        </Grid>
        <Grid item xs={12} sm={7}>
          <Skeleton height="40px" marginY="8px" />
          <Skeleton width="33%" />
          <Skeleton height="100px" marginTop="16px" marginBottom="16px" />

          <Grid container spacing={isMobileView ? '8px' : '16px'}>
            <Grid item xs={6} lg={4}>
              <Skeleton height="72px" />
            </Grid>
            <Grid item xs={6} lg={4}>
              <Skeleton height="72px" />
            </Grid>
            <Grid item xs={6} lg={4}>
              <Skeleton height="72px" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container columnSpacing="40px" rowGap="24px">
      <Grid item xs={12} md={5}>
        <Box marginTop="12px">
          <NftCollectionGalleryItemImage
            src={whitelabelNft.data?.previewImageUrl || ''}
            isReveal={whitelabelNft.data?.isReveal || false}
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={7}>
        <Heading size="xl" marginBottom={isOwner ? '16px' : ''}>
          {whitelabelNft.data?.name}
        </Heading>
        {!isOwner && <PhaseTag phase={whitelabelNft.data?.phase} />}
        {isOwner && (
          <FormikProvider value={formikUpdatePhase}>
            <Box marginBottom="16px">
              <Grid container spacing="8px">
                <Grid item xs={12} lg={8}>
                  <Text color="#E2E2E2" fontSize="14px" marginBottom="4px">
                    Switch Phase
                  </Text>
                  <Select
                    options={PHASE_OPTIONS}
                    selected={formikUpdatePhase.values.phase.toString()}
                    onValueChanged={handlePhaseChange}
                    style={{ flex: 1 }}
                    marginBottom="4px"
                  />
                  <HelperText fontSize="12px">
                    Current Phase:{' '}
                    <HelperText color="primary" fontSize="12px" style={{ display: 'inline-block' }}>
                      {getPhaseString(whitelabelNft.data?.phase || 0)} Phase
                    </HelperText>
                  </HelperText>
                </Grid>
                <Grid item xs={6} lg={4} display="flex" alignItems="center">
                  <Button
                    variant="awesome"
                    scale="xs"
                    width="100%"
                    startIcon={<AutoRenewIcon color="default" spin={formikUpdatePhase.isSubmitting} />}
                    isLoading={formikUpdatePhase.isSubmitting}
                    onClick={formikUpdatePhase.submitForm}
                  >
                    Change
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </FormikProvider>
        )}
        <DescriptionText color="textSubtle" marginTop="16px">
          {whitelabelNft.data?.description}
        </DescriptionText>
        {isOwner && (
          <ActionWrapper>
            <Box>
              <Button
                variant={isWithdrawButtonDisabled ? 'awesome' : 'primary'}
                startIcon={<WalletIcon color={isWithdrawButtonDisabled ? 'textDisabled' : 'default'} />}
                marginBottom="4px"
                width="100%"
                disabled={isWithdrawButtonDisabled}
                onClick={onPresentWithdrawModal}
              >
                <b>Withdraw Fund</b>
              </Button>
              <HelperText>
                Total{' '}
                <HelperText color="linkColor" fontWeight={700} style={{ display: 'inline-block' }}>
                  {contractBalance?.toSignificant(6) || 0} ETH
                </HelperText>{' '}
                collected
              </HelperText>
            </Box>
            <Button
              variant="tertiary"
              startIcon={formikReveal.isSubmitting && <AutoRenewIcon spin color="default" />}
              isLoading={formikReveal.isSubmitting}
              disabled={whitelabelNft.data?.isReveal || false}
              onClick={formikReveal.submitForm}
            >
              <b>Reveal Collection</b>
            </Button>
          </ActionWrapper>
        )}
        <Grid container spacing={isMobileView ? '8px' : '16px'}>
          <Grid item xs={6} lg={4}>
            <StatsCard label="Items" value={whitelabelNft.data?.maxSupply?.toNumber()} />
          </Grid>
          <Grid item xs={6} lg={4}>
            <StatsCard label="Owners" value={whitelabelNft.data?.totalOwner?.toNumber()} />
          </Grid>
          <Grid item xs={6} lg={4}>
            <StatsCard label="NFT(s) minted" value={totalSupply} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default React.memo(MetadataSection)
