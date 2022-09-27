import { Box, Heading, Text } from '@koda-finance/summitswap-uikit'
import { Grid, useMediaQuery } from '@mui/material'
import React from 'react'
import styled from 'styled-components'
import { NftMetadata } from 'types/whitelabelNft'
import Decorator from '../shared/Decorator'

const AttributeCard = styled(Box)`
  background-color: ${({ theme }) => theme.colors.inputColor};
  border-radius: 8px;
  padding: 12px;
  height: 100%;
`

type TraitSectionProps = {
  metadata: NftMetadata | undefined
}

function TraitSection({ metadata }: TraitSectionProps) {
  const isMobileView = useMediaQuery('(max-width: 576px)')

  return (
    <>
      <Heading color="primary" marginBottom={isMobileView ? '8px' : '16px'}>
        Traits of {metadata?.name}
      </Heading>
      <Decorator marginBottom="18px" />
      <Grid container spacing="8px">
        {metadata?.attributes?.map((attribute) => (
          <Grid item xs={6} lg={4}>
            <AttributeCard>
              <Text color="primary" fontSize="12px">
                {attribute.trait_type}
              </Text>
              <Text fontSize="14px" fontWeight={700}>
                {attribute.value}
              </Text>
            </AttributeCard>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default React.memo(TraitSection)
