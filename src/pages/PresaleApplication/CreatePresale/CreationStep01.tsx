/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { BigNumber } from 'ethers'
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

export const Caption = styled(Text)`
  font-size: 12px;
  line-height: 18px;
  display: inline-block;
`
export const XSmallText = styled(Text)`
  font-size: 10px;
  line-height: 16px;
`

const Wrapper = styled(Box)`
  width: 522px;
  background: ${({ theme }) => theme.colors.menuItemBackground};
  border: 1px solid ${({ theme }) => theme.colors.inputColor};
  border-radius: 24px;
  padding: 15px;
`
const Divider = styled.div`
  width: 473px;
  height: 0px;
  border: 1px solid ${({ theme }) => theme.colors.inputColor};
  margin: 16px 0;
  border-radius: 2px;
`
interface Props {
  changeStepNumber: (num: number) => void
}
const CreationStep01 = ({ changeStepNumber }: Props) => {
  const { account, library } = useWeb3React()

  const [selectedToken, setSelectedToken] = useState<Token>()
  const [isFactoryApproved, setIsFactoryApproved] = useState<boolean>()
  const [isLoading, setIsLoading] = useState(false)

  const tokenContract = useTokenContract(selectedToken?.address, true)

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

  const handleTokenSelect = useCallback((inputCurrency) => {
    setSelectedToken(inputCurrency)
  }, [])

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
        <Box marginLeft="2px" marginTop="16px">
          <RowFixed>
            <Text small color="textSubtle" style={{ width: '122px' }}>
              Token Name
            </Text>
            <Text small>{selectedToken.name}</Text>
          </RowFixed>
          <RowFixed>
            <Text small color="textSubtle" style={{ width: '122px' }}>
              Symbol
            </Text>
            <Text small>{selectedToken.symbol}</Text>
          </RowFixed>
          <RowFixed>
            <Text small color="textSubtle" style={{ width: '122px' }}>
              Decimals
            </Text>
            <Text small>{selectedToken.decimals}</Text>
          </RowFixed>
        </Box>
      ) : (
        <Flex marginLeft="2px" marginTop="4px">
          <Caption small color="textSubtle">
            Don’t have your own token?&nbsp;
          </Caption>
          <a href="/#/create-token" rel="noopener noreferrer" target="_blank">
            <Caption color="linkColor" style={{ textDecoration: 'underline' }}>
              Create now here
            </Caption>
          </a>
        </Flex>
      )}
      <Divider />
      <Box>
        <Text marginBottom="8px" fontWeight={700}>
          Choose Currency
        </Text>
        <Flex width="180px" flexWrap="wrap" justifyContent="space-between">
          {Object.keys(TOKEN_CHOICES)
            .filter((key) => key !== 'KODA')
            .map((key) => (
              <label key={key} htmlFor={key}>
                <RowFixed marginBottom="5px">
                  <Radio scale="sm" name={key} value={TOKEN_CHOICES[key]} id={key} />
                  <Text marginLeft="5px">{key}</Text>
                </RowFixed>
              </label>
            ))}
        </Flex>
      </Box>
      <Caption small color="textSubtle" marginBottom="20px">
        Participant will pay with&nbsp;
        <Caption small color="primary" fontWeight={700}>
          BNB&nbsp;
          {/* TODO:: change this BNB when change currency */}
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
