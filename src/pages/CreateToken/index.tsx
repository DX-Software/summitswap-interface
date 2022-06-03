import React, { useCallback, useState } from 'react' 
import login from 'utils/login' 
import { useWeb3React } from '@web3-react/core' 
import { Button, Flex, useWalletModal } from '@koda-finance/summitswap-uikit' 
import { TranslateString } from 'utils/translateTextHelpers' 
import AppBody from '../AppBody' 
import LiquidityTokenForm from './liquidityTokenForm' 
import StandardTokenForm from './standardTokenForm' 
import BabyTokenForm from './babyTokenForm' 
import BuybackTokenForm from './buybackTokenForm' 


const CreateToken = () => {
    const { account, activate, deactivate } = useWeb3React() 

    const [tokenType, setTokenType] = useState("standard") 

    const handleLogin = useCallback(
      (connectorId: string) => {
        login(connectorId, activate)
      },
      [activate]
    )
    
    const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string) 

    return (
        <AppBody>
            {!account && (
              <>
                <Flex mb={3} justifyContent="center">
                  <Button style={{ fontFamily: 'Poppins' }} onClick={onPresentConnectModal}>
                    {TranslateString(292, 'CONNECT WALLET')}
                  </Button>
                </Flex>
              </>
            )}
            {account && (
              <>
                <Flex mb={3} mt={3} justifyContent="center">
                  <select defaultValue="standard" onChange={(e) => {setTokenType(e.target.value)}} name="tokenType" id="tokenType">
                    <option value="standard">Standard Token</option>
                    <option value="liquidity">Liquidity Generator Token</option>
                    <option value="babytoken">Baby Token</option>
                    <option value="buyback">Buyback Baby Token</option>
                  </select>
                </Flex>
                {tokenType === "standard" && (
                    <StandardTokenForm />
                )}
                {tokenType === "liquidity" && (
                    <LiquidityTokenForm account={account} />
                )}
                {tokenType === "babytoken" && (
                    <BabyTokenForm account={account} />
                )}
                {tokenType === "buyback" && (
                    <BuybackTokenForm account={account} />
                )}
              </>
            )}
        </AppBody>
    ) 
}
export default CreateToken 