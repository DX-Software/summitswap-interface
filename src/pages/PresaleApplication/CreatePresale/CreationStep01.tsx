/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { FormikProps } from 'formik'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { useWeb3React } from '@web3-react/core'
import { Token } from '@koda-finance/summitswap-sdk'
import {
  Button,
  Flex,
  Box,
  Text,
  AutoRenewIcon,
  Radio,
  ArrowForwardIcon,
  CheckmarkIcon,
} from '@koda-finance/summitswap-uikit'
import ChooseToken from 'components/ChooseToken'
import { useTokenContract } from 'hooks/useContract'
import { RowFixed } from 'components/Row'
import { TOKEN_CHOICES, PRESALE_FACTORY_ADDRESS, MAX_APPROVE_VALUE } from 'constants/presale'
import { Caption } from '../Texts'
import { PresaleDetails, FieldNames } from '../types'

const Wrapper = styled(Box)`
  width: 522px;
  min-width: 220px;
  padding: 15px;
  @media (max-width: 600px) {
    width: 90%;
  }
  @media (max-width: 400px) {
    width: 100%;
  }
`
const SelectedTokenWrapper = styled(Box)`
  background: ${({ theme }) => theme.colors.menuItemBackground};
  border: 1px solid ${({ theme }) => theme.colors.inputColor};
  padding: 15px 24px;
  border-radius: 8px;
  font-size: 10px;
`
const TextTokenDetails = styled(Text)`
  font-size: 14px;
  @media (max-width: 350px) {
    font-size: 11px;
  }
`

const Divider = styled.div`
  width: 100%;
  height: 0px;
  border: 1px solid ${({ theme }) => theme.colors.inputColor};
  margin: 16px 0;
  border-radius: 2px;
`
interface Props {
  selectedToken: Token | undefined
  changeStepNumber: (num: number) => void
  currency: string
  setCurrency: React.Dispatch<React.SetStateAction<string>>
  setSelectedToken: React.Dispatch<React.SetStateAction<Token | undefined>>
  formik: FormikProps<PresaleDetails>
}
const CreationStep01 = ({
  selectedToken,
  changeStepNumber,
  currency,
  setSelectedToken,
  setCurrency,
  formik,
}: Props) => {
  const { account, library } = useWeb3React()

  const [isFactoryApproved, setIsFactoryApproved] = useState<boolean>()
  const [tokenTotalSupply, setTokenTotalSupply] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)

  const tokenContract = useTokenContract(selectedToken?.address, true)

  useEffect(() => {
    async function fetchTotalSupply() {
      setTokenTotalSupply(
        Number(formatUnits(await tokenContract?.totalSupply(), selectedToken?.decimals)).toLocaleString()
      )
    }
    if (selectedToken && tokenContract) {
      fetchTotalSupply()
    }
  }, [tokenContract, selectedToken])

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
      console.error(err)
      setIsLoading(false)
      setIsFactoryApproved(false)
    }
  }, [tokenContract, library, account])

  const handleTokenSelect = useCallback(
    (inputCurrency) => {
      setSelectedToken(inputCurrency)
    },
    [setSelectedToken]
  )

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.id)
    formik.handleChange(e)
  }

  return (
    <Wrapper>
      <Text marginBottom="8px" fontWeight={700}>
        Select Token Address
      </Text>
      <ChooseToken
        onCurrencySelect={handleTokenSelect}
        selectedCurrency={selectedToken}
        showETH={false}
        showOnlyUnknownTokens
      />
      {selectedToken ? (
        <SelectedTokenWrapper marginLeft="2px" marginTop="16px">
          <RowFixed>
            <TextTokenDetails color="textSubtle" style={{ width: '122px' }}>
              Token Name
            </TextTokenDetails>
            <TextTokenDetails>{selectedToken.name}</TextTokenDetails>
          </RowFixed>
          <RowFixed>
            <TextTokenDetails color="textSubtle" style={{ width: '122px' }}>
              Symbol
            </TextTokenDetails>
            <TextTokenDetails>{selectedToken.symbol}</TextTokenDetails>
          </RowFixed>
          <RowFixed>
            <TextTokenDetails color="textSubtle" style={{ width: '122px' }}>
              Decimals
            </TextTokenDetails>
            <TextTokenDetails>{selectedToken.decimals}</TextTokenDetails>
          </RowFixed>
          <RowFixed>
            <TextTokenDetails color="textSubtle" style={{ width: '122px' }}>
              Total Supply
            </TextTokenDetails>
            <TextTokenDetails>{tokenTotalSupply}</TextTokenDetails>
          </RowFixed>
        </SelectedTokenWrapper>
      ) : (
        <Caption small color="textSubtle">
          Don’t have your own token?&nbsp;
          <a href="/#/create-token" rel="noopener noreferrer" target="_blank">
            <Caption color="linkColor" style={{ textDecoration: 'underline' }}>
              Create now here
            </Caption>
          </a>
        </Caption>
      )}
      <Divider />
      <Box>
        <Text marginBottom="8px" fontWeight={700}>
          Choose Currency
        </Text>
        <Flex width="180px" flexWrap="wrap" justifyContent="space-between" onChange={handleCurrencyChange}>
          {Object.keys(TOKEN_CHOICES)
            .filter((key) => key !== 'KODA')
            .map((key) => (
              <label key={key} htmlFor={key}>
                <RowFixed marginBottom="5px">
                  <Radio
                    scale="sm"
                    name={FieldNames.paymentToken}
                    value={TOKEN_CHOICES[key]}
                    id={key}
                    checked={currency === key}
                  />
                  <Text marginLeft="5px">{key}</Text>
                </RowFixed>
              </label>
            ))}
        </Flex>
      </Box>
      <Caption small color="textSubtle" marginBottom="20px">
        Participant will pay with&nbsp;
        <Caption small color="primary" fontWeight={700}>
          {currency}&nbsp;
        </Caption>
        for your token
      </Caption>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        {isFactoryApproved ? (
          <>
            <Button
              size="md"
              width="95%"
              marginBottom="8px"
              endIcon={<ArrowForwardIcon color="currentColor" />}
              onClick={() => changeStepNumber(1)}
            >
              Continue
            </Button>
            <RowFixed>
              <Caption color="linkColor">
                <CheckmarkIcon color="linkColor" height="9px" />
                &nbsp;Token Approved
              </Caption>
            </RowFixed>
          </>
        ) : (
          <Button
            variant="tertiary"
            size="md"
            width="95%"
            disabled={!selectedToken || isLoading || isFactoryApproved}
            onClick={onApproveTokenHandler}
            endIcon={isLoading && !isFactoryApproved && <AutoRenewIcon spin color="currentColor" />}
          >
            Approve Token
          </Button>
        )}
      </Flex>
    </Wrapper>
  )
}

export default CreationStep01
