import React, { useCallback, useState } from 'react'
import login from 'utils/login'
import { useWeb3React } from '@web3-react/core'
import { Button, Flex, useWalletModal } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'
import { Option } from 'react-dropdown'
import { TranslateString } from 'utils/translateTextHelpers'
import { TokenType, STANDARD_TOKEN_OPTION, LIQUIDITY_TOKEN_OPTION } from '../../constants/createToken'
import { StyledDropdownWrapper } from './components'
import { CreatedTokenDetails } from './types'
import TokenDetails from './TokenDetails'
import StandardTokenForm from './StandardTokenForm'
import LiquidityTokenForm from './LiquidityTokenForm'

const FlexDropdown = styled(Flex)`
  width: 85%;
  @media (min-width: 500px) {
    width: 436px;
  }
`

const CreateToken = () => {
  const { account, activate, deactivate } = useWeb3React()
  const [showTokenDropdown, setShowTokenDropdown] = useState(true)
  const [createdTokenDetails, setCreatedTokenDetails] = useState<CreatedTokenDetails>()

  const [tokenType, setTokenType] = useState<Option>(STANDARD_TOKEN_OPTION)

  const handleLogin = useCallback(
    (connectorId: string) => {
      login(connectorId, activate)
    },
    [activate]
  )

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)
  return createdTokenDetails ? (
    <TokenDetails tokenDetails={createdTokenDetails} setCreatedTokenDetails={setCreatedTokenDetails} />
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
                options={[STANDARD_TOKEN_OPTION, LIQUIDITY_TOKEN_OPTION]}
                onChange={(option: Option) => {
                  setTokenType(option)
                }}
              />
            )}
          </FlexDropdown>
          {tokenType.value === TokenType.Standard && (
            <StandardTokenForm
              setCreatedTokenDetails={setCreatedTokenDetails}
              setShowTokenDropdown={setShowTokenDropdown}
            />
          )}
          {tokenType.value === TokenType.Liquidity && (
            <LiquidityTokenForm
              setCreatedTokenDetails={setCreatedTokenDetails}
              setShowTokenDropdown={setShowTokenDropdown}
            />
          )}
        </>
      )}
    </>
  )
}
export default CreateToken
