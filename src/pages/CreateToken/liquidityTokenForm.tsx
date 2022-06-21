import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useFormik, FormikProps } from 'formik'
import { Option } from 'react-dropdown'
import { Text, Button, Box } from '@koda-finance/summitswap-uikit'
import { useTokenCreatorContract } from 'hooks/useContract'
import { ROUTER_ADDRESS, PANCAKESWAP_ROUTER_V2_ADDRESS, TokenType } from '../../constants/index'
import {
  InputFormik,
  LiquidityTokenValues,
  StyledDropdownWrapper,
  Form,
  LoadingTokenCard,
  PaginationButton,
} from './components'
import { RowBetween } from '../../components/Row'
import AppBody from '../AppBody'

export const verifyAddress = (address) => {
  try {
    ethers.utils.getAddress(address)
    return true
  } catch {
    return false
  }
}

interface ValueErrors {
  name?: string
  symbol?: string
  supply?: string
  charityAddress?: string
  taxFeeBps?: string
  liquidityFeeBps?: string
  charityFeeBps?: string
  taxes?: string
  page?: string
}

interface Props {
  account: string
  setTokenAddress: React.Dispatch<React.SetStateAction<string>>
  setTxAddress: React.Dispatch<React.SetStateAction<string>>
  setTotalSupply: React.Dispatch<React.SetStateAction<string>>
  setShowTokenDropdown: React.Dispatch<React.SetStateAction<boolean>>
}

const LiquidityTokenForm = ({
  account,
  setTokenAddress,
  setShowTokenDropdown,
  setTxAddress,
  setTotalSupply,
}: Props) => {
  const [selectedPageNumber, setSelectedPageNumber] = useState(0)
  const [router, setRouter] = useState<Option>({ value: ROUTER_ADDRESS, label: 'Summitswap Router' })
  const [isLoading, setIsLoading] = useState(false)
  const [isCreated, setIsCreated] = useState(false)
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
    const errors: ValueErrors = {}

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
    } else if (BigInt(values.supply) > BigInt('500000000000000000000')) {
      errors.supply = 'Invalid Token Supply'
    }

    if (values.taxFeeBps && values.taxFeeBps < 0.01) {
      errors.taxFeeBps = 'taxFeeBps must be greater than or equal to 0.01'
    } else if (values.taxFeeBps > 25) {
      errors.taxFeeBps = 'taxFeeBps must be less than or equal to 25'
    }

    if (values.liquidityFeeBps && values.liquidityFeeBps < 0.01) {
      errors.liquidityFeeBps = 'liquidityFeeBps must be greater than or equal to 0.01'
    } else if (values.taxFeeBps > 25) {
      errors.liquidityFeeBps = 'liquidityFeeBps must be less than or equal to 25'
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
    } else if (values.charityFeeBps && values.charityFeeBps < 0.01) {
      errors.charityFeeBps = 'This field must be greater than or equal to 0.01 if you have a Charity Address'
    } else if (values.taxFeeBps > 25) {
      errors.charityFeeBps = 'Field must be less than or equal to 25'
    }

    if (parseTax(values.taxFeeBps) + parseTax(values.liquidityFeeBps) + parseTax(values.charityFeeBps) > 2500) {
      errors.taxes = 'Total Fees cannot exceed 25%'
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
    },
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
          values.charityAddress !== '' ? values.charityAddress : '0x0000000000000000000000000000000000000000',
          parseTax(values.taxFeeBps),
          parseTax(values.liquidityFeeBps),
          parseTax(values.charityFeeBps),
          { value: ethers.utils.parseUnits('0.01') }
        )
        await tx.wait()
        setTokenAddress(await factory.customLiquidityTokens((await factory.customLiquidityTokensMade()).sub(1)))
        setIsLoading(false)
        setIsCreated(true)
        setTxAddress(tx.hash)
        setTotalSupply(values.supply)
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
                options={[
                  { value: ROUTER_ADDRESS, label: 'Summitswap Router' },
                  { value: PANCAKESWAP_ROUTER_V2_ADDRESS, label: 'Pancakeswap Router' },
                ]}
                onChange={(option: Option) => {
                  setRouter(option)
                }}
              />
            </Box>
            <InputFormik
              formik={formik}
              label="Transaction fee to generate yield (%)"
              message="The % amount of tokens from every transaction that are distributed to all token holders."
              inputAttributes={{ name: 'taxFeeBps', placeholder: '0 - 25%', type: 'number' }}
            />
            <InputFormik
              formik={formik}
              label="Transaction fee to generate liquidity (%)"
              message="The % amount of tokens from every transaction that are distributed to the liquidity pool."
              inputAttributes={{ name: 'liquidityFeeBps', placeholder: '0 - 25%', type: 'number' }}
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
              inputAttributes={{ name: 'charityFeeBps', placeholder: '0 - 25%', type: 'number' }}
            />
          </>
        )
      default:
        return <></>
    }
  }

  return (
    <>
      {!isLoading && !isCreated && (
        <Form onSubmit={formik.handleSubmit}>
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
        </Form>
      )}
      {(isLoading || isCreated) && <LoadingTokenCard />}
    </>
  )
}

export default LiquidityTokenForm
