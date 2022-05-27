import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useFormik } from 'formik';
import styled from 'styled-components';
import { useLiquidityTokenContract } from 'hooks/useContract';
import { ROUTER_ADDRESS } from '../../constants/index';
import { Form, Label, LabelText, BigLabelText, Submit, Inputs, MessageContainer, Message, Required, Relative, Error, Disabled } from './standardTokenForm';


export const Select = styled.select`
    height: 2.5rem;
    padding: 0 1rem 0 1rem;
    border-radius: 0 30px 30px 0;
    background-color: #011724;
    color: white;
    flex: 1;
`

export const verifyAddress = async (address) => {
  try {
    ethers.utils.getAddress(address)
    return true
  } catch {
    return false
  }
}

const LiquidityTokenForm = ({account}) => {
    const [loading, setLoading] = useState(false);
    const [created, setCreated] = useState(false);
    const [txAddress, setTxAddress] = useState('');

    interface ValueErrors {
      name?: string;
      symbol?: string;
      supply?: string;
      charityAddress?: string;
      taxFeeBps?: string;
      liquidityFeeBps?: string;
      charityFeeBps?: string;
      taxes?: string;
    }

    const validate = async (values) => {
      const errors: ValueErrors = {};

      if(!values.name){
        errors.name = 'This field is Required';
      }

      if(!values.symbol){
        errors.symbol = 'This field is Required';
      }

      if(!values.supply){
        errors.supply = 'This field is Required';
      }

      if(!values.taxFeeBps){
        errors.taxFeeBps = 'This field is Required'
      }

      if(!values.liquidityFeeBps){
        errors.liquidityFeeBps = 'This field is Required'
      }

      if(!values.charityAddress && values.charityFeeBps){
        errors.charityAddress = 'This field is required if you have a Tax Fee';
      } else if(values.charityAddress && !(await verifyAddress(values.charityAddress))) {
        errors.charityAddress = 'This is not a valid address';
      } else if(values.charityAddress === account){
        errors.charityAddress = 'This account cannot be the same as the owners account'
      }

      if((!values.charityFeeBps && values.charityFeeBps !== 0) && await verifyAddress(values.charityAddress)){
        errors.charityFeeBps = 'This field is required if you have a Charity Address'
      } else if(parseInt(values.charityFeeBps) <= 0 && await verifyAddress(values.charityAddress)){
        errors.charityFeeBps = 'This field cannot be 0 if you have a Charity Address'
      }
      
      if((parseInt(values.taxFeeBps) || 0) + (parseInt(values.liquidityFeeBps) || 0) + (parseInt(values.charityFeeBps) || 0) > 25){
        errors.taxes = 'Fees cannot exceed 25%'
      }

      return errors;
    }

    const factory = useLiquidityTokenContract();
    const formik = useFormik({
      initialValues: {
        name: '',
        symbol: '',
        supply: '',
        router: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1', // PancakeSwap
        charityAddress: '',
        taxFeeBps: '',
        liquidityFeeBps: '',
        charityFeeBps: '',
        taxes:''
      },
      onSubmit: async (values) => {
        try{
          if (!factory){return}
          const tx = await factory.createLiquidityToken(
            values.name,
            values.symbol,
            ethers.utils.parseUnits(String(values.supply), 9),
            values.router, 
            (values.charityAddress !== '' ? values.charityAddress : '0x0000000000000000000000000000000000000000'),
            (parseInt(values.taxFeeBps) * 100),
            (parseInt(values.liquidityFeeBps) * 100),
            (parseInt(values.charityFeeBps !== '' ? values.charityFeeBps : '0') * 100),
            {value: ethers.utils.parseUnits("0.01")}
          );
          setLoading(true);
          setTxAddress(tx.hash)
          setLoading(false);
          setCreated(true);
        } catch (e){
          console.error(e)
        }
      },
      validate
    })

    useEffect(() => {
        console.log(loading, created)
    }, [loading, created, txAddress])

    return (
        <>
            {!created && !loading && (
              <Form onSubmit={formik.handleSubmit}>
                <Relative>
                    {formik.errors.name && (
                      <Error className='error'>{formik.errors.name}</Error>
                    )}
                    <Label htmlFor="name"> 
                        <LabelText>
                            Name
                            <Required>*</Required>
                        </LabelText> 
                        <Inputs 
                            type="text" 
                            name="name" 
                            placeholder='Ex: Ethereum' 
                            required
                            onChange={formik.handleChange}
                            value={formik.values.name}
                        />
                    </Label>
                </Relative>
                <Relative>
                    {formik.errors.symbol && (
                      <Error className='error'>{formik.errors.symbol}</Error>
                    )}
                    <Label htmlFor="symbol"> 
                        <LabelText>
                            Symbol
                            <Required>*</Required>
                        </LabelText>  
                        <Inputs 
                            type="text" 
                            name="symbol" 
                            placeholder='Ex: ETH' 
                            onChange={formik.handleChange}
                            value={formik.values.symbol}
                        />
                    </Label>
                </Relative>
                <Relative>
                    {formik.errors.supply && (
                      <Error className='error'>{formik.errors.supply}</Error>
                    )}
                    <Label htmlFor="supply"> 
                        <LabelText>
                            Total Supply
                            <Required>*</Required>
                        </LabelText> 
                        <Inputs 
                            type="number" 
                            name="supply" 
                            placeholder='Ex: 10000' 
                            required
                            onChange={formik.handleChange}
                            value={formik.values.supply}
                        />
                    </Label>
                </Relative>
                <Relative>
                    <Label htmlFor="router"> 
                        <LabelText>
                            Router
                            <Required>*</Required>
                        </LabelText> 
                        <Select 
                          onChange={formik.handleChange}
                          value={formik.values.router} name="router" id="router"
                        >
                          <option value="0xD99D1c33F9fC3444f8101754aBC46c52416550D1">PancakeSwap</option>
                          <option value={ROUTER_ADDRESS}>SummitSwap</option>
                        </Select>
                    </Label>
                </Relative>
                <Relative>
                    {formik.errors.charityAddress && (
                      <Error className='error'>{formik.errors.charityAddress}</Error>
                    )}
                    <Label htmlFor="charityAddress"> 
                        <BigLabelText>
                            Charity Address
                        </BigLabelText> 
                        <Inputs
                            type="text" 
                            name="charityAddress" 
                            placeholder='Ex: 0x...' 
                            onChange={formik.handleChange}
                            value={formik.values.charityAddress}
                        />
                    </Label>
                </Relative>
                <Relative>
                    {formik.errors.taxFeeBps && (
                      <Error className='error'>{formik.errors.taxFeeBps}</Error>
                    )}
                    <Label htmlFor="taxFeeBps"> 
                        <BigLabelText>
                            Transaction fee to generate yield (%)
                            <Required>*</Required>
                        </BigLabelText> 
                        <Inputs 
                            type="number" 
                            name="taxFeeBps" 
                            placeholder='Ex: 1' 
                            required
                            onChange={formik.handleChange}
                            value={formik.values.taxFeeBps}
                        />
                    </Label>
                </Relative>
                <Relative>
                    {formik.errors.liquidityFeeBps && (
                      <Error className='error'>{formik.errors.liquidityFeeBps}</Error>
                    )}
                    <Label htmlFor="liquidityFeeBps"> 
                        <BigLabelText>
                            Transaction fee to generate liquidity (%)
                            <Required>*</Required>
                        </BigLabelText> 
                        <Inputs 
                            type="number" 
                            name="liquidityFeeBps" 
                            placeholder='Ex: 1' 
                            required
                            onChange={formik.handleChange}
                            value={formik.values.liquidityFeeBps}
                        />
                    </Label>
                </Relative>
                <Relative>
                    {(formik.errors.charityFeeBps) && (
                      <Error className='error'>{formik.errors.charityFeeBps}</Error>
                    )}
                    <Label htmlFor="charityFeeBps"> 
                        <BigLabelText>
                            Charity/Marketing percent (%)
                        </BigLabelText>
                        <Inputs 
                            type="number" 
                            name="charityFeeBps" 
                            placeholder='Ex: 1' 
                            onChange={formik.handleChange}
                            value={formik.values.charityFeeBps}
                        />
                    </Label>
                </Relative>
                <Relative style={{marginTop: '3rem'}}>
                  { formik.errors.taxes && (
                    <Error className='error'>{formik.errors.taxes}</Error>
                  )}
                </Relative>
                {formik.isValid && <Submit type="submit" value="CREATE TOKEN" />}
                {!formik.isValid && <Disabled type="submit" value="CREATE TOKEN" />}
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
