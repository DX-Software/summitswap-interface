import { Button, Flex, InjectedModalProps, Modal, Text, TextArea } from "@koda-finance/summitswap-uikit"
import { useWeb3React } from "@web3-react/core";
import { FormikProps, useFormik } from "formik";
import { useKickstarterContract } from "hooks/useContract";
import React from "react"
import styled from "styled-components"
import { Kickstarter } from "types/kickstarter"

interface RejectModalProps extends InjectedModalProps {
  kickstarter?: Kickstarter;
  handleKickstarterId: (value: string) => void
}

type InputProps = {
  rejectReason: string
}

const Container = styled(Flex)`
  flex-direction: column;
  padding: 16px;
`

const InfoWrapper = styled(Flex)`
  flex-direction: column;
  margin-left: 12px;
  padding-left: 12px;
  border-left: ${({ theme }) => `4px solid ${theme.colors.failure}`};
`

function RejectModal({ kickstarter, handleKickstarterId, onDismiss }: RejectModalProps) {
  const {library} = useWeb3React()
  const kickstarterContract = useKickstarterContract(kickstarter?.id)
  const formik: FormikProps<InputProps> = useFormik<InputProps>({
    enableReinitialize: true,
    initialValues: {
      rejectReason: ""
    },
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      if (!kickstarterContract || !onDismiss) return
      try {
        const receipt = await kickstarterContract.reject(values.rejectReason)
        await library.waitForTransaction(receipt.hash)
        onDismiss()
        handleKickstarterId("")
      } catch (e: any) {
        console.error("Failed to Reject Kickstarter", e.message)
      }
      setSubmitting(false)
    },
  })

  return (
    <Modal title="Payment Process" bodyPadding="0" onDismiss={onDismiss}>
      <Container>
        <Text marginBottom="8px">You are about to reject below project</Text>
        <InfoWrapper marginBottom="24px">
          <Text bold>{kickstarter?.title}</Text>
          <Text fontSize="14px" color="textSubtle">{kickstarter?.creator}</Text>
        </InfoWrapper>
        <Text fontSize="14px" color="textSubtle" marginBottom="8px">Enter Rejection Reason</Text>
        <TextArea
          placeholder="Write the reason why you reject this presale request"
          name="rejectReason"
          onChange={formik.handleChange} disabled={formik.isSubmitting}>{formik.values.rejectReason}</TextArea>
        <br />
        <Button variant="danger" onClick={() => formik.submitForm()} isLoading={formik.isSubmitting}>Reject Project</Button>
      </Container>
    </Modal>
  )
}

export default RejectModal
