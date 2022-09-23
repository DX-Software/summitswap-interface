import React, { useCallback, useState } from 'react'
import { Token, Currency } from '@koda-finance/summitswap-sdk'
import { Text, Box } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'

const LinkBox = styled(Box)`
  color: ${({ theme }) => theme.colors.invertedContrast};
  padding-left: 16px;
  border-radius: 16px;
  height: 38px;
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
const ChangeBox = styled(Box)`
  width: 90px;
  height: 100%;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.colors.sidebarActiveColor};
  border-radius: 0px 16px 16px 0px;
  align-items: center;
  cursor: pointer;
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

export default function ChooseToken({
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
      <div style={{ cursor: disabled ? 'not-allowed' : 'auto' }}>
        <LinkBox>
          <Box>
            <Text small color={(!selectedCurrency && 'textDisabled') || ''}>
              {selectedCurrency ? selectedCurrency.address : 'Choose token'}
            </Text>
          </Box>
          <ChangeBox onClick={() => !disabled && setModalOpen(true)}>
            <Text small fontWeight={700}>
              {selectedCurrency ? 'Change' : 'Choose'}
            </Text>
          </ChangeBox>
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
