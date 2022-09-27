import { AutoRenewIcon, Button, Flex, Heading, InjectedModalProps, Modal } from '@koda-finance/summitswap-uikit'
import { parseEther } from 'ethers/lib/utils'
import { FormikProvider, useFormik } from 'formik'
import { useWhitelabelNftContract } from 'hooks/useContract'
import React, { useMemo } from 'react'
import { UseQueryResult } from 'react-query'
import { WhitelabelNftCollectionGql, WhitelabelNftFormField } from 'types/whitelabelNft'
import InputField from '../shared/InputField'
import { HelperText } from '../shared/Text'
import { editMintPriceValidationSchema } from './validation'

type EditMintPriceModalProps = InjectedModalProps & {
  whitelabelNft: UseQueryResult<WhitelabelNftCollectionGql | undefined>
}

function EditMintPriceModal({ whitelabelNft, onDismiss }: EditMintPriceModalProps) {
  const whitelabelNftContract = useWhitelabelNftContract(whitelabelNft.data?.id || '')

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      whitelistMintPrice: whitelabelNft.data?.whitelistMintPrice?.toString() || '0',
      publicMintPrice: whitelabelNft.data?.publicMintPrice?.toString() || '0',
    },
    validationSchema: editMintPriceValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!whitelabelNftContract) return
      if (
        whitelabelNft.data?.whitelistMintPrice?.toString() === values.whitelistMintPrice?.toString() &&
        whitelabelNft.data?.publicMintPrice?.toString() === values.publicMintPrice?.toString()
      ) {
        return
      }
      const whitelistMintPrice = parseEther(values.whitelistMintPrice?.toString())
      const publicMintPrice = parseEther(values.publicMintPrice?.toString())

      const tx = await whitelabelNftContract.setMintPrices(whitelistMintPrice, publicMintPrice)
      await tx.wait()

      setSubmitting(false)
    },
  })

  const canSubmit = useMemo(() => {
    if (
      whitelabelNft.data?.whitelistMintPrice?.toString() === formik.values.whitelistMintPrice?.toString() &&
      whitelabelNft.data?.publicMintPrice?.toString() === formik.values.publicMintPrice?.toString()
    ) {
      return false
    }
    return true
  }, [
    whitelabelNft.data?.whitelistMintPrice,
    whitelabelNft.data?.publicMintPrice,
    formik.values.whitelistMintPrice,
    formik.values.publicMintPrice,
  ])

  return (
    <FormikProvider value={formik}>
      <Modal title="" onDismiss={onDismiss}>
        <Flex flexDirection="column" marginTop="-72px" marginBottom="16px">
          <Heading size="lg" color="primary" marginBottom="16px">
            Edit Mint Price
          </Heading>

          <InputField
            label="Public Mint Price"
            name={WhitelabelNftFormField.publicMintPrice}
            placeholder="10"
            formik={formik}
            helperText={
              <>
                Current Price:{' '}
                <HelperText fontSize="12px" color="linkColor" fontWeight={700} style={{ display: 'inline-block' }}>
                  {whitelabelNft.data?.publicMintPrice?.toString() || 0} ETH
                </HelperText>
              </>
            }
          />

          <InputField
            label="Whitelist Mint Price"
            name={WhitelabelNftFormField.whitelistMintPrice}
            placeholder="10"
            formik={formik}
            helperText={
              <>
                Current Price:{' '}
                <HelperText fontSize="12px" color="linkColor" fontWeight={700} style={{ display: 'inline-block' }}>
                  {whitelabelNft.data?.whitelistMintPrice?.toString() || 0} ETH
                </HelperText>
              </>
            }
          />
        </Flex>
        <Flex alignItems="flex-start">
          <Button
            onClick={formik.submitForm}
            isLoading={formik.isSubmitting}
            disabled={!canSubmit}
            startIcon={formik.isSubmitting && <AutoRenewIcon spin color="textSubtle" />}
          >
            Change Mint Price
          </Button>
        </Flex>
      </Modal>
    </FormikProvider>
  )
}

export default React.memo(EditMintPriceModal)
