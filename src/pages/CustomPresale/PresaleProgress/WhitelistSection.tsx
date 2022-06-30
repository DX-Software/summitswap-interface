import React, { useState } from 'react'
import styled from 'styled-components'
import { Pagination } from '@mui/material'
import { Text, Flex } from '@koda-finance/summitswap-uikit'
import CopyButton from 'components/CopyButton'
import { WHITELIST_ADDRESSES_PER_PAGE } from 'constants/presale'
import Section from './Section'
import { TextSubHeading } from '../StyledTexts'

interface Props {
  whitelistAddresses: string[]
}

const PaginationTitleText = styled(Text)`
  font-size: 16px;
  width: 33%;
  @media (max-width: 550px) {
    font-size: 12px;
  }
  @media (max-width: 400px) {
    font-size: 5px;
  }
`

const PaginationFieldText = styled(Text)`
  font-size: 12px;
  @media (max-width: 967px) {
    font-size: 8px;
  }
  @media (max-width: 800px) {
    font-size: 12px;
  }
  @media (max-width: 550px) {
    font-size: 8px;
  }
  @media (max-width: 400px) {
    font-size: 6px;
  }
`

const BorderBottom = styled.div`
  border-bottom: 1px solid #fff;
  opacity: 0.4;
  width: 100%;
  margin-top: 5px;
`

const style = {
  '& .MuiPaginationItem-root ': {
    color: '#ffff',
  },
  '& .Mui-selected': {
    color: '#00D5A5',
  },
}

const WhitelistSection = ({ whitelistAddresses }: Props) => {
  const [page, setPage] = useState(1)

  const changePageHandler = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const startIndex = page * WHITELIST_ADDRESSES_PER_PAGE - WHITELIST_ADDRESSES_PER_PAGE
  const endIndex =
    startIndex + WHITELIST_ADDRESSES_PER_PAGE > whitelistAddresses.length
      ? whitelistAddresses.length
      : startIndex + WHITELIST_ADDRESSES_PER_PAGE
  const slicedWhitelistAddresses = whitelistAddresses.slice(startIndex, endIndex)

  return (
    <Section paddingY="30px">
      <TextSubHeading style={{ width: '100%' }} marginBottom="15px" textAlign="center">
        Whitelist Users
      </TextSubHeading>
      <Flex marginBottom="5px" width="100%" justifyContent="space-between">
        <PaginationTitleText textAlign="left">No.</PaginationTitleText>
        <PaginationTitleText textAlign="center">Address({whitelistAddresses.length})</PaginationTitleText>
        <PaginationTitleText textAlign="right">Copy</PaginationTitleText>
      </Flex>
      <BorderBottom />
      {slicedWhitelistAddresses.map((address, i) => (
        <>
          <Flex marginTop="5px" width="100%" justifyContent="space-between">
            <PaginationFieldText>{i + 1}.</PaginationFieldText>
            <PaginationFieldText>{address}</PaginationFieldText>
            <CopyButton color="#00D5A5" text={address} tooltipMessage="Copied" tooltipTop={1} width="12px" />
          </Flex>

          <BorderBottom />
        </>
      ))}
      <Pagination
        sx={style}
        count={Math.ceil(whitelistAddresses.length / WHITELIST_ADDRESSES_PER_PAGE)}
        page={page}
        onChange={changePageHandler}
      />
    </Section>
  )
}

export default WhitelistSection
