import { ArrowBackIcon, Box, Breadcrumbs, Flex, Text } from '@koda-finance/summitswap-uikit'
import { Grid, useMediaQuery } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { useWhitelabelNftCollectionById } from 'api/useWhitelabelNftApi'
import { BigNumber } from 'ethers'
import { useWhitelabelNftContract } from 'hooks/useContract'
import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
import CollectionItemSection from './CollectionItemSection'
import MetadataSection from './MetadataSection'
import MintSection from './MintSection'

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
  const history = useHistory()
  const { account } = useWeb3React()
  const isMobileView = useMediaQuery('(max-width: 576px)')
  const { whitelabelNftId, setWhitelabelNtId } = useWhitelabelNftContext()
  const whitelabelNft = useWhitelabelNftCollectionById(whitelabelNftId)
  const whitelabelNftContract = useWhitelabelNftContract(whitelabelNftId)

  const [totalSupply, setTotalSupply] = useState(0)
  const [isOwner, setIsOwner] = useState(false)

  const getTotalSupply = useCallback(async () => {
    if (!whitelabelNftContract) return
    const _totalSupply = (await whitelabelNftContract?.totalSupply()) as BigNumber
    setTotalSupply(_totalSupply.toNumber())
  }, [whitelabelNftContract])

  const getCollectionOwner = useCallback(async () => {
    if (!whitelabelNftContract) return
    const _owner = (await whitelabelNftContract?.owner()) as string
    setIsOwner(_owner.toLowerCase() === account?.toLowerCase())
  }, [whitelabelNftContract, account])

  useEffect(() => {
    getTotalSupply()
  }, [getTotalSupply])

  useEffect(() => {
    getCollectionOwner()
  }, [getCollectionOwner])

  useEffect(() => {
    if (whitelabelNft.isFetched && !whitelabelNft.data) {
      setWhitelabelNtId('')
    }
  }, [whitelabelNft, setWhitelabelNtId])

  useEffect(() => {
    if (whitelabelNft.data) {
      history.replace({
        search: `?whitelabel-nft=${whitelabelNft.data.id}`,
      })
    }
    return () => {
      history.replace({
        search: '',
      })
    }
  }, [history, whitelabelNft.data])

  return (
    <>
      <Header previousPage={previousPage} nftName={whitelabelNft.data?.name} />
      <Grid container marginTop="24px">
        <Grid item xs={12}>
          <MetadataSection isOwner={isOwner} totalSupply={totalSupply} whitelabelNft={whitelabelNft} />
        </Grid>
        <Grid item xs={12} marginTop={isMobileView ? '32px' : '44px'} marginBottom={isMobileView ? '32px' : '40px'}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <MintSection totalSupply={totalSupply} whitelabelNft={whitelabelNft} />
        </Grid>
        <Grid item xs={12} marginTop={isMobileView ? '32px' : '44px'} marginBottom={isMobileView ? '32px' : '40px'}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <CollectionItemSection whitelabelNft={whitelabelNft} />
        </Grid>
      </Grid>
    </>
  )
}

export default React.memo(CollectionDetails)
