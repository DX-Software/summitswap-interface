import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import styled from 'styled-components';
import { useLiquidityTokenContract } from 'hooks/useContract';
import { CREATE_TOKEN_FEE_RECEIVER_ADDRESS, ROUTER_ADDRESS } from '../../constants/index';
import { Form, Label, LabelText, BigLabelText, Submit, Inputs, MessageContainer, Message, Required, Relative, Error } from './standardTokenForm';


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
    const [router, setRouter] = useState('0xD99D1c33F9fC3444f8101754aBC46c52416550D1'); // PancakeSwap
    const [charityAddress, setCharityAddress] = useState('');
    const [taxFeeBps, setTaxFeeBps] = useState('');
    const [liquidityFeeBps, setLiquidityFee] = useState('');
    const [charityFeeBps, setCharityFee] = useState('');
    const [loading, setLoading] = useState(false);
    const [created, setCreated] = useState(false);
    const [error, setError] = useState('');
    const [txAddress, setTxAddress] = useState('');
    const [verified, setVerified] = useState(false);

    const factory = useLiquidityTokenContract();
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (window.ethereum) {
            try{
                if (!factory){return}
                const tx = await factory.createLiquidityToken(
                    name,
                    symbol,
                    ethers.utils.parseUnits(supply, 9),
                    router, 
                    (charityAddress !== '' ? charityAddress : '0x0000000000000000000000000000000000000000'),
                    (parseInt(taxFeeBps) * 100),
                    (parseInt(liquidityFeeBps) * 100),
                    (parseInt(charityFeeBps !== '' ? charityFeeBps : '0') * 100),
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

    const verifyAddress = async (address) => {
      try {
        ethers.utils.getAddress(address)
        setVerified(true)
      } catch {
        console.log('false')
        setVerified(false)
      }
    }

    useEffect(() => {
        console.log(loading, created)
    }, [loading, created, txAddress, verified])

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
                    <Relative>
                        <Label htmlFor="charityAddress"> 
                            <BigLabelText>
                                Charity Address
                            </BigLabelText> 
                            <Inputs
                                type="text" 
                                name="charityAddress" 
                                value={charityAddress} 
                                placeholder='Ex: 0x...' 
                                onChange={(e) => {setCharityAddress(e.target.value); verifyAddress(e.target.value)}}
                            />
                        </Label>
                    </Relative>
                    <Relative>
                        <Label htmlFor="taxfee"> 
                            <BigLabelText>
                                Transaction fee to generate yield (%)
                                <Required>*</Required>
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
                    </Relative>
                    <Relative>
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
                    </Relative>
                    <Relative>
                        {(parseInt(charityFeeBps) > 25 && parseInt(charityFeeBps) + parseInt(liquidityFeeBps) + parseInt(taxFeeBps) <= 25) && (
                          <Error>Charity fee has to be less or equal to 25</Error>
                        )}
                        {(verified && parseInt(charityFeeBps) <= 0) && (
                          <Error>Charity Fee cant be 0 if you have a charity address</Error>
                        )}
                        {(verified && charityFeeBps === '') && (
                          <Error>Charity Fee cant be empty if you have a charity address</Error>
                        )}
                        <Label htmlFor="charityfee"> 
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
                    </Relative>
                    {error && <p>{error}</p>}
                    <Relative>
                      {(parseInt(charityFeeBps) || 0) + (parseInt(liquidityFeeBps) || 0) + (parseInt(taxFeeBps) || 0) > 25 && (
                            <Error>The fees combined cannot be larger than 25%</Error>
                      )}
                    </Relative>
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
