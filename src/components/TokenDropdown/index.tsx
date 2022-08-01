import React, { useCallback, useState } from 'react'
import { Token, Currency } from '@koda-finance/summitswap-sdk'
import { Text, Box } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import CurrencyLogo from 'components/CurrencyLogo'
import expandMore from '../../img/expandMore.svg'

const LinkBox = styled(Box)`
  color: ${({ theme }) => theme.colors.invertedContrast};
  padding: 16px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.sidebarBackground};
  display: flex;
  align-items: center;
  > div:first-of-type {
    flex: 1;
    overflow: hidden;
    > div {
      overflow: hidden;
      max-width: calc(100% - 20px);
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
    }
  }
  > div:last-of-type {
    position: relative;
  }
`

interface CurrencySearchModalProps {
  selectedCurrency?: Token | null
  onCurrencySelect: (currency: Currency) => void
  // eslint-disable-next-line react/no-unused-prop-types
  showCommonBases?: boolean
  showETH?: boolean
  tokens?: Array<Token>
  isAddedByUserOn?: boolean
  showUnknownTokens?: boolean
  showOnlyUnknownTokens?: boolean
  disabled?: boolean
}

export default function TokenDropdown({
  selectedCurrency,
  onCurrencySelect,
  showCommonBases,
  showETH,
  tokens,
  isAddedByUserOn,
  showUnknownTokens,
  showOnlyUnknownTokens,
  disabled,
}: CurrencySearchModalProps) {
  const [modalOpen, setModalOpen] = useState(false)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <>
      <div style={{ cursor: disabled ? 'not-allowed' : 'pointer'}}>
        <LinkBox mb={4} onClick={() => !disabled && setModalOpen(true)}>
          {selectedCurrency ? (
            <>
              <CurrencyLogo currency={selectedCurrency} size="24px" style={{ marginRight: '8px' }} />
              <Box>
                <Text>{`${selectedCurrency.symbol} - ${selectedCurrency.address}`}</Text>
              </Box>
            </>
          ) : (
            <Text>Select token</Text>
          )}
          <img src={expandMore} alt="" width={24} height={24} style={{ marginLeft: '10px' }} />
        </LinkBox>
      </div>

      <CurrencySearchModal
        isOpen={modalOpen}
        onDismiss={handleDismissSearch}
        onCurrencySelect={onCurrencySelect}
        selectedCurrency={selectedCurrency}
        otherSelectedCurrency={null}
        showETH={showETH}
        tokens={tokens}
        showCommonBases={showCommonBases}
        isAddedByUserOn={isAddedByUserOn}
        showUnknownTokens={showUnknownTokens}
        showOnlyUnknownTokens={showOnlyUnknownTokens}
      />
    </>
  )
}
