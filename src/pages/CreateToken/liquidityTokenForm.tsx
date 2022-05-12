import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import styled from 'styled-components';
import { CREATE_TOKEN_ADDRESS, CREATE_TOKEN_FEE_RECEIVER_ADDRESS, ROUTER_ADDRESS } from '../../constants/index';
import CREATE_TOKEN_ABI from '../../constants/abis/createTokenAbi.json';
import { Form, Label, LabelText, BigLabelText, Submit, Inputs, MessageContainer, Message } from './standardTokenForm';

export const Select = styled.select`
    height: 2.5rem;
    padding: 0 1rem 0 1rem;
    border-radius: 0 30px 30px 0;
    background-color: #011724;
    color: white;
    flex: 1;
`

const LiquidityTokenForm = () => {
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [supply, setSupply] = useState('');
    const [router, setRouter] = useState('0xD99D1c33F9fC3444f8101754aBC46c52416550D1');
    const [charityAddress, setCharityAddress] = useState('');
    const [taxFeeBps, setTaxFeeBps] = useState('');
    const [liquidityFeeBps, setLiquidityFee] = useState('');
    const [charityFeeBps, setCharityFee] = useState('');
    const [loading, setLoading] = useState(false);
    const [created, setCreated] = useState(false);
    const [error, setError] = useState('');
    const [tokenAddress, setTokenAddress] = useState('');
    const [txAddress, setTxAddress] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const create_token_contract = new ethers.Contract(CREATE_TOKEN_ADDRESS, CREATE_TOKEN_ABI, signer);
            console.log({name, symbol, supply, router, charityAddress, taxFeeBps, liquidityFeeBps, charityFeeBps, CREATE_TOKEN_FEE_RECEIVER_ADDRESS, CREATE_TOKEN_ADDRESS})
            try{
                const tx = await create_token_contract.createLiquidityToken(
                    name,
                    symbol,
                    ethers.utils.parseUnits(supply, 9),
                    router, 
                    (charityAddress !== '' ? charityAddress : '0x0000000000000000000000000000000000000000'),
                    (parseInt(taxFeeBps) * 100),
                    (parseInt(liquidityFeeBps) * 100),
                    (parseInt(charityFeeBps !== '' ? charityFeeBps : '0') * 100),
                    CREATE_TOKEN_FEE_RECEIVER_ADDRESS,
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
    }, [loading, created, txAddress, tokenAddress])

    return (
        <>
            {!created && !loading && (
                    <Form onSubmit={(e) => {handleSubmit(e)}}>
                    <div>
                        <Label htmlFor="name"> 
                            <LabelText>
                                Name
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
                        <Label htmlFor="router"> 
                            <LabelText>
                                Router
                            </LabelText> 
                            <Select onChange={(e) => {setRouter(e.target.value)}} name="router" id="router">
                                <option value="0xD99D1c33F9fC3444f8101754aBC46c52416550D1" selected>PancakeSwap</option>
                                <option value={ROUTER_ADDRESS}>SummitSwap</option>
                            </Select>
                        </Label>
                    </div>
                    <div>
                        <Label htmlFor="supply"> 
                            <BigLabelText>
                                Charity Address
                            </BigLabelText> 
                            <Inputs 
                                type="text" 
                                name="charityAddress" 
                                value={charityAddress} 
                                placeholder='Ex: 0x...' 
                                onChange={(e) => {setCharityAddress(e.target.value)}}
                            />
                        </Label>
                    </div>
                    <div>
                        <Label htmlFor="supply"> 
                            <BigLabelText>
                                Transaction fee to generate yield (%)
                            </BigLabelText> 
                            <Inputs 
                                type="number" 
                                name="taxfee" 
                                value={taxFeeBps} 
                                placeholder='Ex: 1' 
                                required
                                onChange={(e) => {setTaxFeeBps(e.target.value)}}
                            />
                        </Label>
                    </div>
                    <div>
                        <Label htmlFor="supply"> 
                            <BigLabelText>
                                Transaction fee to generate liquidity (%)
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
                        <Label htmlFor="supply"> 
                            <BigLabelText>
                                Charity/Marketing percent (%)
                            </BigLabelText>
                            <Inputs 
                                type="number" 
                                name="charityfee" 
                                value={charityFeeBps} 
                                placeholder='Ex: 1' 
                                onChange={(e) => {setCharityFee(e.target.value)}}
                            />
                        </Label>
                    </div>
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
// const [charityFeeBps, setCharityFee] = useState('');

export default LiquidityTokenForm;
