import React, { useEffect, useState } from 'react' 
import { ethers } from 'ethers' 
import { useFormik } from 'formik' 
import styled from 'styled-components' 
import { useTokenCreatorContract } from 'hooks/useContract' 
import { ROUTER_ADDRESS } from '../../constants/index' 
import { Form, Label, LabelText, BigLabelText, Submit, Inputs, MessageContainer, Message, Required, Relative, Disabled, Error } from './standardTokenForm' 
import { verifyAddress, Select } from './liquidityTokenForm'

const BuybackTokenForm = ({account}) => {
    const [loading, setLoading] = useState(false) 
    const [created, setCreated] = useState(false) 
    const [txAddress, setTxAddress] = useState('') 

    const factory = useTokenCreatorContract('BUYBACK') 

    interface ValueErrors {
      name?: string,
      symbol?: string,
      supply?: string,
      rewardToken?: string,
      liquidityFeeBps?: string,
      buybackFee?: string,
      reflectionFee?: string,
      marketingFeeBps?: string,
      taxes?: string
    }

    const validate = async (values) => {
      const errors: ValueErrors = {} 

      if(!values.name){
        errors.name = 'This field is Required' 
      }

      if(!values.symbol){
        errors.symbol = 'This field is Required' 
      }

      if(!values.supply){
        errors.supply = 'This field is Required' 
      }

      if(!values.rewardToken){
        errors.rewardToken = 'This field is Required' 
      } else if(values.rewardToken && !(await verifyAddress(values.rewardToken))){
        errors.rewardToken = 'This is not a valid address' 
      }

      if(!values.liquidityFeeBps){
        errors.liquidityFeeBps = 'This field is Required' 
      }

      if(!values.buybackFee){
        errors.buybackFee = 'This field is Required' 
      }

      if(!values.reflectionFee){
        errors.reflectionFee = 'This field is Required' 
      }
      
      if(!values.marketingFeeBps){
        errors.marketingFeeBps = 'This field is Required' 
      }

      if
      (
        (parseInt(values.liquidityFeeBps) || 0) + (parseInt(values.buybackFee) || 0) + (parseInt(values.reflectionFee) || 0) + (parseInt(values.marketingFeeBps)) > 100
      )
      {
        errors.taxes = 'Fees need to be less than or equal to 100%' 
      }

      return errors 
    }

    const formik = useFormik({
      initialValues: {
        name: '',
        symbol: '',
        supply: '',
        router: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1', // PancakeSwap
        rewardToken: '',
        liquidityFeeBps: '2',
        buybackFee: '3',
        reflectionFee: '8',
        marketingFeeBps: '1',
        taxes:''
      },
      onSubmit: async (values) => {
        try{
          if (!factory){return}
          const tx = await factory.createBuybackBabyToken(
              values.name,
              values.symbol,
              ethers.utils.parseUnits(String(values.supply), 9),
              values.rewardToken,
              values.router,
              [
                (parseInt(values.liquidityFeeBps) * 100),
                (parseInt(values.buybackFee) * 100),
                (parseInt(values.reflectionFee) * 100),
                (parseInt(values.marketingFeeBps) * 100),
                10000
              ],
              {value: ethers.utils.parseUnits("0.01")}
          ) 
          setLoading(true) 
          setTxAddress(tx.hash) 
          setLoading(false) 
          setCreated(true) 
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
                        {formik.errors.router && (
                          <Error className='error'>{formik.errors.router}</Error>
                        )}
                        <Label htmlFor="router"> 
                            <LabelText>
                                Router
                                <Required>*</Required>
                            </LabelText> 
                            <Select 
                              onChange={formik.handleChange}
                              value={formik.values.router} name="router" id="router"
                            >
                              <option value="0xD99D1c33F9fC3444f8101754aBC46c52416550D1" selected>PancakeSwap</option>
                              <option value={ROUTER_ADDRESS}>SummitSwap</option>
                            </Select>
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
                        {formik.errors.buybackFee && (
                          <Error className='error'>{formik.errors.buybackFee}</Error>
                        )}
                        <Label htmlFor="buybackFee"> 
                            <BigLabelText>
                                Transaction fee to generate liquidity (%)
                                <Required>*</Required>
                            </BigLabelText> 
                            <Inputs 
                                type="number" 
                                name="buybackFee" 
                                placeholder='Ex: 1' 
                                required
                                onChange={formik.handleChange}
                                value={formik.values.buybackFee}
                            />
                        </Label>
                    </Relative>
                    <Relative>
                        {formik.errors.reflectionFee && (
                          <Error className='error'>{formik.errors.reflectionFee}</Error>
                        )}
                        <Label htmlFor="reflectionFee"> 
                            <BigLabelText>
                                Transaction fee to generate liquidity (%)
                                <Required>*</Required>
                            </BigLabelText> 
                            <Inputs 
                                type="number" 
                                name="reflectionFee" 
                                placeholder='Ex: 1' 
                                required
                                onChange={formik.handleChange}
                                value={formik.values.reflectionFee}
                            />
                        </Label>
                    </Relative>
                    <Relative>
                        {formik.errors.marketingFeeBps && (
                          <Error className='error'>{formik.errors.name}</Error>
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

export default BuybackTokenForm 
