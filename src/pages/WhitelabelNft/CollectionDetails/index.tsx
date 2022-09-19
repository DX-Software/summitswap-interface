import { ArrowBackIcon, Box, Breadcrumbs, Flex, Text } from '@koda-finance/summitswap-uikit'
import { Grid, useMediaQuery } from '@mui/material'
import { useWhitelabelNftCollectionById } from 'api/useWhitelabelNftApi'
import React from 'react'
import styled from 'styled-components'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
import MetadataSection from './MetadataSection'

const Divider = styled(Box)`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.inputColor};
`

type WhitelabelNftDetailsProps = {
  previousPage: string
}

type HeaderProps = {
  previousPage: string
  nftName: string | undefined
}

const Header = ({ previousPage, nftName }: HeaderProps) => {
  const { setWhitelabelNtId } = useWhitelabelNftContext()
  return (
    <>
      <Flex borderBottom="1px solid" borderBottomColor="inputColor" paddingBottom="8px" marginBottom="24px">
        <Breadcrumbs>
          <Text color="primaryDark" style={{ cursor: 'pointer' }} onClick={() => setWhitelabelNtId('')}>
            {previousPage}
          </Text>
          <Text color="borderColor" style={{ fontWeight: 700 }}>
            {nftName}
          </Text>
        </Breadcrumbs>
      </Flex>
      <Flex style={{ columnGap: '8px', cursor: 'pointer' }} onClick={() => setWhitelabelNtId('')}>
        <ArrowBackIcon color="linkColor" />
        <Text color="linkColor" style={{ textDecoration: 'underline' }}>
          back to {previousPage}
        </Text>
      </Flex>
    </>
  )
}

function CollectionDetails({ previousPage }: WhitelabelNftDetailsProps) {
  const isMobileView = useMediaQuery('(max-width: 576px)')
  const { whitelabelNftId } = useWhitelabelNftContext()
  const whitelabelNft = useWhitelabelNftCollectionById(whitelabelNftId)

  return (
    <>
      <Header previousPage={previousPage} nftName={whitelabelNft.data?.name} />
      <Grid container marginTop="24px">
        <Grid item xs={12}>
          <MetadataSection whitelabelNft={whitelabelNft} />
        </Grid>
        <Grid item xs={12} marginTop={isMobileView ? '32px' : '44px'}>
          <Divider />
        </Grid>
      </Grid>
    </>
  )
}

export default React.memo(CollectionDetails)
