import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useFormik } from 'formik';
import styled from 'styled-components';
import { useTokenCreatorContract } from 'hooks/useContract';
import { ROUTER_ADDRESS } from '../../constants/index';
import { Form, Label, LabelText, BigLabelText, Submit, Inputs, MessageContainer, Message, Required, Disabled, Relative, Error } from './standardTokenForm';
import { verifyAddress } from './liquidityTokenForm';

export const Select = styled.select`
    height: 2.5rem;
    padding: 0 1rem 0 1rem;
    border-radius: 0 30px 30px 0;
    background-color: #011724;
    color: white;
    flex: 1;
`

const BabyTokenForm = ({account}) => {
    const [loading, setLoading] = useState(false);
    const [created, setCreated] = useState(false);
    const [txAddress, setTxAddress] = useState('');
    const dividendTracker = "0x87064D365710C0C025628ed1294548FEA4f5AD67";

    const factory = useTokenCreatorContract('BABY');
    interface ValueErrors {
      name?: string;
      symbol?: string;
      supply?: string;
      rewardToken?:string;
      marketingWallet?: string;
      tokenFeeBps?: string;
      liquidityFeeBps?: string;
      marketingFeeBps?: string;
      minimumTokenBalanceForDividends?: string;
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

      if(!values.rewardToken){
        errors.rewardToken = 'This field is Required';
      } else if(values.rewardToken && !(await verifyAddress(values.rewardToken))){
        errors.rewardToken = 'This is not a valid address';
      }

      if(!values.marketingWallet){
        errors.marketingWallet = 'This field is Required';
      } else if(values.marketingWallet && !(await verifyAddress(values.marketingWallet))) {
        errors.marketingWallet = 'This is not a valid address';
      } else if(values.marketingWallet === account){
        errors.marketingWallet = 'This account cannot be the same as the owners account';
      }

      if(!values.tokenFeeBps){
        errors.tokenFeeBps = 'This field is Required';
      }

      if(!values.liquidityFeeBps){
        errors.liquidityFeeBps = 'This field is Required';
      }
      
      if(!values.marketingFeeBps){
        errors.marketingFeeBps = 'This field is Required';
      }

      if(!values.minimumTokenBalanceForDividends){
        errors.minimumTokenBalanceForDividends = 'This field is Required';
      } else if(values.minimumTokenBalanceForDividends > (values.supply / 1000)){
        errors.minimumTokenBalanceForDividends = 'Minimum Token Balance must be 0.1% or less than Total Supply';
      }

      if((parseInt(values.tokenFeeBps) || 0) + (parseInt(values.liquidityFeeBps) || 0) + (parseInt(values.marketingFeeBps) || 0) > 100){
        errors.taxes = 'Fees need to be less than or equal to 100%';
      }

      return errors;
    }

    const formik = useFormik({
      initialValues: {
        name: '',
        symbol: '',
        supply: '',
        rewardToken:'',
        router: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1', // PancakeSwap
        marketingWallet: '',
        tokenFeeBps: '',
        liquidityFeeBps: '',
        marketingFeeBps: '',
        minimumTokenBalanceForDividends: '',
        taxes:''
      },
      onSubmit: async (values) => {
        try{
          if (!factory){return}
          const tx = await factory.createBabyToken(
              values.name,
              values.symbol,
              ethers.utils.parseUnits(String(values.supply), 18),
              [
                values.rewardToken,
                values.router,
                values.marketingWallet,
                dividendTracker
              ],
              [
                (parseInt(values.tokenFeeBps)),
                (parseInt(values.liquidityFeeBps)),
                (parseInt(values.marketingFeeBps)),
              ],
              ethers.utils.parseUnits(String(values.minimumTokenBalanceForDividends), 18),
              {value: ethers.utils.parseUnits("0.01")}
          );
          setLoading(true);
          setTxAddress(tx.hash);
          setLoading(false);
          setCreated(true);
        } catch (e){
          console.error(e);
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
                                required
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
                        {formik.errors.rewardToken && (
                          <Error className='error'>{formik.errors.rewardToken}</Error>
                        )}
                        <Label htmlFor="rewardToken"> 
                            <BigLabelText>
                                Reward Token Address
                                <Required>*</Required>
                            </BigLabelText> 
                            <Inputs 
                                type="text" 
                                name="rewardToken" 
                                placeholder='Ex: 0x...'
                                required
                                onChange={formik.handleChange}
                                value={formik.values.rewardToken}
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
                        {formik.errors.marketingWallet && (
                          <Error className='error'>{formik.errors.marketingWallet}</Error>
                        )}
                        <Label htmlFor="marketingWallet"> 
                            <BigLabelText>
                                Marketing Wallet Address
                                <Required>*</Required>
                            </BigLabelText> 
                            <Inputs 
                                type="text" 
                                name="marketingWallet" 
                                placeholder='Ex: 0x...'
                                onChange={formik.handleChange}
                                value={formik.values.marketingWallet}
                            />
                        </Label>
                    </Relative>
                    <Relative>
                        {formik.errors.tokenFeeBps && (
                          <Error className='error'>{formik.errors.tokenFeeBps}</Error>
                        )}
                        <Label htmlFor="tokenFeeBps"> 
                            <BigLabelText>
                                Token reward fee (%)
                                <Required>*</Required>
                            </BigLabelText> 
                            <Inputs 
                                type="number" 
                                name="tokenFeeBps"
                                placeholder='Ex: 1' 
                                required
                                onChange={formik.handleChange}
                                value={formik.values.tokenFeeBps}
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
                        {formik.errors.marketingFeeBps && (
                          <Error className='error'>{formik.errors.marketingFeeBps}</Error>
                        )}
                        <Label htmlFor="marketingFeeBps"> 
                            <BigLabelText>
                                Marketing fee (%)
                                <Required>*</Required>
                            </BigLabelText> 
                            <Inputs 
                                type="number" 
                                name="marketingFeeBps" 
                                placeholder='Ex: 1' 
                                required
                                onChange={formik.handleChange}
                                value={formik.values.marketingFeeBps}
                            />
                        </Label>
                    </Relative>
                    <Relative>
                        {formik.errors.minimumTokenBalanceForDividends && (
                          <Error className='error'>{formik.errors.minimumTokenBalanceForDividends}</Error>
                        )}
                        <Label htmlFor="minimumTokenBalanceForDividends"> 
                            <BigLabelText>
                                Minimum token balance for dividends 
                                <Required>*</Required>
                            </BigLabelText> 
                            <Inputs 
                                type="number" 
                                name="minimumTokenBalanceForDividends" 
                                placeholder='Ex: 1000' 
                                required
                                onChange={formik.handleChange}
                                value={formik.values.minimumTokenBalanceForDividends}
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
    );
};

export default BabyTokenForm;
