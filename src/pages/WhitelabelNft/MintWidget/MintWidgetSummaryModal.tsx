import {
  AutoRenewIcon,
  Box,
  EtherIcon,
  Flex,
  Heading,
  InjectedModalProps,
  lightColors,
  Modal,
  Text,
} from '@koda-finance/summitswap-uikit'
import { Grid, useMediaQuery } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { Phase } from 'constants/whitelabel'
import { BigNumber, BigNumberish } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { FormikProps, useFormik } from 'formik'
import { useWhitelabelNftContract } from 'hooks/useContract'
import React, { useMemo } from 'react'
import { UseQueryResult } from 'react-query'
import { WhitelabelMintDto, WhitelabelNftCollectionGql, WhitelabelSignatureResult } from 'types/whitelabelNft'
import { mintCollectionValidationSchema } from '../CreateCollection/validation'
import Decorator from '../shared/Decorator'
import { HelperText } from '../shared/Text'
import StyledButton from './StyledButton'

interface MintWidgetSummaryModalProps extends InjectedModalProps {
  whitelabelNft: UseQueryResult<WhitelabelNftCollectionGql | undefined>
  quantity: number
  mintPrice: BigNumberish
  whitelabelNftApiSignature: UseQueryResult<WhitelabelSignatureResult | undefined>
  setMintedMessage: React.Dispatch<React.SetStateAction<string>>
  color: string
}

const MintWidgetSummaryModal: React.FC<MintWidgetSummaryModalProps> = ({
  whitelabelNft,
  quantity,
  mintPrice,
  whitelabelNftApiSignature,
  setMintedMessage,
  onDismiss,
  color,
}) => {
  const isMobileView = useMediaQuery('(max-width: 576px)')
  const { account } = useWeb3React()
  const whitelabelNftContract = useWhitelabelNftContract(whitelabelNft.data?.id || '')

  const phase = useMemo(() => {
    return whitelabelNft.data?.phase || Phase.Pause
  }, [whitelabelNft.data?.phase])

  const formik: FormikProps<WhitelabelMintDto> = useFormik<WhitelabelMintDto>({
    enableReinitialize: true,
    initialValues: { mintQuantity: quantity },
    validationSchema: mintCollectionValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!whitelabelNftContract || !account || (!whitelabelNftApiSignature.data && phase === Phase.Whitelist)) {
        return
      }
      setSubmitting(true)

      const tokenInfo = await whitelabelNftContract.tokenInfo()
      const { phase: tokenInfoPhase, whitelistMintPrice, publicMintPrice } = tokenInfo
      const nftOwner = await whitelabelNftContract.owner()
      const price = tokenInfoPhase === Phase.Whitelist ? whitelistMintPrice : publicMintPrice
      const mintMethod = tokenInfoPhase === Phase.Whitelist ? 'mint(uint256,bytes)' : 'mint(uint256)'
      const args: (number | string)[] = [values.mintQuantity]
      if (tokenInfoPhase === Phase.Whitelist) {
        args.push(whitelabelNftApiSignature.data?.signature || '')
      }

      const tx = await whitelabelNftContract[mintMethod](...args, {
        value: account === nftOwner ? 0 : BigNumber.from(price).mul(values.mintQuantity),
      })
      await tx.wait()
      await whitelabelNft.refetch()

      setSubmitting(false)
      setMintedMessage(`You have successfully minted ${quantity} ${whitelabelNft.data?.name} NFT Collections`)
      if (onDismiss) onDismiss()
    },
  })

  return (
    <Box>
      <Modal title="" onDismiss={onDismiss} hideSeparator>
        <Flex flexDirection="column" marginTop="-72px">
          <Heading size="lg" color={color} marginBottom="8px">
            Mint NFT
          </Heading>
          <HelperText color="text" marginBottom="16px">
            You are about to mint NFT from{' '}
            <HelperText bold color={color} style={{ display: 'inline-block' }}>
              {whitelabelNft.data?.name}
            </HelperText>{' '}
            collection
          </HelperText>
          <Decorator color={color} marginBottom={isMobileView ? '24px' : '16px'} />
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
              <Text bold color={color} fontSize="14px">
                Total Mint
              </Text>
            </Grid>
            <Grid item xs={12} lg={4} display="flex" flexDirection="row">
              <EtherIcon color={color} marginLeft="-8px" />
              <Text bold color={color} fontSize="14px">
                {formatUnits(BigNumber.from(mintPrice).mul(formik.values.mintQuantity), 18)} ETH
              </Text>
            </Grid>
          </Grid>
          <StyledButton
            variant="primary"
            onClick={formik.submitForm}
            isLoading={formik.isSubmitting}
            startIcon={formik.isSubmitting && <AutoRenewIcon color="white" spin />}
            color={color}
          >
            Mint NFT Collection
          </StyledButton>
        </Flex>
      </Modal>
    </Box>
  )
}

export default React.memo(MintWidgetSummaryModal)
