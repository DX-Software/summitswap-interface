/* eslint-disable jsx-a11y/label-has-associated-control */
import { Heading, Radio, Text } from '@koda-finance/summitswap-uikit'
import { Grid } from '@mui/material'
import { BUSD, NULL_ADDRESS, USDT } from 'constants/index'
import { FormikProps } from 'formik'
import React, { useMemo } from 'react'
import { getSymbolByAddress } from 'utils/kickstarter'
import { Project, ProjectFormField } from '../types'

type Props = {
  formik: FormikProps<Project>
}

function ChoosePaymentToken({ formik }: Props) {
  const chosenSymbol = useMemo(() => {
    return getSymbolByAddress(formik.values.paymentToken)
  }, [formik.values.paymentToken])

  return (
    <>
      <Heading size="md" marginBottom="4px" color="default">
        Choose Project Currency
      </Heading>
      <Text color="textSubtle" marginBottom="8px">
        Participant will pay with{' '}
        <Text color="primary" style={{ display: 'inline-block' }} bold>
          {chosenSymbol}
        </Text>{' '}
        for your token
      </Text>
      <Grid container spacing="16px">
        <Grid item xs={12} sm={4} lg={2} style={{ display: 'flex', alignItems: 'center', columnGap: '8px' }}>
          <Radio
            id={`${ProjectFormField.paymentToken}-${NULL_ADDRESS}`}
            scale="sm"
            name={ProjectFormField.paymentToken}
            value={NULL_ADDRESS}
            onChange={formik.handleChange}
            checked={formik.values.paymentToken === NULL_ADDRESS}
            style={{ flexShrink: 0 }}
          />
          <label htmlFor={`${ProjectFormField.paymentToken}-${NULL_ADDRESS}`}>
            <Text>BNB</Text>
          </label>
        </Grid>
        <Grid item xs={12} sm={4} lg={2} style={{ display: 'flex', alignItems: 'center', columnGap: '8px' }}>
          <Radio
            id={`${ProjectFormField.paymentToken}-${USDT.address}`}
            scale="sm"
            name={ProjectFormField.paymentToken}
            value={USDT.address}
            onChange={formik.handleChange}
            checked={formik.values.paymentToken === USDT.address}
            style={{ flexShrink: 0 }}
          />
          <label htmlFor={`${ProjectFormField.paymentToken}-${USDT.address}`}>
            <Text>USDT</Text>
          </label>
        </Grid>
        <Grid item xs={12} sm={4} lg={2} style={{ display: 'flex', alignItems: 'center', columnGap: '8px' }}>
          <Radio
            id={`${ProjectFormField.paymentToken}-${BUSD.address}`}
            scale="sm"
            name={ProjectFormField.paymentToken}
            value={BUSD.address}
            onChange={formik.handleChange}
            checked={formik.values.paymentToken === BUSD.address}
            style={{ flexShrink: 0 }}
          />
          <label htmlFor={`${ProjectFormField.paymentToken}-${BUSD.address}`}>
            <Text>BUSD</Text>
          </label>
        </Grid>
      </Grid>
    </>
  )
}

export default React.memo(ChoosePaymentToken)
