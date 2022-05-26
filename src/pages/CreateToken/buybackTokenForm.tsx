import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import styled from 'styled-components';
import { useBuyBackTokenContract } from 'hooks/useContract';
import { CREATE_BUYBACK_TOKEN_ADDRESS, CREATE_TOKEN_FEE_RECEIVER_ADDRESS, ROUTER_ADDRESS } from '../../constants/index';
import CREATE_TOKEN_ABI from '../../constants/abis/createBuybackToken.json';
import { Form, Label, LabelText, BigLabelText, Submit, Inputs, MessageContainer, Message, Required } from './standardTokenForm';

export const Select = styled.select`
    height: 2.5rem;
    padding: 0 1rem 0 1rem;
    border-radius: 0 30px 30px 0;
    background-color: #011724;
    color: white;
    flex: 1;
`

const BuybackTokenForm = ({account}) => {
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [supply, setSupply] = useState('');
    const [router, setRouter] = useState('0xD99D1c33F9fC3444f8101754aBC46c52416550D1'); // PancakeSwap
    const [rewardToken, setRewardToken] = useState('');
    const [liquidityFeeBps, setLiquidityFee] = useState('2');
    const [buybackFee, setBuybackFee] = useState('3');
    const [reflectionFee, setReflectionFee] = useState('8');
    const [marketingFeeBps, setMarketingFee] = useState('1');
    const [loading, setLoading] = useState(false);
    const [created, setCreated] = useState(false);
    const [error, setError] = useState('');
    const [txAddress, setTxAddress] = useState('');

    const factory = useBuyBackTokenContract();
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (window.ethereum) {
           try{
                if (!factory){return}
                const tx = await factory.createBuybackBabyToken(
                    name,
                    symbol,
                    ethers.utils.parseUnits(supply, 9),
                    rewardToken,
                    router,
                    [
                      (parseInt(liquidityFeeBps) * 100),
                      (parseInt(buybackFee) * 100),
                      (parseInt(reflectionFee) * 100),
                      (parseInt(marketingFeeBps) * 100),
                      10000
                    ],
                    {value: ethers.utils.parseUnits("0.01")}
                );
                setLoading(true);
                setTxAddress(tx.hash)
                setLoading(false);
                setCreated(true);
            } catch {
                setError("It was not possible to create the token");
            }
        }
    }

    useEffect(() => {
        console.log(loading, created)
    }, [loading, created, txAddress])

    return (
        <>
            {!created && !loading && (
                    <Form onSubmit={(e) => {handleSubmit(e)}}>
                    <div>
                        <Label htmlFor="name"> 
                            <LabelText>
                                Name
                                <Required>*</Required>
                            </LabelText> 
                            <Inputs 
                                type="text" 
                                name="name" 
                                value={name} 
                                placeholder='Ex: Ethereum' 
                                required
                                onChange={(e) => {setName(e.target.value)}}
                            />
                        </Label>
                    </div>
                    <div>
                        <Label htmlFor="symbol"> 
                            <LabelText>
                                Symbol
                                <Required>*</Required>
                            </LabelText>  
                            <Inputs 
                                type="text" 
                                name="symbol" 
                                value={symbol} 
                                placeholder='Ex: ETH' 
                                required
                                onChange={(e) => {setSymbol(e.target.value)}}
                            />
                        </Label>
                    </div>
                    <div>
                        <Label htmlFor="supply"> 
                            <LabelText>
                                Total Supply
                                <Required>*</Required>
                            </LabelText> 
                            <Inputs 
                                type="number" 
                                name="supply" 
                                value={supply} 
                                placeholder='Ex: 10000' 
                                required
                                onChange={(e) => {setSupply(e.target.value)}}
                            />
                        </Label>
                    </div>
                    <div>
                        <Label htmlFor="rewardTokenAddress"> 
                            <BigLabelText>
                                Reward Token Address
                                <Required>*</Required>
                            </BigLabelText> 
                            <Inputs 
                                type="text" 
                                name="rewardTokenAddress" 
                                value={rewardToken} 
                                placeholder='Ex: 0x...'
                                required
                                onChange={(e) => {setRewardToken(e.target.value)}}
                            />
                        </Label>
                    </div>
                    <div>
                        <Label htmlFor="router"> 
                            <LabelText>
                                Router
                                <Required>*</Required>
                            </LabelText> 
                            <Select onChange={(e) => {setRouter(e.target.value)}} name="router" id="router">
                                <option value="0xD99D1c33F9fC3444f8101754aBC46c52416550D1" selected>PancakeSwap</option>
                                <option value={ROUTER_ADDRESS}>SummitSwap</option>
                            </Select>
                        </Label>
                    </div>
                    <div>
                        <Label htmlFor="liquidityfee"> 
                            <BigLabelText>
                                Transaction fee to generate liquidity (%)
                                <Required>*</Required>
                            </BigLabelText> 
                            <Inputs 
                                type="number" 
                                name="liquidityfee" 
                                value={liquidityFeeBps} 
                                placeholder='Ex: 1' 
                                required
                                onChange={(e) => {setLiquidityFee(e.target.value)}}
                            />
                        </Label>
                    </div>
                    <div>
                        <Label htmlFor="buybackFee"> 
                            <BigLabelText>
                                Transaction fee to generate liquidity (%)
                                <Required>*</Required>
                            </BigLabelText> 
                            <Inputs 
                                type="number" 
                                name="buybackFee" 
                                value={buybackFee} 
                                placeholder='Ex: 1' 
                                required
                                onChange={(e) => {setBuybackFee(e.target.value)}}
                            />
                        </Label>
                    </div>
                    <div>
                        <Label htmlFor="reflectionFee"> 
                            <BigLabelText>
                                Transaction fee to generate liquidity (%)
                                <Required>*</Required>
                            </BigLabelText> 
                            <Inputs 
                                type="number" 
                                name="reflectionFee" 
                                value={reflectionFee} 
                                placeholder='Ex: 1' 
                                required
                                onChange={(e) => {setReflectionFee(e.target.value)}}
                            />
                        </Label>
                    </div>
                    <div>
                        <Label htmlFor="marketingFee"> 
                            <BigLabelText>
                                Marketing fee (%)
                                <Required>*</Required>
                            </BigLabelText> 
                            <Inputs 
                                type="number" 
                                name="marketingFee" 
                                value={marketingFeeBps} 
                                placeholder='Ex: 1' 
                                required
                                onChange={(e) => {setMarketingFee(e.target.value)}}
                            />
                        </Label>
                    </div>
                    {error && <p>{error}</p>}
                    <Submit type="submit" value="CREATE TOKEN" />
                </Form>
            )}
            {loading && (
                <Message>Please wait until the transaction is complete...</Message>
            )}
            {created && (
                <MessageContainer>
                    <Message>Your token was successfully created!!</Message>
                    <Message><a href={`https://testnet.bscscan.com/tx/${txAddress}`}>View your Transaction</a></Message>
                </MessageContainer>
                
            )}
        </>
    )
}

export default BuybackTokenForm;
