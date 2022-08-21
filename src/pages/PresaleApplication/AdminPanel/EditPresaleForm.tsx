/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FormikProps } from 'formik'
import { formatUnits } from 'ethers/lib/utils'
import {
  CheckmarkCircleIcon,
  AutoRenewIcon,
  Box,
  Button,
  EditIcon,
  Flex,
  Heading,
  Radio,
  Input,
  Select,
} from '@koda-finance/summitswap-uikit'
import { useTokenContract } from 'hooks/useContract'
import { useToken } from 'hooks/Tokens'
import { RowFixed } from 'components/Row'
import { DAY_OPTIONS, HOUR_OPTIONS, FEE_DECIMALS, RADIO_VALUES, TOKEN_CHOICES, ROUTER_OPTIONS } from 'constants/presale'
import { GridItem2 } from '../CreatePresale/GridComponents'
import { AdminForm, FieldNames } from '../types'
import { Caption } from '../Texts'
import {
  GridContainer,
  ContainerToken,
  StyledGridItem1,
  StyledImage,
  StyledText,
  SectionHeading,
  ResponsiveFlex,
  TextAddressHeading,
} from '../CreatePresale/CreationStep06'

interface Props {
  formik: FormikProps<AdminForm>
  isLoading: boolean
  cancelEditButtonHandler: (isEdit: boolean) => void
}

const Divider = styled.div`
  width: 100%;
  max-width: 950px;
  height: 0px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.inputColor};
`

const HeadingPresaleDetails = styled(Heading)`
  font-size: 40px;
  line-height: 44px;
  @media (max-width: 600px) {
    font-size: 32px;
    line-height: 35px;
  }
`

const ColumnWrapper = styled(Box)`
  width: 48%;
  margin-right: 16px;
  @media (max-width: 1089px) {
    width: 70%;
  }
  @media (max-width: 650px) {
    width: 100%;
  }
`

const InputWrapper = styled(Box)`
  width: 48%;
  @media (max-width: 650px) {
    width: 100%;
  }
`

const DateTimeWrapper = styled(Box)<{ onlyTime?: boolean }>`
  margin-top: 4px;
  width: ${({ onlyTime }) => (onlyTime ? '35%' : '60%')};
  @media (max-width: 650px) {
    width: 100%;
  }
`

