import React from 'react'
import { Text, Box } from '@koda-finance/summitswap-uikit'
import CurrencyLogo from 'components/CurrencyLogo'
import LinkBox from 'components/LinkBox'
import { Token } from '@koda-finance/summitswap-sdk'
import { RowBetween } from 'components/Row'
import expandMore from '../../img/expandMore.svg'

interface CurrencySelectorProps {
  setModalOpen: (val: boolean) => void
  selectedOutputCoin?: Token
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ setModalOpen, selectedOutputCoin }) => {
  return (
    <>
      <RowBetween>
        <h2 style={{ marginBottom: '25px' }} className="float-title">
          Output Coin
        </h2>
      </RowBetween>
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