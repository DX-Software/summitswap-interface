import React, { useState } from 'react'
import { Text, Box, Button, Flex } from '@summitswap-uikit'
import { Token } from '@summitswap-libs'
import styled from 'styled-components'

import { useReferralContract } from 'hooks/useContract'
import { Contract } from 'ethers'
import { isAddress } from '../../../utils'

const StyledInput = styled.input`
  color: ${({ theme }) => theme.colors.invertedContrast};
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 12px;
  padding-bottom: 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.sidebarBackground};
  width: 100%;
`

const StyledBr = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
  height: 3px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.sidebarBackground};
`

const StyledWhiteBr = styled.div`
  margin-top: 4px;
  margin-bottom: 24px;
  height: 1px;
  border-radius: 50%;
  background-color: #fff;
`

const Center = styled(Flex)`
  justify-content: center;
`

interface CoinManagerSegmentProps {
  selectedCoin?: Token
}

interface SectionProps {
  contract: Contract | null;
  selectedCoin?: Token;
}

const CoinManagerSegment: React.FC<CoinManagerSegmentProps> = ({selectedCoin}) => {

  const refContract = useReferralContract(true)

  console.log(selectedCoin)

  return <>
    <SetFirstBuyFee contract={refContract} selectedCoin={selectedCoin} />
    <SetLeadManager contract={refContract} selectedCoin={selectedCoin} />
    <RemoveLead contract={refContract} selectedCoin={selectedCoin} />
  </>
}

const SetFirstBuyFee: React.FC<SectionProps> = ({contract}) => {
  return <>
    <Text bold>
      Set first buy fee
    </Text>
    <StyledWhiteBr />
    <Box>
      <Text mb="4px" small>
        Fee value
      </Text>
      <StyledInput />
      <Box style={{marginTop: '12px'}}>
        <Button>Submit</Button>
      </Box>
    </Box>
    <StyledBr />
  </>
}

const SetLeadManager: React.FC<SectionProps> = ({contract, selectedCoin}) => {
  return <>
    <Text bold>
      Set Lead Influencer
    </Text>
    <StyledWhiteBr />
    <Box>
      <Text mb="4px" small>
        Influencer wallet address
      </Text>
      <StyledInput />
      <Text mb="4px" small>
        Lead fee
      </Text>
      <StyledInput />
      <Box style={{marginTop: '12px'}}>
        <Button>Submit</Button>
      </Box>
    </Box>
    <StyledBr />
  </>
}

const RemoveLead: React.FC<SectionProps> = ({contract, selectedCoin}) => {

  const [influncerWallet, setInfluncerWallet] = useState('');

  const removeLead = async () => {  
    if (!contract) return
    if (isAddress(influncerWallet)) {
      try {
        await contract.removeSubInfluencer(selectedCoin, influncerWallet)
      } catch(e) {
        alert("Can't run transaction!")
      }
    } else {
      alert('Invalid wallet address!')
    }
  }

  return <>
    <Text bold>
      Remove Lead Influencer
    </Text>
    <StyledWhiteBr />
    <Box>
      <Text mb="4px" small>
        Influencer wallet address
      </Text>
      <StyledInput value={influncerWallet} onChange={(e) => {
        const newValue = e.target.value
        setInfluncerWallet(newValue)
      }}/>
      <Box style={{marginTop: '12px'}}>
        <Button onChange={removeLead}>Submit</Button>
      </Box>
    </Box>
    <StyledBr />
  </>

}

export default CoinManagerSegment