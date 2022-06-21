import React, { useCallback, useState } from 'react'
import login from 'utils/login'
import { useWeb3React } from '@web3-react/core'
import { Button, Flex, useWalletModal } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'
import { Option } from 'react-dropdown'
import { TranslateString } from 'utils/translateTextHelpers'
import { TokenType } from '../../constants'
import StandardTokenForm from './StandardTokenForm'
import LiquidityTokenForm from './LiquidityTokenForm'
import { useToken } from '../../hooks/Tokens'
import TokenDashboard from './TokenDashboard'
import { StyledDropdownWrapper } from './components'

const FlexDropdown = styled(Flex)`
  width: 85%;
  @media (min-width: 500px) {
    width: 436px;
  }
`

const CreateToken = () => {
  const { account, activate, deactivate } = useWeb3React()
  const [showTokenDropdown, setShowTokenDropdown] = useState(true)
  const [tokenAddress, setTokenAddress] = useState('') // 0xF87cE0ea6612C6A362f45ccbdaf56C3a8363e5a2
  const [txAddress, setTxAddress] = useState('')
  const [totalSupply, setTotalSupply] = useState('')

  const [tokenType, setTokenType] = useState<Option>({
    value: TokenType.Standard,
    label: `${TokenType.Standard} Token`,
  })

  const token = useToken(tokenAddress)

  const handleLogin = useCallback(
    (connectorId: string) => {
      login(connectorId, activate)
    },
    [activate]
  )

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)
  return token ? (
    <TokenDashboard txAddress={txAddress} tokenSupply={totalSupply} token={token} />
  ) : (
    <>
      {!account && (
        <>
          <Flex mb={3} mt={40} justifyContent="center">
            <Button style={{ fontFamily: 'Poppins' }} onClick={onPresentConnectModal}>
              {TranslateString(292, 'CONNECT WALLET')}
            </Button>
          </Flex>
        </>
      )}
      {account && (
        <>
          <FlexDropdown mb={3} mt={3} justifyContent="center">
            {showTokenDropdown && (
              <StyledDropdownWrapper
                value={tokenType}
                options={[
                  {
                    value: TokenType.Standard,
                    label: `${TokenType.Standard} Token`,
                  },
                  {
                    value: TokenType.Liquidity,
                    label: `${TokenType.Liquidity} Token`,
                  },
                ]}
                onChange={(option: Option) => {
                  setTokenType(option)
                }}
              />
            )}
          </FlexDropdown>
          {tokenType.value === TokenType.Standard && (
            <StandardTokenForm
              setShowTokenDropdown={setShowTokenDropdown}
              setTotalSupply={setTotalSupply}
              setTxAddress={setTxAddress}
              setTokenAddress={setTokenAddress}
            />
          )}
          {tokenType.value === TokenType.Liquidity && (
            <LiquidityTokenForm
              setTotalSupply={setTotalSupply}
              setTxAddress={setTxAddress}
              setShowTokenDropdown={setShowTokenDropdown}
              setTokenAddress={setTokenAddress}
              account={account}
            />
          )}
        </>
      )}
    </>
  )
}
export default CreateToken
