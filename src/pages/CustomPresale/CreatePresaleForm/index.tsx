/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useCallback } from 'react'
import { BigNumber, ethers } from 'ethers'
import { useFormik, FormikProps } from 'formik'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Token } from '@koda-finance/summitswap-sdk'
import { Text, Button, AutoRenewIcon, useWalletModal, Box } from '@koda-finance/summitswap-uikit'
import { HelpCircle } from 'react-feather'
import login from 'utils/login'
import { useFactoryPresaleContract, useTokenContract } from 'hooks/useContract'
import TokenDropdown from 'components/TokenDropdown'
import { RowBetween, AutoRow, RowFlatCenter, ColumnFlatCenter } from 'components/Row'
import { MouseoverTooltip } from 'components/Tooltip'
import MessageDiv from 'components/MessageDiv'
import CustomLightSpinner from 'components/CustomLightSpinner'
import { PRESALE_FACTORY_ADDRESS, MAX_APPROVE_VALUE, MESSAGE_ERROR, MESSAGE_SUCCESS } from '../../../constants/presale'
import { ROUTER_ADDRESS, PANCAKESWAP_ROUTER_V2_ADDRESS } from '../../../constants'
import { Values, ValueErrors, FieldNames, RadioFieldValues } from '../types'
import { InputField, StyledRadio, RadioContainer, StyledDateTimeInput } from './FormFields'

export const FormCard = styled.div`
  background: #011724;
  border-radius: 20px;
  padding: 25px 28px;
  width: 85%;
  margin-top: 20px;
  max-width: 970px;
`

