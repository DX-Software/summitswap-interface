import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import styled from 'styled-components';
import { CREATE_STANDARD_TOKEN_ADDRESS, CREATE_TOKEN_FEE_RECEIVER_ADDRESS } from '../../constants/index';
import CREATE_TOKEN_ABI from '../../constants/abis/createStandardToken.json';


export const Form = styled.form`
    display: flex;
    flex-direction: column;
`
export const Label = styled.label`
    display: flex;
    justify-content: center;
    margin: 1rem 0 1rem 0;
    width: 100%;
`
export const LabelText = styled.p`
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(#00d4a4,#008668); 
    border-radius: 30px 0 0 30px;
    padding: 0 1rem 0 1rem;
    flex: 0.4;
`
export const BigLabelText = styled.p`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.8rem;
    background: linear-gradient(#00d4a4,#008668); 
    border-radius: 30px 0 0 30px;
    padding: 0 1rem 0 1rem;
    flex: 0.4;
`

export const Submit = styled.input`
    color: white;
    background: linear-gradient(#00d4a4,#008668); 
    width: 30%;
    height: 2.5rem;
    margin: 1rem auto;
    border-radius: 30px;
    box-shadow: 0px 0px 10px 1px grey;
    transition: 0.5s;
    :hover {
        opacity: 0.75;
        cursor: pointer;
    }
`
export const Inputs = styled.input`
    height: 2.5rem;
    padding: 0 1rem 0 1rem;
    border-radius: 0 30px 30px 0;
    background-color: #011724;
    color: white;
    flex: 1;
`
export const MessageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100px;
`

export const Message = styled.p`
    font-size: 1.2rem;
    a {
        text-decoration: underline #00d4a4;
        :hover {
            cursor: pointer;
            color: #00d4a4;
            text-decoration: none;
        }
    }
`

const StandardTokenForm = () => {
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [supply, setSupply] = useState('');
    const [decimals, setDecimals] = useState('');
    const [loading, setLoading] = useState(false);
    const [created, setCreated] = useState(false);
    const [error, setError] = useState('');
    const [txAddress, setTxAddress] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const create_token_contract = new ethers.Contract(CREATE_STANDARD_TOKEN_ADDRESS, CREATE_TOKEN_ABI, signer);
            console.log({name, symbol, decimals, supply, CREATE_TOKEN_FEE_RECEIVER_ADDRESS, CREATE_STANDARD_TOKEN_ADDRESS})
            try{
                const tx = await create_token_contract.createStandardToken(name, symbol, decimals, ethers.utils.parseUnits(supply), CREATE_TOKEN_FEE_RECEIVER_ADDRESS, {value: ethers.utils.parseUnits("0.01")});
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
                        <Label htmlFor="decimals"> 
                            <LabelText>
                                Decimals
                            </LabelText>  
                            <Inputs 
                                type="number" 
                                name="decimals" 
                                value={decimals} 
                                placeholder='Ex: 18' 
                                required
                                onChange={(e) => {setDecimals(e.target.value)}}
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

export default StandardTokenForm;
