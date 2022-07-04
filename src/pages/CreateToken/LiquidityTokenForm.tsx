import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useFormik, FormikProps } from 'formik'
import { Option } from 'react-dropdown'
import { Text, Button, Box } from '@koda-finance/summitswap-uikit'
import { useTokenCreatorContract } from 'hooks/useContract'
import CreateTokenForm from 'components/CreateTokenForm'
import StyledDropdownWrapper from 'components/DropdownWrapper/StyledDropdownWrapper'
import InputFormik, { LiquidityTokenValues } from 'components/FormikInput'
import { NULL_ADDRESS } from '../../constants'
import {
  TokenType,
  SUMMITSWAP_ROUTER_OPTION,
  PANCAKESWAP_ROUTER_OPTION,
  MAX_TOKEN_SUPPLY,
  MIN_TAX_VALUE,
  MAX_TOTAL_TAX_VALUE,
} from '../../constants/createToken'
import CreateTokenLoadingCard from './CreateTokenLoadingCard'
import { RowBetween } from '../../components/Row'
import AppBody from '../AppBody'
import { CreatedTokenDetails } from './types'

export const verifyAddress = (address) => {
  try {
    ethers.utils.getAddress(address)
    return true
  } catch {
    return false
  }
}

const PaginationButton = styled(Button)<{ isSelected: boolean }>`
  height: 17px;
  margin: 3px;
  background: ${(props) => (props.isSelected ? '' : '#fff')};
  opacity: ${(props) => (props.isSelected ? '1' : '0.5')};
  padding: 0;
  width: ${(props) => (props.isSelected ? '45px' : '17px')};
  @media (max-width: 480px) {
    display: none;
  }
`

interface Props {
  setShowTokenDropdown: React.Dispatch<React.SetStateAction<boolean>>
  setCreatedTokenDetails: React.Dispatch<React.SetStateAction<CreatedTokenDetails | undefined>>
}

