import {
  AutoRenewIcon,
  Box,
  Button,
  CheckmarkCircleIcon,
  Flex,
  Heading,
  InjectedModalProps,
  lightColors,
  Modal,
  Text,
} from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'
import { formatUnits, parseEther } from 'ethers/lib/utils'
import { FormikProps, FormikValues, useFormik } from 'formik'
import { useWhitelabelFactoryContract, useWhitelabelNftContract } from 'hooks/useContract'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { UseQueryResult } from 'react-query'
import styled from 'styled-components'
import { WhitelabelNftCollectionGql } from 'types/whitelabelNft'
import Decorator from '../shared/Decorator'

const Wrapper = styled(Box)`
  max-width: 420px;
`

const StyledText = styled(Text)`
  display: inline-block;
  font-size: 14px;
  max-width: 340px;

  @media (max-width: 576px) {
    font-size: 12px;
  }
`

type Props = InjectedModalProps & {
  whitelabelNftId: string
  whitelabelNft: UseQueryResult<WhitelabelNftCollectionGql | undefined>
  collectedFunds: string
}

const WithdrawModal: React.FC<Props> = ({ whitelabelNftId, whitelabelNft, collectedFunds, onDismiss }) => {
  const { account } = useWeb3React()
  const [isWithdrew, setIsWithdrew] = useState(false)
  const [withdrawFee, setWithdrawFee] = useState(0)
  const whitelabelNftContract = useWhitelabelNftContract(whitelabelNftId)
  const whitelabelNftFactoryContract = useWhitelabelFactoryContract()

  const getWithdrawFee = useCallback(async () => {
    if (!whitelabelNftFactoryContract) return
    const _withdrawFee = (await whitelabelNftFactoryContract?.serviceFee()) as BigNumber
    setWithdrawFee(_withdrawFee.toNumber())
  }, [whitelabelNftFactoryContract])

  const totalFundsGained = useMemo(() => {
    const funds = parseEther(collectedFunds).sub(withdrawFee)
    return funds
  }, [collectedFunds, withdrawFee])

  useEffect(() => {
    getWithdrawFee()
  }, [getWithdrawFee])

  const formik: FormikProps<FormikValues> = useFormik({
    initialValues: {},
    onSubmit: async (values, { setSubmitting }) => {
      if (!account || !whitelabelNftContract) return

      const tx = await whitelabelNftContract.withdraw(account)
      await tx.wait()

      setSubmitting(false)
      setIsWithdrew(true)
    },
  })

  return (
    <Wrapper>
      <Modal title="" onDismiss={onDismiss} hideSeparator>
        <Flex flexDirection="column" marginTop="-64px">
          <Heading color="primary" size="lg" marginBottom="8px">
            Withdraw Mint Fund
          </Heading>
          {isWithdrew ? (
            <>
              <Flex flexDirection="column" justifyContent="center" alignItems="center">
                <CheckmarkCircleIcon width={96} />
                <StyledText marginBottom="16px">Funds Withdrawn</StyledText>
              </Flex>
              <Button onClick={onDismiss}>Close</Button>
            </>
          ) : (
            <>
              <StyledText marginBottom="16px">
                You are about to withdraw mint fund for{' '}
                <StyledText color="linkColor" fontWeight={700}>
                  {whitelabelNft.data?.name}
                </StyledText>{' '}
                NFT collection.
              </StyledText>
              <Decorator marginBottom="16px" />
              <Grid container rowGap="4px" marginBottom="24px">
                <Grid item container>
                  <Grid item xs={5} lg={6}>
                    <StyledText color="textDisabled">NFT Collection Name</StyledText>
                  </Grid>
                  <Grid item xs={7} lg={6}>
                    <StyledText>{whitelabelNft.data?.name}</StyledText>
                  </Grid>
                </Grid>
                <Grid item container>
                  <Grid item xs={5} lg={6}>
                    <StyledText color="textDisabled">Funds Collected</StyledText>
                  </Grid>
                  <Grid item xs={7} lg={6}>
                    <StyledText>{collectedFunds} ETH</StyledText>
                  </Grid>
                </Grid>
                <Grid item container>
                  <Grid item xs={5} lg={6}>
                    <StyledText color="failure">Withdraw Fee</StyledText>
                  </Grid>
                  <Grid item xs={7} lg={6}>
                    <StyledText color="failure">{formatUnits(withdrawFee, 18)} ETH</StyledText>
                  </Grid>
                </Grid>
                <Box width="100%" marginY="4px" borderBottom={`1px solid ${lightColors.inputColor}`} />
                <Grid item container>
                  <Grid item xs={5} lg={6}>
                    <StyledText color="primary" fontWeight={700}>
                      Total Funds Gained
                    </StyledText>
                  </Grid>
                  <Grid item xs={7} lg={6}>
                    <StyledText color="primary">{formatUnits(totalFundsGained, 18)} ETH</StyledText>
                  </Grid>
                </Grid>
              </Grid>
              <Button onClick={formik.submitForm} isLoading={formik.isSubmitting}>
                {formik.isSubmitting ? <AutoRenewIcon spin color="default" /> : 'Withdraw Fund'}
              </Button>
            </>
          )}
        </Flex>
      </Modal>
    </Wrapper>
  )
}

export default React.memo(WithdrawModal)
