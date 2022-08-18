import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'
import { formatEther, parseEther } from 'ethers/lib/utils'
import { AutoRenewIcon, Box, Button, Text, Heading, Input } from '@koda-finance/summitswap-uikit'
import { useFactoryPresaleContract } from 'hooks/useContract'
import { PRESALE_FACTORY_ADDRESS } from 'constants/presale'
import { Caption } from '../Texts'

const PresaleSettings = () => {
  const { account, library } = useWeb3React()

  const [accountIsOwner, setAccountIsOwner] = useState(false)
  const [amountBnb, setAmountBnb] = useState('0')
  const [valueError, setValueError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentCreationFee, setCurrentPresaleFee] = useState<BigNumber>()
  const factoryContract = useFactoryPresaleContract(PRESALE_FACTORY_ADDRESS)

  useEffect(() => {
    async function checkAccountIsOwner() {
      setAccountIsOwner((await factoryContract?.owner()) === account)
    }
    if (account && factoryContract) {
      checkAccountIsOwner()
    }
  }, [account, factoryContract])

  useEffect(() => {
    async function fetchPresaleFee() {
      setCurrentPresaleFee(await factoryContract?.preSaleFee())
    }
    if (factoryContract) {
      fetchPresaleFee()
    }
  }, [factoryContract])

  const onChangeInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    let error = ''
    if (value && value !== '0') {
      if (Number(value) < 0) {
        error = 'Amount must be greater than zero'
      } else if (!accountIsOwner) {
        error = 'Account must owner account'
      } else {
        try {
          BigNumber.from(value)
        } catch (err) {
          error = 'Invalid value'
        }
      }
    }
    setValueError(error)
    setAmountBnb(value)
  }

  const onSaveChangesHandler = async () => {
    if (!factoryContract || !accountIsOwner || !!valueError || !amountBnb) {
      return
    }
    try {
      setIsLoading(true)
      const receipt = await factoryContract.setFee(parseEther(amountBnb))
      await library.waitForTransaction(receipt.hash)
      setIsLoading(false)
      setCurrentPresaleFee(parseEther(amountBnb))
    } catch (err) {
      console.error(err)
      setIsLoading(false)
    }
  }

  return (
    <Box marginTop="24px">
      <Heading color="sidebarActiveColor" size="md">
        Presale Creation Fee
      </Heading>
      <Text marginTop="8px" small>
        Presale creation fee is collected when user create a new project.
      </Text>
      <Caption color="textDisabled">
        Current Creation Fee:
        <Caption bold color="primary">
          &nbsp;{formatEther(currentCreationFee || '0')} BNB&nbsp;
        </Caption>
      </Caption>
      <Box marginTop="16px" width="100%" maxWidth="380px">
        <Text small marginBottom="4px">
          Enter Amount
        </Text>
        <Input marginBottom="8px" value={amountBnb} type="number" onChange={onChangeInputHandler} />
        {valueError ? (
          <Caption color="failure">{valueError}</Caption>
        ) : (
          <Caption color="textDisabled">
            If user creates a presale, they will have to pay
            <Caption bold color="primary">
              &nbsp;{amountBnb || '0'} BNB&nbsp;
            </Caption>
            as the presale creation fee
          </Caption>
        )}
      </Box>
      <Button
        marginY="24px"
        onClick={onSaveChangesHandler}
        endIcon={isLoading && <AutoRenewIcon spin color="currentColor" />}
        disabled={!accountIsOwner || !!valueError || !amountBnb || !factoryContract || isLoading}
      >
        Save Changes
      </Button>
    </Box>
  )
}

export default PresaleSettings
