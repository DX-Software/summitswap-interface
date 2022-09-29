import { Flex } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import { useWhitelabelNftItemsByOwner } from 'api/useWhitelabelNftApi'
import RadioPill from 'components/RadioPill'
import { PER_PAGE, REVEAL_RADIO_OPTIONS } from 'constants/whitelabel'
import React, { useState } from 'react'
import NftItemGallery from '../shared/NftItemGallery'

function TabAllCollection() {
  const [page, setPage] = useState(1)
  const { account } = useWeb3React()
  const [revealOption, setRevealOption] = useState(REVEAL_RADIO_OPTIONS[0].value)
  const whitelabelNftItems = useWhitelabelNftItemsByOwner(account || '', revealOption, page, PER_PAGE)

  return (
    <>
      <Flex marginBottom="24px" style={{ columnGap: '16px' }}>
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
      </Flex>
      <NftItemGallery
        queryResult={whitelabelNftItems}
        totalItem={5}
        page={page}
        onPageChange={setPage}
        disableOwnedTag
        displayCollectionName
      />
    </>
  )
}

export default React.memo(TabAllCollection)
