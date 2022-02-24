import React from 'react'
import { Text, Box } from '@summitswap-uikit'
import CurrencyLogo from 'components/CurrencyLogo'
import LinkBox from 'components/LinkBox'
import { Token } from '@summitswap-libs'
import expandMore from '../../img/expandMore.svg'

interface CurrencySelectorProps {
    setModalOpen: (val: boolean) => void;
    selectedOutputCoin?: Token;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({setModalOpen, selectedOutputCoin}) => {
  return (
    <>
      <Text mb="8px" bold>
        Output Coin
      </Text>
      <LinkBox mb={4} onClick={() => setModalOpen(true)} style={{ cursor: 'pointer' }}>
        <CurrencyLogo currency={selectedOutputCoin} size="24px" style={{ marginRight: '8px' }} />
        <Box>
          <Text>{`${selectedOutputCoin?.symbol} - ${selectedOutputCoin?.address}`}</Text>
        </Box>
        <img src={expandMore} alt="" width={24} height={24} style={{ marginLeft: '10px' }} />
      </LinkBox>
    </>
  )
}

export default CurrencySelector