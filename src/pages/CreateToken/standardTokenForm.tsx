import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { ethers } from 'ethers';
import styled from 'styled-components';
import { useTokenCreatorContract } from '../../hooks/useContract';

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
    position: relative;
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
    position: relative;
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
export const Disabled = styled.input`
    color: white;
    background: grey; 
    width: 30%;
    height: 2.5rem;
    margin: 1rem auto;
    border-radius: 30px;
    box-shadow: 0px 0px 10px 1px grey;
    transition: 0.5s;
    :hover {
        opacity: 0.75;
        cursor: not-allowed;
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

export const Required = styled.span`
    color: red;
    font-size: 1.5rem;
    font-weight: bold;
    position: absolute;
    top: 5px;
    right: 5px;
`

export const Relative = styled.div`
    position: relative;
`

export const Error = styled.span`
    color: red;
    font-size: 0.8rem;
    font-weight: bold;
    position: absolute;
    bottom: -3px;
    left: 15px;
`

const StandardTokenForm = () => {
    const [loading, setLoading] = useState(false);
    const [created, setCreated] = useState(false);
    const [txAddress, setTxAddress] = useState('');

    // Using the Website own connectors instead of only metamask as I did
    const factory = useTokenCreatorContract('STANDARD');

    interface ValueErrors {
      name?: string;
      symbol?: string;
      supply?: string;
      decimals?: string;
    }

    const validate = (values) => {
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

      if(!values.decimals){
        errors.decimals = 'This field is Required';
      }

      return errors;
    }

    const formik = useFormik({
      initialValues: {
        name: '',
        symbol: '',
        supply: '',
        decimals: ''
      },
      onSubmit: async (values) => {
        try{
          if (!factory){return}
          const tx = await factory.createStandardToken(
            values.name,
            values.symbol,
            values.decimals,
            ethers.utils.parseUnits(String(values.supply)),
            {value: ethers.utils.parseUnits("0.01")});
          setLoading(true);
          setTxAddress(tx.hash);
          setLoading(false);
          setCreated(true);
        } catch (e) {
          console.error(e);
        }
      },
      validate
    })
    
    useEffect(() => {
      console.log(loading, created);
    }, [loading, created, txAddress])

    return (
        <>
            {!created && !loading && (
                  <Form onSubmit={formik.handleSubmit}>
                    <Relative>
                        {formik.errors.name && (
                          <Error>This Field is required!</Error>
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
                          <Error>This Field is required!</Error>
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
                                required
                                onChange={formik.handleChange}
                                value={formik.values.symbol}
                            />
                        </Label>
                    </Relative>
                    <Relative>
                        {formik.errors.decimals && (
                          <Error>This Field is required!</Error>
                        )}
                        <Label htmlFor="decimals"> 
                            <LabelText>
                                Decimals
                                <Required>*</Required>
                            </LabelText>  
                            <Inputs 
                                type="number" 
                                name="decimals" 
                                placeholder='Ex: 18' 
                                required
                                onChange={formik.handleChange}
                                value={formik.values.decimals}
                            />
                        </Label>
                    </Relative>
                    <Relative>
                        {formik.errors.supply && (
                          <Error>This Field is required!</Error>
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
    );
};

export default StandardTokenForm;
