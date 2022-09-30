import { Flex, Input } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import { useWhitelabelNftItemsByOwner } from 'api/useWhitelabelNftApi'
import RadioPill from 'components/RadioPill'
import { PER_PAGE, REVEAL_RADIO_OPTIONS } from 'constants/whitelabel'
import useDebounce from 'hooks/useDebounce'
import React, { useState } from 'react'
import styled from 'styled-components'
import NftItemGallery from '../shared/NftItemGallery'

const StyledWrapper = styled(Flex)`
  margin-bottom: 24px;
  column-gap: 16px;
  width: 100%;

  @media (max-width: 576px) {
    overflow: auto;
    white-space: nowrap;

    &::-webkit-scrollbar {
      display: none;
    }

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
`

function TabAllCollection() {
  const { account } = useWeb3React()
  const [revealOption, setRevealOption] = useState(REVEAL_RADIO_OPTIONS[0].value)
  const [search, setSearch] = useState<string>('')
  const debouncedSearch = useDebounce(search, 1000)
  const whitelabelNftItems = useWhitelabelNftItemsByOwner(account || '', revealOption, debouncedSearch, PER_PAGE)

  return (
    <>
      <Input
        placeholder="Seach NFT by collection name"
        scale="lg"
        style={{ marginBottom: '24px' }}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <StyledWrapper>
        {REVEAL_RADIO_OPTIONS.map((option) => (
          <RadioPill
            key={option.label}
            variant={revealOption === option.value ? 'awesome' : 'primary'}
            checked={revealOption === option.value}
            onClick={() => setRevealOption(option.value)}
          >
            {option.label}
          </RadioPill>
        ))}
      </StyledWrapper>
      <NftItemGallery queryResult={whitelabelNftItems} disableOwnedTag displayCollectionName />
    </>
  )
}

export default React.memo(TabAllCollection)