const CreatePresaleForm = () => {
  const { account, library, activate, deactivate } = useWeb3React()

  const [isFactoryApproved, setIsFactoryApproved] = useState<boolean>()
  const [selectedToken, setSelectedToken] = useState<Token>()
  const [tokensForPresale, setTokensForPresale] = useState<number>()
  const [accountBalance, setAccountBalance] = useState<BigNumber>()
  const [presaleAddress, setPresaleAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const tokenContract = useTokenContract(selectedToken?.address, true)
  const factoryContract = useFactoryPresaleContract(PRESALE_FACTORY_ADDRESS)

  const handleLogin = useCallback(
    (connectorId: string) => {
      login(connectorId, activate)
    },
    [activate]
  )

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  useEffect(() => {
    if (selectedToken && !account) {
      onPresentConnectModal()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, selectedToken])

  useEffect(() => {
    if (presaleAddress) {
      window.location.href = `#/presale?address=${presaleAddress}`
    }
  }, [presaleAddress])

  useEffect(() => {
    async function checkPresaleExists() {
      const address = await factoryContract?.tokenPresales(selectedToken?.address)
      if (BigNumber.from(address).isZero()) {
        setPresaleAddress('')
      } else {
        setPresaleAddress(address)
      }
    }
    if (factoryContract && selectedToken) {
      checkPresaleExists()
    }
  }, [selectedToken, factoryContract])

  useEffect(() => {
    async function checkTokenIsApproved() {
      const aprrovedAmount: BigNumber = await tokenContract?.allowance(account, PRESALE_FACTORY_ADDRESS)
      if (aprrovedAmount.eq(BigNumber.from(MAX_APPROVE_VALUE))) {
        setIsFactoryApproved(true)
      } else {
        setIsFactoryApproved(false)
      }
    }
    if (tokenContract && account && selectedToken) {
      checkTokenIsApproved()
    }
  }, [tokenContract, account, selectedToken])

  useEffect(() => {
    async function fetchBalance() {
      setAccountBalance(await tokenContract?.balanceOf(account))
    }
    if (account && tokenContract) {
      fetchBalance()
    }
  }, [account, tokenContract])

  const validate = useCallback(
    (values: any) => {
      const errors: ValueErrors = {}

      if (!values.presaleRate) {
        errors.presaleRate = 'Required*'
      } else if (values.presaleRate <= 0) {
        errors.presaleRate = 'Presale Rate should be a postive Number'
      }

      if (!values.softcap) {
        errors.softcap = 'Required*'
      } else if (values.softcap <= 0) {
        errors.softcap = 'Softcap should be a positive number'
      } else if (values.softcap > values.hardcap) {
        errors.softcap = 'Softcap <= to hardcap'
      } else if (values.softcap < values.hardcap * 0.5) {
        errors.softcap = 'Softcap >= 50% of hardcap'
      }

      if (!values.hardcap) {
        errors.hardcap = 'Required*'
      } else if (values.hardcap <= 0) {
        errors.hardcap = 'Hardcap should be a positive number'
      }

      if (!values.minBuyBnb) {
        errors.minBuyBnb = 'Required*'
      } else if (values.minBuyBnb <= 0) {
        errors.minBuyBnb = 'Min(BNB) should be a positive number'
      } else if (values.minBuyBnb >= values.maxBuyBnb) {
        errors.minBuyBnb = 'Min(BNB) <= Max(BNB)'
      }

      if (!values.maxBuyBnb) {
        errors.maxBuyBnb = 'Required*'
      } else if (values.maxBuyBnb <= 0) {
        errors.maxBuyBnb = 'Max(Bnb) should be a positive number'
      } else if (values.maxBuyBnb > values.hardcap) {
        errors.maxBuyBnb = 'Max(Bnb) <= hardcap'
      }

      if (!values.liquidity) {
        errors.liquidity = 'Required*'
      } else if (values.liquidity <= 0) {
        errors.liquidity = 'Liquidity% should be a positive number'
      } else if (values.liquidity < 51 || values.liquidity > 100) {
        errors.liquidity = 'Liquidity% should be between 51% & 100%'
      } else if (!Number.isInteger(values.liquidity)) {
        errors.liquidity = 'Liquidity should be an Integer'
      }

      if (!values.listingRate) {
        errors.listingRate = 'Required*'
      } else if (values.listingRate <= 0) {
        errors.listingRate = 'Listing Rate should be a postive Number'
      }

      if (!values.startPresaleTime) {
        errors.startPresaleTime = 'Required*'
      } else if (new Date(values.startPresaleTime) <= new Date()) {
        errors.startPresaleTime = 'Start time > current time'
      } else if (new Date(values.startPresaleTime) >= new Date(values.endPresaleTime)) {
        errors.startPresaleTime = 'Start time < End time'
      }

      if (!values.endPresaleTime) {
        errors.endPresaleTime = 'Required*'
      } else if (new Date(values.endPresaleTime) <= new Date()) {
        errors.endPresaleTime = 'End time > current time'
      }

      if (!values.liquidyLockTimeInMins) {
        errors.liquidyLockTimeInMins = 'Required*'
      } else if (values.liquidyLockTimeInMins < 5) {
        errors.liquidyLockTimeInMins = 'Liquidity Lock time >= 5mins'
      }
      if (
        values.hardcap &&
        values.presaleRate &&
        values.listingRate &&
        values.liquidity &&
        accountBalance &&
        selectedToken
      ) {
        const tokenAmount =
          values.presaleRate * values.hardcap + values.hardcap * (values.liquidity / 100) * values.listingRate * 1.025
        setTokensForPresale(tokenAmount)
        if (tokenAmount > Number(ethers.utils.formatUnits(accountBalance, selectedToken.decimals))) {
          errors.tokenAmount = 'Token Amounts Exceeds Balance'
        }
      }

      return errors
    },
    [selectedToken, accountBalance]
  )

  const formik: FormikProps<Values> = useFormik({
    initialValues: {
      [FieldNames.presaleRate]: undefined,
      [FieldNames.isWhitelistEnabled]: RadioFieldValues.whitelistDisable,
      [FieldNames.softcap]: undefined,
      [FieldNames.hardcap]: undefined,
      [FieldNames.minBuyBnb]: undefined,
      [FieldNames.maxBuyBnb]: undefined,
      [FieldNames.refundType]: RadioFieldValues.refundTypeRefund,
      [FieldNames.router]: ROUTER_ADDRESS,
      [FieldNames.liquidity]: undefined,
      [FieldNames.listingRate]: undefined,
      [FieldNames.startPresaleTime]: undefined,
      [FieldNames.endPresaleTime]: undefined,
      [FieldNames.liquidyLockTimeInMins]: undefined,
      [FieldNames.tokenAmount]: undefined,
      [FieldNames.feeType]: RadioFieldValues.feeTypeOnlyBnb,
    } as Values,
    validate,
    onSubmit: async (values: Values) => {
      if (!factoryContract || !selectedToken) {
        return
      }
      setIsLoading(true)
      try {
        const receipt = await factoryContract.createPresale(
          [selectedToken.address, values.router],
          [
            ethers.utils.parseUnits(`${tokensForPresale}`, selectedToken.decimals),
            ethers.utils.parseUnits(`${values.presaleRate}`, 18),
            ethers.utils.parseUnits(`${values.listingRate}`, 18),
            values.liquidity,
          ],
          [
            ethers.utils.parseUnits(`${values.minBuyBnb}`, 18),
            ethers.utils.parseUnits(`${values.maxBuyBnb}`, 18),
            ethers.utils.parseUnits(`${values.softcap}`, 18),
            ethers.utils.parseUnits(`${values.hardcap}`, 18),
          ],
          values.liquidyLockTimeInMins ? values.liquidyLockTimeInMins * 60 : 0,
          values.startPresaleTime ? new Date(values.startPresaleTime).getTime() / 1000 : 0,
          values.endPresaleTime ? new Date(values.endPresaleTime).getTime() / 1000 : 0,
          values.feeType === RadioFieldValues.feeTypeOnlyBnb ? 0 : 1,
          values.refundType === RadioFieldValues.refundTypeRefund ? 0 : 1,
          values.isWhitelistEnabled === RadioFieldValues.whitelistEnable,
          {
            value: ethers.utils.parseEther('0.0001'),
          }
        )

        await library.waitForTransaction(receipt.hash)

        const preSaleAdd = await factoryContract.tokenPresales(selectedToken.address)
        setIsLoading(false)
        setPresaleAddress(preSaleAdd)
      } catch (err) {
        setIsLoading(false)
        console.log(err)
      }
    },
  })

  const onApproveTokenHandler = useCallback(async () => {
    if (!tokenContract && !library && !account) {
      return
    }
    try {
      setIsLoading(true)
      const receipt = await tokenContract?.approve(PRESALE_FACTORY_ADDRESS, MAX_APPROVE_VALUE)
      await library.waitForTransaction(receipt.hash)
      setIsLoading(false)
      setIsFactoryApproved(true)
    } catch (err) {
      console.log(err)
      setIsLoading(false)
      setIsFactoryApproved(false)
    }
  }, [tokenContract, library, account])

  const handleTokenSelect = useCallback((inputCurrency) => {
    setSelectedToken(inputCurrency)
  }, [])

  return (
    <>
      {account && (
        <>
          <Box maxWidth="970px" width="85%">
            <Text bold fontSize="23px" mt="30px" mb="5px">
              Select Token For Presale
            </Text>
            <TokenDropdown
              onCurrencySelect={handleTokenSelect}
              selectedCurrency={selectedToken}
              showETH={false}
              showOnlyUnknownTokens
            />
            {selectedToken && (
              <>
                <FormCard style={{ width: '100%' }}>
                  <RowBetween>
                    <Text>Name</Text>
                    <Text>{selectedToken.name}</Text>
                  </RowBetween>
                  <RowBetween>
                    <Text>Symbol</Text>
                    <Text>{selectedToken.symbol}</Text>
                  </RowBetween>
                  <RowBetween>
                    <Text>Decimals</Text>
                    <Text>{selectedToken.decimals}</Text>
                  </RowBetween>
                </FormCard>
                <RowFlatCenter style={{ margin: '30px' }}>
                  {isFactoryApproved === undefined ? (
                    <CustomLightSpinner src="/images/blue-loader.svg" size="50px" />
                  ) : (
                    !presaleAddress && (
                      <Button
                        disabled={isFactoryApproved || !selectedToken || !account || isLoading}
                        onClick={onApproveTokenHandler}
                        endIcon={isLoading && !isFactoryApproved && <AutoRenewIcon spin color="currentColor" />}
                      >
                        {isFactoryApproved ? 'Token Is Approved' : 'Approve'}
                      </Button>
                    )
                  )}
                </RowFlatCenter>
              </>
            )}
          </Box>
          {selectedToken && !presaleAddress && (
            <>
              <Text bold fontSize="23px" mb="5px">
                Create Token Presale
              </Text>
              <FormCard>
                <form onSubmit={formik.handleSubmit}>
                  <AutoRow justifyContent="space-around">
                    <InputField
                      formik={formik}
                      label="Presale Rate: "
                      inputAttributes={{ name: FieldNames.presaleRate, placeholder: '0.00', type: 'number' }}
                      message="If I spend 1 BNB how many tokens will I recieve?"
                    />
                    <InputField
                      formik={formik}
                      label="Listing Rate: "
                      inputAttributes={{ name: FieldNames.listingRate, placeholder: '0.00', type: 'number' }}
                      message="If I spend 1 BNB on how many tokens will I receive after the token has listed on the exchange? Usually this amount is lower than presale rate."
                    />
                  </AutoRow>
                  <AutoRow justifyContent="space-around">
                    <InputField
                      formik={formik}
                      label="Softcap: "
                      inputAttributes={{ name: FieldNames.softcap, placeholder: '0.00', type: 'number' }}
                      message="Softcap is the Min amount of BNB that should be raised for a Presale to be successfull."
                    />
                    <InputField
                      formik={formik}
                      label="Hardcap: "
                      inputAttributes={{ name: FieldNames.hardcap, placeholder: '0.00', type: 'number' }}
                      message="Hardcap is the Max amount of BNB that can be raised by a Presale."
                    />
                  </AutoRow>
                  <AutoRow justifyContent="space-around">
                    <InputField
                      formik={formik}
                      label="Minimum Buy(BNB): "
                      inputAttributes={{ name: FieldNames.minBuyBnb, placeholder: '0.00', type: 'number' }}
                      message="minimun buy is the minimun amount of Bnb that can used to buy Tokens."
                    />
                    <InputField
                      formik={formik}
                      label="Maximun buy(BNB): "
                      inputAttributes={{ name: FieldNames.maxBuyBnb, placeholder: '0.00', type: 'number' }}
                      message="maximun buy is the maximun amount of Bnb that can used to buy Tokens"
                    />
                  </AutoRow>
                  <AutoRow justifyContent="space-around">
                    <InputField
                      formik={formik}
                      label="Liquidity: "
                      inputAttributes={{ name: FieldNames.liquidity, placeholder: '0%', type: 'number' }}
                      message="Enter the percentage of raised funds that should be allocated to Liquidity(Min 51%, Max 100%)"
                    />
                    <InputField
                      formik={formik}
                      label="Liquidity Lock Time(Min): "
                      inputAttributes={{ name: FieldNames.liquidyLockTimeInMins, placeholder: '0', type: 'number' }}
                      message="Minimun liquidity lockup time should be 5 mins"
                    />
                  </AutoRow>
                  <AutoRow justifyContent="space-around">
                    <Text marginX={3} bold fontSize="14px">
                      Fee Options:
                      <RadioContainer onChange={formik.handleChange}>
                        <label style={{ marginRight: '10px' }}>
                          <StyledRadio
                            name={FieldNames.feeType}
                            value={RadioFieldValues.feeTypeOnlyBnb}
                            checked={formik.values.feeType === RadioFieldValues.feeTypeOnlyBnb}
                          />
                          5% BNB raised only
                        </label>
                        <label>
                          <StyledRadio
                            name={FieldNames.feeType}
                            value={RadioFieldValues.feeTypeBnbnToken}
                            checked={formik.values.feeType === RadioFieldValues.feeTypeBnbnToken}
                          />
                          2% BNB Raised + 2% Token Raised
                        </label>
                      </RadioContainer>
                    </Text>
                    <Text marginX={3} bold fontSize="14px">
                      Enable Whitelist:
                      <RadioContainer onChange={formik.handleChange}>
                        <label style={{ marginRight: '10px' }}>
                          <StyledRadio
                            name={FieldNames.isWhitelistEnabled}
                            value={RadioFieldValues.whitelistEnable}
                            checked={formik.values.isWhitelistEnabled === RadioFieldValues.whitelistEnable}
                          />
                          Enable
                        </label>
                        <label>
                          <StyledRadio
                            name={FieldNames.isWhitelistEnabled}
                            value={RadioFieldValues.whitelistDisable}
                            checked={formik.values.isWhitelistEnabled === RadioFieldValues.whitelistDisable}
                          />
                          Disable
                        </label>
                      </RadioContainer>
                    </Text>
                  </AutoRow>
                  <br />
                  <AutoRow justifyContent="space-around">
                    <Text marginX={3} bold fontSize="14px">
                      Router:
                      <RadioContainer onChange={formik.handleChange}>
                        <label>
                          <StyledRadio
                            name={FieldNames.router}
                            value={ROUTER_ADDRESS}
                            checked={formik.values.router === ROUTER_ADDRESS}
                          />{' '}
                          Summitswap
                        </label>
                        <label style={{ marginRight: '10px' }}>
                          <StyledRadio
                            name={FieldNames.router}
                            value={PANCAKESWAP_ROUTER_V2_ADDRESS}
                            checked={formik.values.router === PANCAKESWAP_ROUTER_V2_ADDRESS}
                          />
                          Pancakeswap
                        </label>
                      </RadioContainer>
                    </Text>
                    <Text marginX={3} bold fontSize="14px">
                      Refund Type:
                      <RadioContainer onChange={formik.handleChange}>
                        <label style={{ marginRight: '10px' }}>
                          <StyledRadio
                            name={FieldNames.refundType}
                            value={RadioFieldValues.refundTypeRefund}
                            checked={formik.values.refundType === RadioFieldValues.refundTypeRefund}
                          />{' '}
                          Refund
                        </label>
                        <label>
                          <StyledRadio
                            name={FieldNames.refundType}
                            value={RadioFieldValues.refundTypeBurn}
                            checked={formik.values.refundType === RadioFieldValues.refundTypeBurn}
                          />{' '}
                          Burn
                        </label>
                      </RadioContainer>
                    </Text>
                  </AutoRow>
                  <br />
                  <AutoRow justifyContent="space-around">
                    <Box marginX={3} marginBottom={1}>
                      <label>
                        <RowBetween ml="3px" mb="5px">
                          <Text bold fontSize="15px">
                            Start Presale Time:
                          </Text>
                          <MouseoverTooltip
                            size="12px"
                            text="Start Presale time is the time when the presale starts. So, this time should be greater than current time and less than presale end time."
                          >
                            <span>
                              <HelpCircle size={18} />
                            </span>
                          </MouseoverTooltip>
                        </RowBetween>
                        <StyledDateTimeInput
                          value={formik.values.startPresaleTime}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          name={FieldNames.startPresaleTime}
                          isWarning={formik.touched.startPresaleTime && !!formik.errors.startPresaleTime}
                          type="datetime-local"
                        />
                      </label>
                      <Text style={{ height: '10px' }} ml="3px" mt="2px" fontSize="10px" color="#ED4B9E">
                        {formik.touched.startPresaleTime && formik.errors.startPresaleTime
                          ? formik.errors.startPresaleTime
                          : ''}
                      </Text>
                    </Box>
                    <Box marginX={3} marginBottom={1}>
                      <label>
                        <RowBetween ml="3px" mb="5px">
                          <Text bold fontSize="15px">
                            End Presale Time:
                          </Text>
                          <MouseoverTooltip
                            size="12px"
                            text="End Presale time is the time when presale ends. So, this should be greater than current time and start presale time."
                          >
                            <span>
                              <HelpCircle size={18} />
                            </span>
                          </MouseoverTooltip>
                        </RowBetween>
                        <StyledDateTimeInput
                          value={formik.values.endPresaleTime}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          name={FieldNames.endPresaleTime}
                          isWarning={formik.touched.endPresaleTime && !!formik.errors.endPresaleTime}
                          type="datetime-local"
                        />
                      </label>
                      <Text style={{ height: '10px' }} ml="3px" mt="2px" fontSize="10px" color="#ED4B9E">
                        {formik.touched.endPresaleTime && formik.errors.endPresaleTime
                          ? formik.errors.endPresaleTime
                          : ''}
                      </Text>
                    </Box>
                  </AutoRow>
                  <ColumnFlatCenter>
                    {formik.errors.tokenAmount ? (
                      <MessageDiv type={MESSAGE_ERROR}>{formik.errors.tokenAmount}</MessageDiv>
                    ) : (
                      <MessageDiv marginBottom={2} type={MESSAGE_SUCCESS}>
                        {tokensForPresale && isFactoryApproved
                          ? `${tokensForPresale.toFixed(3)} Tokens for Presale`
                          : ''}
                      </MessageDiv>
                    )}
                    {!isFactoryApproved ? (
                      <MessageDiv type={MESSAGE_ERROR}>Please First Approve Token for Presale</MessageDiv>
                    ) : (
                      <Button
                        m={10}
                        type="submit"
                        disabled={!isFactoryApproved || !selectedToken || !account || isLoading || !formik.isValid}
                        endIcon={isLoading && <AutoRenewIcon spin color="currentColor" />}
                      >
                        Create Presale
                      </Button>
                    )}
                  </ColumnFlatCenter>
                </form>
              </FormCard>
            </>
          )}
        </>
      )}
    </>
  )
}
export default CreatePresaleForm
