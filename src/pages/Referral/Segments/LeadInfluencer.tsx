import React from 'react'
import { Text, Box } from '@summitswap-uikit'
import styled from 'styled-components'

import { Influencer } from '../types'

const InfluencerBox = styled(Box)`
  color: ${({ theme }) => theme.colors.invertedContrast};
  padding: 16px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.sidebarBackground};
`

interface LeadInfluencerProps {
  influencers:  Influencer[]
}

const LeadInfluencer: React.FC<LeadInfluencerProps> = ({influencers}) => {
  return <>
    {influencers.map(influencer => {
      return <InfluencerBox key={influencer.referee}>
        <Box>
          <Text>{influencer.referee}</Text>
        </Box>
      </InfluencerBox>
    })}
  </>
}


export default LeadInfluencer