import React, { useState } from 'react';
import styled from 'styled-components';
import { ethers } from '@ethersproject/experimental/node_modules/ethers';
import AppBody from '../AppBody';
import { CREATE_TOKEN_ADDRESS } from '../../constants/index';
import CREATE_TOKEN_ABI from '../../constants/abis/createTokenAbi.json';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    
`

const Label = styled.label`
    display: flex;
    justify-content: center;
    margin: 1rem 0 1rem 0;
    width: 100%;
`
const LabelText = styled.p`
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(#00d4a4,#008668); 
    border-radius: 30px 0 0 30px;
    padding: 0 1rem 0 1rem;
    flex: 0.4;
`

const Submit = styled.input`
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

const Inputs = styled.input`
    height: 2.5rem;
    padding: 0 1rem 0 1rem;
    border-radius: 0 30px 30px 0;
    background-color: #011724;
    color: white;
    flex: 1;
`

const CreateToken = () => {
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [decimals, setDecimals] = useState('');
    const [supply, setSupply] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const create_token_contract = new ethers.Contract(CREATE_TOKEN_ADDRESS, CREATE_TOKEN_ABI, signer);
        await create_token_contract.create(name, symbol, decimals, supply)
        const tokens_created = await create_token_contract.tokensMade();
        console.log("Your token's address is:", await create_token_contract.customTokens(tokens_created - 1));
    }
    
    return (
        <AppBody>
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
                            placeholder='Ex: 100000000000' 
                            required
                            onChange={(e) => {setSupply(e.target.value)}}
                        />
                    </Label>
                </div>
                <Submit type="submit" value="CREATE TOKEN" />
            </Form>
        </AppBody>
    );
}

export default CreateToken;