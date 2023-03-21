import { Box, Text } from '@koda-finance/summitswap-uikit'
import { Grid, useMediaQuery } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { useWhitelabelNftApiSignature, useWhitelabelNftCollectionById } from 'api/useWhitelabelNftApi'
import { BigNumber } from 'ethers'
import { useWhitelabelNftContract } from 'hooks/useContract'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
import NftDetails from '../NftDetails'
import Header, { HeaderLevel } from '../shared/Header'
import CollectionItemSection from './CollectionItemSection'
import MetadataSection from './MetadataSection'
import MintSection from './MintSection'
import WhitelistSection from './WhitelistSection'

const Divider = styled(Box)`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.inputColor};
`

const MintMessageWrapper = styled(Box)`
  margin-top: 24px;
  font-size: 16px;
  border-radius: 4px;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.colors.successDark};

  @media (max-width: 576px) {
    margin-top: 16px;
    font-size: 14px;
  }
`

type WhitelabelNftDetailsProps = {
  previousPage: string
}

function CollectionDetails({ previousPage }: WhitelabelNftDetailsProps) {
  const history = useHistory()
  const { account } = useWeb3React()
  const isMobileView = useMediaQuery('(max-width: 576px)')
  const { whitelabelNftId, setWhitelabelNtId, tokenId } = useWhitelabelNftContext()
  const whitelabelNft = useWhitelabelNftCollectionById(whitelabelNftId)
  const whitelabelNftContract = useWhitelabelNftContract(whitelabelNftId)

  const [totalSupply, setTotalSupply] = useState(0)
  const [mintedMessage, setMintedMessage] = useState('')
  const [isOwner, setIsOwner] = useState(false)

  const mintMessageRef = useRef<null | HTMLDivElement>(null)
  const scrollToMintMessage = useCallback(() => {
    mintMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const headerLevel: HeaderLevel[] = [
    { label: previousPage, onBack: () => setWhitelabelNtId('') },
    { label: whitelabelNft.data?.name },
  ]

  const whitelabelNftApiSignature = useWhitelabelNftApiSignature(
    whitelabelNft.data?.owner?.id || '',
    whitelabelNftId || '',
    account || ''
  )

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
    if (whitelabelNft.data && !tokenId) {
      history.replace({
        search: `?whitelabel-nft=${whitelabelNft.data.id}`,
      })
    }
  }, [history, whitelabelNft.data, tokenId])

  if (tokenId) {
    return <NftDetails previousHeaderLevels={headerLevel} whitelabelNft={whitelabelNft} />
  }

  return (
    <>
      <Header levels={headerLevel} />
      {mintedMessage && (
        <MintMessageWrapper ref={mintMessageRef}>
          <Text color="success">{mintedMessage}</Text>
        </MintMessageWrapper>
      )}
      <Grid container marginTop={isMobileView ? '16px' : '24px'}>
        <Grid item xs={12}>
          <MetadataSection isOwner={isOwner} totalSupply={totalSupply} whitelabelNft={whitelabelNft} />
          <Divider marginTop={isMobileView ? '32px' : '44px'} marginBottom={isMobileView ? '32px' : '40px'} />
        </Grid>
        {isOwner && (
          <Grid item xs={12}>
            <WhitelistSection whitelabelNftApiSignature={whitelabelNftApiSignature} />
            <Divider marginTop={isMobileView ? '32px' : '44px'} marginBottom={isMobileView ? '32px' : '40px'} />
          </Grid>
        )}
        <Grid item xs={12}>
          <MintSection
            isOwner={isOwner}
            totalSupply={totalSupply}
            whitelabelNft={whitelabelNft}
            whitelabelNftApiSignature={whitelabelNftApiSignature}
            setMintedMessage={setMintedMessage}
            scrollToMintMessage={scrollToMintMessage}
          />
          <Divider marginTop={isMobileView ? '32px' : '44px'} marginBottom={isMobileView ? '32px' : '40px'} />
        </Grid>
        <Grid item xs={12}>
          <CollectionItemSection whitelabelNft={whitelabelNft} />
        </Grid>
      </Grid>
    </>
  )
}

export default React.memo(CollectionDetails)
