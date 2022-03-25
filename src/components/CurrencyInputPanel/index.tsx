import React, { useState, useCallback } from 'react'
import { Text, Flex, Button } from '@koda-finance/summitswap-uikit'
import { Currency, Pair, Token  } from '@koda-finance/summitswap-sdk'
import { MetamaskIcon } from 'img/Svg'
import styled from 'styled-components'
import { darken } from 'polished'
import expandMore from 'img/expandMore.svg'
import { isAddress } from 'utils'

import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween } from '../Row'
import { Input } from '../NumericalInput'
import { useActiveWeb3React } from '../../hooks'
import TranslatedText from '../TranslatedText'
import { TranslateString } from '../../utils/translateTextHelpers'
import CopyButton  from '../CopyButton'
import { registerToken } from '../../connectors/index'

const NumericalInput = styled(Input)`
  text-align: left;
  padding: 20px 0px;
  width: 100%;
`

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 0.5rem' : '0rem 1.5rem 1.5rem 2rem')};
`

const CurrencySelect = styled.button<{ selected: boolean }>`
  margin-top: 20px;
  align-items: center;
  height: 38px;
  font-size: 16px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.colors.dropdownBackground};
  color: ${({ selected, theme }) => (selected ? theme.colors.sidebarColor : '#FFFFFF')};
  border-radius: 8px;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0.2rem 1rem;
`

const LabelRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 1.5rem 3rem 0 2rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.colors.textSubtle)};
  }
`

const Aligner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.colors.background};
  z-index: 1;
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.menuItemBackground};
  box-shadow: ${({ theme }) => theme.shadows.inset};
`

const CurrencyText = styled(Text)`
  align-self: center;
  @media (max-width:480px) {
    font-size: 12px !important;
  } 
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  isSwap?: boolean
  price?: string
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = TranslateString(132, 'Input'),
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  isSwap,
  price,
}: CurrencyInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const { account,library } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
 
  const token = pair ? pair.liquidityToken : currency instanceof Token ? currency: null

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <InputPanel id={id}>
      <Container hideInput={hideInput}>
        {!hideInput && (
          <LabelRow>
            <RowBetween>
              <Text fontSize="14px" color="sidebarColor" style={{ fontSize: 16, fontWeight: 600 }}>
                {label}
              </Text>
              {account && isSwap && (
                <Text color='sidebarColor' onClick={onMax} fontSize="14px" style={{ display: 'inline', cursor: 'pointer' }}>
                  {!hideBalance && !!currency
                    ? `Balance: ${selectedCurrencyBalance?.toSignificant(6) ?? "Loading..."}`
                    : ' -'}
                </Text>
              )}
              {isSwap && (
                <Text color="#237745" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  {price}
                </Text>
              )}
            </RowBetween>
          </LabelRow>
        )}
        <InputRow
          style={
            hideInput ? { padding: '0', borderRadius: '8px' } : {}
          }
          selected={disableCurrencySelect}
        >
          {!hideInput && (
            <div style={{ flex: 1 }}>
              <NumericalInput
                className="token-amount-input"
                value={value}
                onUserInput={(val) => {
                  onUserInput(val)
                }}
              />
              {account && currency && showMaxButton && label !== 'To' && (
                <Button onClick={onMax} scale="xxs" variant="tertiary">
                  MAX
                </Button>
              )}
            </div>
          )}
          <CurrencySelect
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true)
              }
            }}
          >
            
            <Aligner>
              <Flex minWidth='75px'>
                {pair ? (
                  <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
                ) : currency ? (
                  <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
                ) : null}
                {pair ? (
                  <CurrencyText id="pair" color='sidebarColor' style={{ fontSize: '16px', fontWeight: 600 }}>
                    {pair?.token0.symbol}:{pair?.token1.symbol}
                  </CurrencyText>
                ) : (
                  <CurrencyText id="pair" color='sidebarColor' style={{ fontSize: '16px', fontWeight: 600 }}>
                    {(currency && currency.symbol && currency.symbol.length > 20
                      ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                        currency.symbol.length - 5,
                        currency.symbol.length
                      )}`
                      : currency?.symbol) || <TranslatedText translationId={82}>Select a currency</TranslatedText>}
                  </CurrencyText>
                )}
              </Flex>
              {!disableCurrencySelect && (
                <img src={expandMore} alt="" width={24} height={24} style={{ marginLeft: '10px' }} />
              )}
            </Aligner>
          </CurrencySelect>
          {token && token.symbol && isAddress(token.address) ? (
            <Flex style={{ gap: '4px' }} alignItems="center">
              <CopyButton
                width="16px"
                buttonColor="textSubtle"
                text={token.address}
                tooltipMessage="Token address copied"
                tooltipTop={-20}
                tooltipRight={40}
                tooltipFontSize={12}
                
              /> 
                {library?.provider?.isMetaMask && (

              <MetamaskIcon
                  style={{ cursor: 'pointer' }}
                  width="16px"
                  onClick={() => registerToken(token)}
            /> 
                 )}
            
             
            </Flex>
          ) : null}
        </InputRow>
      </Container>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </InputPanel>
  )
}