const LiquidityTokenForm = ({ setShowTokenDropdown, setCreatedTokenDetails }: Props) => {
  const { account } = useWeb3React()

  const [selectedPageNumber, setSelectedPageNumber] = useState(0)
  const [router, setRouter] = useState<Option>(SUMMITSWAP_ROUTER_OPTION)
  const [isLoading, setIsLoading] = useState(false)
  const [isFailed, setIsFailed] = useState(false)

  useEffect(() => {
    if (selectedPageNumber === 0) {
      setShowTokenDropdown(true)
    } else {
      setShowTokenDropdown(false)
    }
  }, [selectedPageNumber, setShowTokenDropdown])

  useEffect(() => {
    if (isFailed) {
      setTimeout(() => {
        setIsFailed(false)
      }, 4000)
    }
  }, [isFailed])

  const parseTax = (tax) => {
    return parseInt((tax * 100).toString())
  }

  const validate = async (values) => {
    const errors: LiquidityTokenValues = {}

    if (!values.name) {
      errors.name = 'Required*'
    }

    if (!values.symbol) {
      errors.symbol = 'Required*'
    }

    if (!values.supply) {
      errors.supply = 'Required*'
    } else if (!Number.isInteger(values.supply)) {
      errors.supply = 'Total supply should be an interger'
    } else if (BigInt(values.supply) > BigInt(MAX_TOKEN_SUPPLY)) {
      errors.supply = 'Invalid Token Supply'
    }

    if (values.taxFeeBps && values.taxFeeBps < MIN_TAX_VALUE) {
      errors.taxFeeBps = `taxFeeBps must be greater than or equal to ${MIN_TAX_VALUE}`
    } else if (values.taxFeeBps > MAX_TOTAL_TAX_VALUE) {
      errors.taxFeeBps = `taxFeeBps must be less than or equal to ${MAX_TOTAL_TAX_VALUE}`
    }

    if (values.liquidityFeeBps && values.liquidityFeeBps < MIN_TAX_VALUE) {
      errors.liquidityFeeBps = `liquidityFeeBps must be greater than or equal to ${MIN_TAX_VALUE}`
    } else if (values.taxFeeBps > MAX_TOTAL_TAX_VALUE) {
      errors.liquidityFeeBps = `liquidityFeeBps must be less than or equal to ${MAX_TOTAL_TAX_VALUE}`
    }

    if (!values.charityAddress && values.charityFeeBps) {
      formik.touched.charityAddress = true
      errors.charityAddress = 'This field is required if you have a Tax Fee'
    } else if (values.charityAddress && !verifyAddress(values.charityAddress)) {
      errors.charityAddress = 'This is not a valid address'
    } else if (values.charityAddress === account) {
      errors.charityAddress = 'This account cannot be the same as the owners account'
    }

    if (!values.charityFeeBps && values.charityFeeBps !== 0 && verifyAddress(values.charityAddress)) {
      errors.charityFeeBps = 'This field is required if you have a Charity Address'
    } else if (values.charityFeeBps && values.charityFeeBps < MIN_TAX_VALUE) {
      errors.charityFeeBps = `This field must be greater than or equal to ${MIN_TAX_VALUE} if you have a Charity Address`
    } else if (values.taxFeeBps > MAX_TOTAL_TAX_VALUE) {
      errors.charityFeeBps = `Field must be less than or equal to ${MAX_TOTAL_TAX_VALUE}`
    }

    if (
      parseTax(values.taxFeeBps) + parseTax(values.liquidityFeeBps) + parseTax(values.charityFeeBps) >
      MAX_TOTAL_TAX_VALUE * 100
    ) {
      errors.taxes = `Total Fees cannot exceed ${MAX_TOTAL_TAX_VALUE}%`
    }

    return errors
  }

  const factory = useTokenCreatorContract(TokenType.Liquidity)
  const formik: FormikProps<LiquidityTokenValues> = useFormik({
    initialValues: {
      name: '',
      symbol: '',
      supply: '',
      charityAddress: '',
      taxFeeBps: '',
      liquidityFeeBps: '',
      charityFeeBps: '',
      taxes: '',
    } as LiquidityTokenValues,
    validate,
    onSubmit: async (values) => {
      try {
        if (!factory || !account) {
          return
        }
        setIsLoading(true)
        const tx = await factory.createLiquidityToken(
          values.name,
          values.symbol,
          ethers.utils.parseUnits(String(values.supply), 9),
          router.value,
          values.charityAddress !== '' ? values.charityAddress : NULL_ADDRESS,
          parseTax(values.taxFeeBps),
          parseTax(values.liquidityFeeBps),
          parseTax(values.charityFeeBps),
          { value: ethers.utils.parseUnits('0.01') } // TODO:: update contract to get price from the contract
        )
        await tx.wait()
        const tokenAddress: string = await factory.customLiquidityTokens(
          (await factory.customLiquidityTokensMade()).sub(1)
        )
        setCreatedTokenDetails({
          address: tokenAddress,
          name: values.name || '',
          supply: values.supply || '',
          symbol: values.symbol || '',
          transactionAddress: tx.hash,
        })
        setIsLoading(false)
      } catch (e) {
        setIsLoading(false)
        setIsFailed(true)
        console.error(e)
      }
    },
  })

  const showSelectedPage = () => {
    switch (selectedPageNumber) {
      case 0:
        return (
          <>
            <InputFormik
              formik={formik}
              label="Name*"
              message="Name of Your token"
              inputAttributes={{ name: 'name', placeholder: 'Ex: Ethereum', type: 'text' }}
            />
            <InputFormik
              formik={formik}
              label="Symbol*"
              message="Your token Symbol"
              inputAttributes={{ name: 'symbol', placeholder: 'Ex: ETH', type: 'text' }}
            />
            <InputFormik
              formik={formik}
              label="Total Supply*"
              message="The total supply of your token"
              inputAttributes={{ name: 'supply', placeholder: 'Ex: 100000000', type: 'number' }}
            />
          </>
        )
      case 1:
        return (
          <>
            <Box>
              <Text mb="5px" mt={20} bold fontSize="18px">
                Router
              </Text>
              <StyledDropdownWrapper
                value="Summitswap Router"
                options={[SUMMITSWAP_ROUTER_OPTION, PANCAKESWAP_ROUTER_OPTION]}
                onChange={(option: Option) => {
                  setRouter(option)
                }}
              />
            </Box>
            <InputFormik
              formik={formik}
              label="Transaction fee to generate yield (%)"
              message="The % amount of tokens from every transaction that are distributed to all token holders."
              inputAttributes={{ name: 'taxFeeBps', placeholder: `0 - ${MAX_TOTAL_TAX_VALUE}%`, type: 'number' }}
            />
            <InputFormik
              formik={formik}
              label="Transaction fee to generate liquidity (%)"
              message="The % amount of tokens from every transaction that are distributed to the liquidity pool."
              inputAttributes={{ name: 'liquidityFeeBps', placeholder: `0 - ${MAX_TOTAL_TAX_VALUE}%`, type: 'number' }}
            />
          </>
        )
      case 2:
        return (
          <>
            <InputFormik
              formik={formik}
              label="Charity/Marketing Address"
              message="All charity/marketing tokens from “Charity/Marketing percent (%)” will be distributed to this address."
              inputAttributes={{ name: 'charityAddress', placeholder: 'Ex: 0x...', type: 'string' }}
            />
            <InputFormik
              formik={formik}
              label="Charity/Marketing percent (%)"
              message="The % amount of tokens from every transaction that is sent to the charity/marketing address"
              inputAttributes={{ name: 'charityFeeBps', placeholder: `0 - ${MAX_TOTAL_TAX_VALUE}%`, type: 'number' }}
            />
          </>
        )
      default:
        return <></>
    }
  }

  return (
    <>
      {!isLoading && (
        <CreateTokenForm onSubmit={formik.handleSubmit}>
          <AppBody>
            {showSelectedPage()}
            {formik.errors.taxes && (
              <Text mt={2} color="failure" fontWeight="600" textAlign="center">
                {formik.errors.taxes}.
              </Text>
            )}
            {isFailed && (
              <Text mt={2} color="failure" fontWeight="600" textAlign="center">
                Token Creation Failed.
              </Text>
            )}
            <RowBetween marginY={3}>
              <Button
                width={110}
                type="button"
                disabled={selectedPageNumber === 0}
                onClick={() => setSelectedPageNumber((num) => num - 1)}
              >
                Previous
              </Button>
              <Box>
                <PaginationButton
                  type="button"
                  isSelected={selectedPageNumber === 0}
                  onClick={() => setSelectedPageNumber(0)}
                />
                <PaginationButton
                  type="button"
                  isSelected={selectedPageNumber === 1}
                  onClick={() => setSelectedPageNumber(1)}
                />
                <PaginationButton
                  type="button"
                  isSelected={selectedPageNumber === 2}
                  onClick={() => setSelectedPageNumber(2)}
                />
              </Box>
              {selectedPageNumber === 2 && (
                <Button
                  type="submit"
                  disabled={isLoading || isFailed || !formik.isValid || !formik.touched.name}
                  width={110}
                >
                  Create
                </Button>
              )}
              {selectedPageNumber <= 1 && (
                <Button type="button" onClick={() => setSelectedPageNumber((num) => num + 1)} width={110}>
                  Next
                </Button>
              )}
            </RowBetween>
          </AppBody>
        </CreateTokenForm>
      )}
      {isLoading && <CreateTokenLoadingCard />}
    </>
  )
}

export default LiquidityTokenForm
