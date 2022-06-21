import React, { useState } from 'react'
import { Token } from '@koda-finance/summitswap-sdk'
import { Button, Text } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'
import copyText from 'utils/copyText'
import Tooltip from 'components/Tooltip'
import { AutoRow, RowFlatCenter } from '../../components/Row'

export const TokenCard = styled.div`
  margin-top: 30px;
  background: #011724;
  border-radius: 20px;
  padding: 25px 28px;
  width: 90%;
  max-width: 1200px;
`

const TextTokenHeading = styled(Text)`
  font-weight: 700;
  font-size: 23px;
  font-weight: 700;
  line-height: 45px;
  width: 230px;
  min-width: 230px;
  @media (max-width: 550px) {
    font-size: 16px;
    width: 160px;
    min-width: 160px;
  }
  @media (max-width: 380px) {
    font-size: 11px;
    width: 100px;
    min-width: 100px;
  }
`
const TextTokenValue = styled(Text)`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-size: 21px;
  line-height: 36px;
  color: #00d5a5;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (max-width: 550px) {
    font-size: 15px;
  }
  @media (max-width: 380px) {
    font-size: 10px;
  }
`

const Row = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: 10px;
`

interface Props {
  token: Token
  tokenSupply: string
  txAddress: string
}

export default function TokenDashboard({ token, tokenSupply, txAddress }: Props) {
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)

  const displayTooltip = () => {
    setIsTooltipDisplayed(true)
    setTimeout(() => {
      setIsTooltipDisplayed(false)
    }, 1000)
  }
  return (
    <>
      <RowFlatCenter>
        <Text textAlign="center" mt={40} marginX={2} fontSize="35px" fontWeight={700} fontFamily="Poppins">
          Your token has been created!
        </Text>
      </RowFlatCenter>
      <TokenCard>
        <Row>
          <TextTokenHeading>Name:</TextTokenHeading>
          <TextTokenValue>{token.name}</TextTokenValue>
        </Row>
        <Row>
          <TextTokenHeading>Symbol:</TextTokenHeading>
          <TextTokenValue>{token.symbol}</TextTokenValue>
        </Row>
        <Row>
          <TextTokenHeading>Total Supply:</TextTokenHeading>
          <TextTokenValue>{tokenSupply}</TextTokenValue>
        </Row>
        <Row>
          <TextTokenHeading>Token Address:</TextTokenHeading>
          <TextTokenValue>{token.address}</TextTokenValue>
        </Row>
        <AutoRow justifyContent="space-evenly">
          <a href={`https://testnet.bscscan.com/tx/${txAddress}`} rel="noreferrer" target="_blank">
            <Button
              scale="sm"
              mb={20}
              marginX="5px"
              style={{ minWidth: '200px', fontFamily: 'Poppins' }}
              onClick={displayTooltip}
            >
              View Transaction
            </Button>
          </a>
          <Tooltip text="Address Copied" show={isTooltipDisplayed}>
            <Button
              disabled={isTooltipDisplayed}
              marginX="5px"
              scale="sm"
              mb={20}
              style={{ minWidth: '200px', fontFamily: 'Poppins' }}
              onClick={() => copyText(token.address, displayTooltip)}
            >
              Copy Address
            </Button>
          </Tooltip>
          <Button
            mb={20}
            marginX="5px"
            scale="sm"
            style={{ minWidth: '200px', fontFamily: 'Poppins' }}
            onClick={() => {
              // TODO:: merge it  with presale and add functionality
            }}
          >
            Create Presale
          </Button>
        </AutoRow>
      </TokenCard>
    </>
  )
}
