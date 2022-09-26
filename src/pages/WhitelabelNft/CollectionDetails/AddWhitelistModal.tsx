import { Box, Button, Flex, Heading, InjectedModalProps, Modal } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import { useWhitelabelNftApiStoreSignatures } from 'api/useWhitelabelNftApi'
import { FormikProps, FormikProvider, useFormik } from 'formik'
import React from 'react'
import { WhitelabelSignaturesAddDto } from 'types/whitelabelNft'
import TextareaField from '../shared/TextareaField'
import { whitelistValidationSchema } from './validation'

type AddWhitelistModalProps = InjectedModalProps & {
  whitelabelNftId: string
  onRefresh?: () => void
}

function AddWhitelistModal({ whitelabelNftId, onRefresh, onDismiss }: AddWhitelistModalProps) {
  const { account } = useWeb3React()
  const whitelabelNftApiStoreSignatures = useWhitelabelNftApiStoreSignatures()

  const formik: FormikProps<WhitelabelSignaturesAddDto> = useFormik<WhitelabelSignaturesAddDto>({
    enableReinitialize: true,
    initialValues: {
      ownerAddress: account!,
      contractAddress: whitelabelNftId,
      whitelistAddresses: '',
    },
    validationSchema: whitelistValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      await whitelabelNftApiStoreSignatures.mutateAsync({
        ownerAddress: values.ownerAddress,
        contractAddress: values.contractAddress,
        whitelistAddresses: (values.whitelistAddresses as string).split('\n').map((v) => v.trim()),
      })

      setSubmitting(false)
      if (onRefresh) onRefresh()
      if (onDismiss) onDismiss()
    },
  })

  return (
    <Box width="100%" maxWidth="520px">
      <Modal title="" onDismiss={onDismiss}>
        <FormikProvider value={formik}>
          <Flex flexDirection="column" marginTop="-72px" marginBottom="16px">
            <Heading size="lg" color="primaryDark" marginBottom="16px">
              Import Whitelist
            </Heading>
            <TextareaField
              label="Input Whitelist Addresses"
              name="whitelistAddresses"
              placeholder="0x0000&#10;0x0000"
              formik={formik}
              helperText="Format should be `wallet_address` for each line."
            />
            <Button onClick={formik.submitForm}>Add New Whitelist</Button>
          </Flex>
        </FormikProvider>
      </Modal>
    </Box>
  )
}

export default React.memo(AddWhitelistModal)