const EditPresaleForm = ({ formik, cancelEditButtonHandler, isLoading }: Props) => {
  const [tokenTotalSupply, setTokenTotalSupply] = useState<string>()

  const { presaleInfo } = formik.values
  const presaleToken = useToken(presaleInfo?.presaleToken)
  const tokenContract = useTokenContract(presaleToken?.address, true)

  useEffect(() => {
    async function fetchTotalSupply() {
      setTokenTotalSupply(
        Number(formatUnits(await tokenContract?.totalSupply(), presaleToken?.decimals)).toLocaleString()
      )
    }
    if (presaleToken && tokenContract) {
      fetchTotalSupply()
    }
  }, [tokenContract, presaleToken])

  return (
    <form onSubmit={formik.handleSubmit}>
      <ResponsiveFlex justifyContent="space-between" flexWrap="wrap">
        <HeadingPresaleDetails marginTop="30px" size="xl" marginRight="20px">
          Presale Details
        </HeadingPresaleDetails>
        <RowFixed>
          <Button
            scale="sm"
            marginTop="30px"
            marginRight="8px"
            variant="awesome"
            width="fit-content"
            type="submit"
            startIcon={!isLoading && <CheckmarkCircleIcon color="currentColor" />}
            endIcon={isLoading && <AutoRenewIcon spin color="currentColor" />}
            disabled={isLoading || !formik.isValid}
          >
            Change & Approve
          </Button>
          <Button
            scale="sm"
            type="button"
            marginTop="30px"
            variant="tertiary"
            width="fit-content"
            startIcon={<EditIcon color="currentColor" />}
            onClick={() => cancelEditButtonHandler(false)}
          >
            Cancel Edit
          </Button>
        </RowFixed>
      </ResponsiveFlex>
      <SectionHeading marginTop="16px" color="success">
        Token Information
      </SectionHeading>
      <ContainerToken marginTop="16px" marginBottom="24px">
        <StyledImage src={formik.values?.logoUrl} alt="presale-icon" />
        <StyledGridItem1>
          <ResponsiveFlex marginTop="20px">
            <TextAddressHeading>Token Address</TextAddressHeading>
            <StyledText color="sidebarActiveColor">{presaleToken?.address}</StyledText>
          </ResponsiveFlex>
        </StyledGridItem1>

        <GridItem2>
          <GridContainer>
            <StyledText>Token Name</StyledText>
            <StyledText>{presaleToken?.name}</StyledText>
          </GridContainer>
          <GridContainer>
            <StyledText>Symbols</StyledText>
            <StyledText>{presaleToken?.symbol}</StyledText>
          </GridContainer>
          <GridContainer>
            <StyledText>Decimals</StyledText>
            <StyledText>{presaleToken?.decimals}</StyledText>
          </GridContainer>
          <GridContainer>
            <StyledText>Token Supply</StyledText>
            <StyledText>{tokenTotalSupply}</StyledText>
          </GridContainer>
          <Box marginTop="8px">
            <StyledText marginBottom="8px" fontWeight={700}>
              Choose Currency
            </StyledText>
            <Flex width="180px" flexWrap="wrap" justifyContent="space-between" onChange={formik.handleChange}>
              {Object.keys(TOKEN_CHOICES)
                .filter((key) => key !== 'KODA')
                .map((key) => (
                  <label key={key} htmlFor={key}>
                    <RowFixed marginBottom="5px">
                      <Radio
                        scale="sm"
                        name={FieldNames.paymentToken}
                        value={TOKEN_CHOICES[key]}
                        id={key}
                        checked={formik.values?.paymentToken === TOKEN_CHOICES[key]}
                      />
                      <StyledText marginLeft="5px">{key}</StyledText>
                    </RowFixed>
                  </label>
                ))}
            </Flex>
          </Box>
        </GridItem2>
      </ContainerToken>
      <Divider />
      <SectionHeading marginTop="24px" color="success">
        Presale System
      </SectionHeading>
      <Flex justifyContent="space-between" flexWrap="wrap">
        <ColumnWrapper marginTop="16px" width="48%">
          <Box marginBottom="24px">
            <StyledText bold color="primaryDark">
              Presale Rate & Whitelist
            </StyledText>
            <Box width="100%" marginTop="8px">
              <StyledText marginBottom="4px" small>
                Presale rate
              </StyledText>
              <Input scale="sm" disabled value={formatUnits(presaleInfo?.presaleRate || 0)} />
            </Box>
            <Box width="100%" marginTop="8px">
              <StyledText color="textSubtle" marginBottom="4px" small>
                Whitelist System
              </StyledText>
              <RowFixed onChange={formik.handleChange}>
                <RowFixed marginRight="40px">
                  <Radio
                    scale="sm"
                    name={FieldNames.isWhitelistEnabled}
                    value={`${RADIO_VALUES.WHITELIST_DISABLED}`}
                    checked={`${formik.values.isWhitelistEnabled}` === `${RADIO_VALUES.WHITELIST_DISABLED}`}
                  />
                  <label htmlFor="disable">
                    <StyledText
                      marginLeft="8px"
                      color={
                        `${formik.values.isWhitelistEnabled}` === `${RADIO_VALUES.WHITELIST_DISABLED}`
                          ? 'linkColor'
                          : ''
                      }
                    >
                      Public
                    </StyledText>
                  </label>
                </RowFixed>
                <RowFixed>
                  <Radio
                    scale="sm"
                    name={FieldNames.isWhitelistEnabled}
                    value={`${RADIO_VALUES.WHITELIST_ENABLED}`}
                    checked={`${formik.values.isWhitelistEnabled}` === `${RADIO_VALUES.WHITELIST_ENABLED}`}
                  />
                  <label htmlFor="disable">
                    <StyledText
                      marginLeft="8px"
                      color={
                        `${formik.values.isWhitelistEnabled}` === `${RADIO_VALUES.WHITELIST_ENABLED}` ? 'linkColor' : ''
                      }
                    >
                      Whitelist Only
                    </StyledText>
                  </label>
                </RowFixed>
              </RowFixed>
            </Box>
          </Box>
          <Divider />
          <Box marginTop="16px" marginBottom="10px">
            <StyledText bold color="primaryDark">
              Presale Goal
            </StyledText>
            <Flex justifyContent="space-between" flexWrap="wrap">
              <InputWrapper marginTop="4px">
                <StyledText marginBottom="4px" small>
                  Softcap
                </StyledText>
                <Input
                  scale="sm"
                  value={formik.values.softcap}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name={FieldNames.softcap}
                  id={FieldNames.softcap}
                  type="number"
                  isWarning={formik.touched.softcap && !!formik.errors.softcap}
                />
                <Caption color="failure">
                  {formik.touched.softcap && formik.errors.softcap ? formik.errors.softcap : ''}
                </Caption>
              </InputWrapper>
              <InputWrapper marginTop="4px">
                <StyledText marginBottom="4px" small>
                  Hardcap
                </StyledText>
                <Input scale="sm" disabled value={formatUnits(presaleInfo?.hardcap || 0)} />
              </InputWrapper>
            </Flex>
          </Box>
          <Divider />
          <Box marginTop="16px" marginBottom="24px">
            <StyledText bold color="primaryDark">
              Presale Purchasing & Refund
            </StyledText>
            <Flex justifyContent="space-between" flexWrap="wrap">
              <InputWrapper marginTop="4px">
                <StyledText marginBottom="4px" small>
                  Minimum Buy
                </StyledText>
                <Input
                  scale="sm"
                  value={formik.values.minBuy}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name={FieldNames.minBuy}
                  id={FieldNames.minBuy}
                  type="number"
                  isWarning={formik.touched.minBuy && !!formik.errors.minBuy}
                />
                <Caption color="failure">
                  {formik.touched.minBuy && formik.errors.minBuy ? formik.errors.minBuy : ''}
                </Caption>
              </InputWrapper>
              <InputWrapper marginTop="4px">
                <StyledText marginBottom="4px" small>
                  Maximum Buy
                </StyledText>
                <Input
                  scale="sm"
                  value={formik.values.maxBuy}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name={FieldNames.maxBuy}
                  id={FieldNames.maxBuy}
                  type="number"
                  isWarning={formik.touched.maxBuy && !!formik.errors.maxBuy}
                />
                <Caption color="failure">
                  {formik.touched.maxBuy && formik.errors.maxBuy ? formik.errors.maxBuy : ''}
                </Caption>
              </InputWrapper>
            </Flex>
            <Box width="100%">
              <StyledText color="textSubtle" marginBottom="4px" small>
                Refund System
              </StyledText>
              <RowFixed onChange={formik.handleChange}>
                <RowFixed marginRight="40px">
                  <Radio
                    scale="sm"
                    name={FieldNames.refundType}
                    value={RADIO_VALUES.REFUND_TYPE_REFUND}
                    checked={Number(formik.values.refundType) === RADIO_VALUES.REFUND_TYPE_REFUND}
                  />
                  <label htmlFor="disable">
                    <StyledText
                      marginLeft="8px"
                      color={`${formik.values.refundType}` === `${RADIO_VALUES.REFUND_TYPE_REFUND}` ? 'linkColor' : ''}
                    >
                      Refund
                    </StyledText>
                  </label>
                </RowFixed>
                <RowFixed>
                  <Radio
                    scale="sm"
                    name={FieldNames.refundType}
                    value={RADIO_VALUES.REFUND_TYPE_BURN}
                    checked={Number(formik.values.refundType) === RADIO_VALUES.REFUND_TYPE_BURN}
                  />
                  <label htmlFor="disable">
                    <StyledText
                      marginLeft="8px"
                      color={`${formik.values.refundType}` === `${RADIO_VALUES.REFUND_TYPE_BURN}` ? 'linkColor' : ''}
                    >
                      Burn
                    </StyledText>
                  </label>
                </RowFixed>
              </RowFixed>
            </Box>
          </Box>
          <Divider />
        </ColumnWrapper>

        <ColumnWrapper marginTop="16px">
          <Box width="100%" marginBottom="24px">
            <StyledText bold color="primaryDark">
              Liquidity & Listing
            </StyledText>
            <Box width="100%" marginTop="8px">
              <StyledText marginBottom="4px" small>
                Router
              </StyledText>
              <Select
                id={FieldNames.listingChoice}
                onChange={(e: any) => formik.setFieldValue(FieldNames.listingChoice, e.target.value)}
                selected={`${formik.values.listingChoice}`}
                scale="sm"
                options={ROUTER_OPTIONS}
              />
            </Box>
            <Flex justifyContent="space-between" flexWrap="wrap">
              <InputWrapper marginTop="8px">
                <StyledText marginBottom="4px" small>
                  Router Liquidity (%)
                </StyledText>
                <Input
                  scale="sm"
                  disabled
                  value={presaleInfo?.liquidity
                    .mul(100)
                    .div(10 ** FEE_DECIMALS)
                    .toString()}
                />
              </InputWrapper>
              <InputWrapper marginTop="8px">
                <StyledText marginBottom="4px" small>
                  Router Listing Rate
                </StyledText>
                <Input scale="sm" disabled value={formatUnits(presaleInfo?.listingRate || 0)} />
              </InputWrapper>
            </Flex>
            <Box width="100%" marginTop="8px">
              <StyledText color="textSubtle" marginBottom="4px" small>
                Router Token Pairing
              </StyledText>
              <Flex flexWrap="wrap" justifyContent="space-between" onChange={formik.handleChange}>
                {Object.keys(TOKEN_CHOICES)
                  .filter((key) => key !== 'USDT')
                  .map((key) => (
                    <RowFixed marginBottom="4px" marginRight="8px" key={key}>
                      <Box>
                        <Radio
                          scale="sm"
                          name={FieldNames.listingToken}
                          value={TOKEN_CHOICES[key]}
                          checked={formik.values.listingToken === TOKEN_CHOICES[key]}
                        />
                      </Box>
                      <label htmlFor={key}>
                        <StyledText
                          color={formik.values.listingToken === TOKEN_CHOICES[key] ? 'linkColor' : ''}
                          marginLeft="8px"
                        >
                          {key}
                        </StyledText>
                      </label>
                    </RowFixed>
                  ))}
              </Flex>
            </Box>
          </Box>
          <Divider />
          <Box marginTop="16px">
            <StyledText bold color="primaryDark" marginBottom="4px">
              Vesting System
            </StyledText>
            <RowFixed onChange={formik.handleChange}>
              <RowFixed marginRight="40px">
                <Radio
                  scale="sm"
                  name={FieldNames.isVestingEnabled}
                  value={`${RADIO_VALUES.VESTING_DISABLED}`}
                  checked={`${formik.values.isVestingEnabled}` === `${RADIO_VALUES.VESTING_DISABLED}`}
                />
                <label htmlFor="disable">
                  <StyledText
                    marginLeft="8px"
                    color={
                      `${formik.values.isVestingEnabled}` === `${RADIO_VALUES.VESTING_DISABLED}` ? 'linkColor' : ''
                    }
                  >
                    Off
                  </StyledText>
                </label>
              </RowFixed>
              <RowFixed>
                <Radio
                  scale="sm"
                  name={FieldNames.isVestingEnabled}
                  value={`${RADIO_VALUES.VESTING_ENABLED}`}
                  checked={`${formik.values.isVestingEnabled}` === `${RADIO_VALUES.VESTING_ENABLED}`}
                />
                <label htmlFor="disable">
                  <StyledText
                    marginLeft="8px"
                    color={`${formik.values.isVestingEnabled}` === `${RADIO_VALUES.VESTING_ENABLED}` ? 'linkColor' : ''}
                  >
                    On
                  </StyledText>
                </label>
              </RowFixed>
            </RowFixed>
            {`${formik.values.isVestingEnabled}` === `${RADIO_VALUES.VESTING_ENABLED}` && (
              <>
                <Box width="100%" marginTop="8px">
                  <StyledText marginBottom="4px" small>
                    Vesting Claim Percentage (%)
                  </StyledText>
                  <Input
                    scale="sm"
                    value={formik.values.maxClaimPercentage}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name={FieldNames.maxClaimPercentage}
                    id={FieldNames.maxClaimPercentage}
                    type="number"
                    isWarning={formik.touched.maxClaimPercentage && !!formik.errors.maxClaimPercentage}
                  />
                  <Caption color="failure">
                    {formik.touched.maxClaimPercentage && formik.errors.maxClaimPercentage
                      ? formik.errors.maxClaimPercentage
                      : ''}
                  </Caption>
                </Box>
                <Flex justifyContent="space-between" flexWrap="wrap">
                  <InputWrapper>
                    <StyledText marginBottom="4px" small>
                      Interval Day
                    </StyledText>
                    <Select
                      scale="sm"
                      options={DAY_OPTIONS}
                      id={FieldNames.claimIntervalDay}
                      onChange={(e: any) => formik.setFieldValue(FieldNames.claimIntervalDay, e.target.value)}
                      selected={`${formik.values.claimIntervalDay}`}
                    />
                  </InputWrapper>
                  <InputWrapper>
                    <StyledText marginBottom="4px" small>
                      Interval Time (UTC)
                    </StyledText>
                    <Select
                      scale="sm"
                      options={HOUR_OPTIONS}
                      id={FieldNames.claimIntervalHour}
                      onChange={(e: any) => formik.setFieldValue(FieldNames.claimIntervalHour, e.target.value)}
                      selected={`${formik.values.claimIntervalHour}`}
                    />
                  </InputWrapper>
                </Flex>
              </>
            )}
          </Box>
        </ColumnWrapper>
      </Flex>
      <ColumnWrapper marginTop="16px" marginBottom="16px">
        <StyledText bold color="primaryDark">
          Presale Start & End
        </StyledText>
        <ResponsiveFlex flexWrap="wrap" justifyContent="space-between" marginTop="8px">
          <DateTimeWrapper>
            <StyledText marginBottom="4px" small>
              Start Date
            </StyledText>
            <Input
              scale="sm"
              type="date"
              value={formik.values.startPresaleDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name={FieldNames.startPresaleDate}
              style={{ fontSize: '14px' }}
              isWarning={formik.touched.startPresaleDate && !!formik.errors.startPresaleDate}
            />
            <Caption color="failure">
              {formik.touched.startPresaleDate && formik.errors.startPresaleDate ? formik.errors.startPresaleDate : ''}
            </Caption>
          </DateTimeWrapper>
          <DateTimeWrapper onlyTime>
            <StyledText marginBottom="4px" small>
              Start Time
            </StyledText>
            <Input
              scale="sm"
              type="time"
              style={{ fontSize: '14px' }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name={FieldNames.startPresaleTime}
              value={formik.values.startPresaleTime}
              isWarning={!!formik.errors.startPresaleTime}
            />
            <Caption color="failure">{formik.errors.startPresaleTime ? formik.errors.startPresaleTime : ''}</Caption>
          </DateTimeWrapper>
        </ResponsiveFlex>
        <ResponsiveFlex flexWrap="wrap" justifyContent="space-between">
          <DateTimeWrapper>
            <StyledText marginBottom="4px" small>
              End Date
            </StyledText>
            <Input
              scale="sm"
              type="date"
              style={{ fontSize: '14px' }}
              value={formik.values.endPresaleDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name={FieldNames.endPresaleDate}
              isWarning={formik.touched.endPresaleDate && !!formik.errors.endPresaleDate}
            />
            <Caption color="failure">
              {formik.touched.endPresaleDate && formik.errors.endPresaleDate ? formik.errors.endPresaleDate : ''}
            </Caption>
          </DateTimeWrapper>
          <DateTimeWrapper onlyTime>
            <StyledText marginBottom="4px" small>
              End Time
            </StyledText>
            <Input
              scale="sm"
              type="time"
              style={{ fontSize: '14px' }}
              value={formik.values.endPresaleTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name={FieldNames.endPresaleTime}
              isWarning={!!formik.errors.endPresaleTime}
            />
            <Caption color="failure">{formik.errors.endPresaleTime ? formik.errors.endPresaleTime : ''}</Caption>
          </DateTimeWrapper>
        </ResponsiveFlex>

        <Box width="100%">
          <StyledText marginBottom="4px" small>
            Liquidity Lockup (minutes)
          </StyledText>
          <Input
            scale="sm"
            value={formik.values.liquidyLockTimeInMins}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name={FieldNames.liquidyLockTimeInMins}
            id={FieldNames.liquidyLockTimeInMins}
            type="number"
            isWarning={formik.touched.liquidyLockTimeInMins && !!formik.errors.liquidyLockTimeInMins}
          />
          <Caption
            color={
              formik.touched.liquidyLockTimeInMins && !!formik.errors.liquidyLockTimeInMins ? 'failure' : 'textDisabled'
            }
          >
            {formik.touched.liquidyLockTimeInMins && formik.errors.liquidyLockTimeInMins
              ? formik.errors.liquidyLockTimeInMins
              : ''}
          </Caption>
        </Box>
      </ColumnWrapper>
      <Divider />
      <SectionHeading marginTop="24px" color="success">
        Additional Information
      </SectionHeading>

      <Flex justifyContent="space-between" flexWrap="wrap" marginTop="16px">
        <ColumnWrapper width="48%" marginBottom="16px">
          <StyledText bold color="primaryDark">
            Project Presale Details
          </StyledText>
          <Box width="100%" marginTop="8px">
            <StyledText marginBottom="4px" small>
              Project Name
            </StyledText>
            <Input
              scale="sm"
              value={formik.values.projectName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name={FieldNames.projectName}
              id={FieldNames.projectName}
              isWarning={formik.touched.projectName && !!formik.errors.projectName}
            />
            <Caption color="failure">
              {formik.touched.projectName && formik.errors.projectName ? formik.errors.projectName : ''}
            </Caption>
          </Box>
          <Box width="100%" marginTop="8px">
            <StyledText marginBottom="4px" small>
              Contact Name
            </StyledText>
            <Input
              scale="sm"
              value={formik.values.contactName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name={FieldNames.contactName}
              id={FieldNames.contactName}
              isWarning={formik.touched.contactName && !!formik.errors.contactName}
            />
            <Caption color="failure">
              {formik.touched.contactName && formik.errors.contactName ? formik.errors.contactName : ''}
            </Caption>
          </Box>
          <Box width="100%" marginTop="8px">
            <StyledText marginBottom="4px" small>
              Contact Position
            </StyledText>
            <Input
              scale="sm"
              value={formik.values.contactPosition}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name={FieldNames.contactPosition}
              id={FieldNames.contactPosition}
              isWarning={formik.touched.contactPosition && !!formik.errors.contactPosition}
            />
            <Caption color="failure">
              {formik.touched.contactPosition && formik.errors.contactPosition ? formik.errors.contactPosition : ''}
            </Caption>
          </Box>
          <Box width="100%" marginTop="8px">
            <StyledText marginBottom="4px" small>
              Chosen Contact Method
            </StyledText>
            <Select
              options={[
                {
                  label: 'Telegram',
                  value: 'telegram',
                },
              ]}
              scale="sm"
            />
          </Box>
        </ColumnWrapper>
        <ColumnWrapper width="48%" marginBottom="16px">
          <StyledText bold color="primaryDark">
            Contact Information
          </StyledText>
          <Box width="100%" marginTop="8px">
            <StyledText marginBottom="4px" small>
              Telegram ID
            </StyledText>
            <Input
              scale="sm"
              value={formik.values.telegramId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name={FieldNames.telegramId}
              id={FieldNames.telegramId}
              isWarning={formik.touched.telegramId && !!formik.errors.telegramId}
            />
            <Caption color="failure">
              {formik.touched.telegramId && formik.errors.telegramId ? formik.errors.telegramId : ''}
            </Caption>
          </Box>
          <Box width="100%" marginTop="8px">
            <StyledText marginBottom="4px" small>
              Discord ID (optional)
            </StyledText>
            <Input
              scale="sm"
              value={formik.values.discordId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name={FieldNames.discordId}
              id={FieldNames.discordId}
              isWarning={formik.touched.discordId && !!formik.errors.discordId}
            />
            <Caption color="failure">
              {formik.touched.discordId && formik.errors.discordId ? formik.errors.discordId : ''}
            </Caption>
          </Box>
          <Box width="100%" marginTop="8px">
            <StyledText marginBottom="4px" small>
              E-mail Address (optional)
            </StyledText>
            <Input
              scale="sm"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name={FieldNames.email}
              id={FieldNames.email}
              isWarning={formik.touched.email && !!formik.errors.email}
            />
            <Caption color="failure">{formik.touched.email && formik.errors.email ? formik.errors.email : ''}</Caption>
          </Box>
          <Box width="100%" marginTop="8px">
            <StyledText marginBottom="4px" small>
              Twitter Username (optional)
            </StyledText>
            <Input
              scale="sm"
              value={formik.values.twitterId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name={FieldNames.twitterId}
              id={FieldNames.twitterId}
              isWarning={formik.touched.twitterId && !!formik.errors.twitterId}
            />
            <Caption color="failure">
              {formik.touched.twitterId && formik.errors.twitterId ? formik.errors.twitterId : ''}
            </Caption>
          </Box>
        </ColumnWrapper>
      </Flex>
      <Divider />
      <SectionHeading marginTop="24px" color="success">
        Fee Information
      </SectionHeading>
      <Flex justifyContent="space-between" flexWrap="wrap" marginTop="16px">
        <ColumnWrapper width="48%" marginBottom="25px">
          <StyledText bold color="primaryDark">
            Presale Finalising Fee
          </StyledText>
          <Box width="100%" marginTop="8px">
            <StyledText marginBottom="4px" small>
              Payment Token (%)
            </StyledText>
            <Input
              scale="sm"
              value={formik.values.feePaymentToken}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name={FieldNames.feePaymentToken}
              id={FieldNames.feePaymentToken}
              type="number"
              isWarning={formik.touched.feePaymentToken && !!formik.errors.feePaymentToken}
            />
            <Caption color="failure">
              {formik.touched.feePaymentToken && formik.errors.feePaymentToken ? formik.errors.feePaymentToken : ''}
            </Caption>
          </Box>
          <Box width="100%" marginTop="8px">
            <StyledText marginBottom="4px" small>
              Presale Token (%)
            </StyledText>
            <Input
              scale="sm"
              value={formik.values.feePresaleToken}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name={FieldNames.feePresaleToken}
              id={FieldNames.feePresaleToken}
              type="number"
              isWarning={formik.touched.feePresaleToken && !!formik.errors.feePresaleToken}
            />
            <Caption color="failure">
              {formik.touched.feePresaleToken && formik.errors.feePresaleToken ? formik.errors.feePresaleToken : ''}
            </Caption>
          </Box>
        </ColumnWrapper>
        <ColumnWrapper width="48%" marginBottom="25px">
          <StyledText bold color="primaryDark">
            Emergency Withdraw Fee
          </StyledText>
          <Box width="100%" marginTop="8px">
            <StyledText marginBottom="4px" small>
              Withdrawal Fee (%)
            </StyledText>
            <Input
              scale="sm"
              value={formik.values.emergencyWithdrawFee}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name={FieldNames.emergencyWithdrawFee}
              id={FieldNames.emergencyWithdrawFee}
              type="number"
              isWarning={formik.touched.emergencyWithdrawFee && !!formik.errors.emergencyWithdrawFee}
            />
            <Caption color="failure">
              {formik.touched.emergencyWithdrawFee && formik.errors.emergencyWithdrawFee
                ? formik.errors.emergencyWithdrawFee
                : ''}
            </Caption>
          </Box>
        </ColumnWrapper>
      </Flex>
    </form>
  )
}

export default EditPresaleForm
