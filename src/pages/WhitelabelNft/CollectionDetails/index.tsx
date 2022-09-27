import { Box } from '@koda-finance/summitswap-uikit'
import { Grid, useMediaQuery } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { useWhitelabelNftApiSignature, useWhitelabelNftCollectionById } from 'api/useWhitelabelNftApi'
import { BigNumber } from 'ethers'
import { useWhitelabelNftContract } from 'hooks/useContract'
import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
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

type WhitelabelNftDetailsProps = {
  previousPage: string
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
      <Header levels={headerLevel} />
      <Grid container marginTop="24px">
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
