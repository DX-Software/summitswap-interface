import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AppBody from '../AppBody';
import LiquidityTokenForm from './liquidityTokenForm';
import StandardTokenForm from './standardTokenForm';
import BabyTokenForm from './babyTokenForm';

const CreateToken = () => {
    const [tokenType, setTokenType] = useState("standard");

    return (
        <AppBody>
            <select onChange={(e) => {setTokenType(e.target.value)}} name="tokenType" id="tokenType">
                <option value="standard" selected>Standard Token</option>
                <option value="liquidity">Liquidity Generator Token</option>
                <option value="babytoken">Baby Token</option>
                <option value="buyback">Buyback Baby Token</option>
            </select>
            {tokenType === "standard" && (
                <StandardTokenForm />
            )}
            {tokenType === "liquidity" && (
                <LiquidityTokenForm />
            )}
            {tokenType === "babytoken" && (
                <BabyTokenForm />
            )}
        </AppBody>
    );
}
export default CreateToken;