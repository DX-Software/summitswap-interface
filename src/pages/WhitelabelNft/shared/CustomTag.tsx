import { LockIcon, Tag } from '@koda-finance/summitswap-uikit'
import { Phase } from 'constants/whitelabel'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { getPhaseString } from 'utils/whitelabelNft'

export const CustomTag = styled(Tag)`
  margin-top: 16px;
  margin-bottom: 8px;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 10px;
  height: auto;
  padding: 2px 8px;

  @media (max-width: 576px) {
    margin-top: 8px;
    margin-bottom: 0;
  }
`

type PhaseTagProps = {
  phase?: Phase
}

export function PhaseTag({ phase }: PhaseTagProps) {
  const phaseString = getPhaseString(phase || 0)

  const tagVariant = useMemo(() => {
    switch (phase) {
      case Phase.Pause:
        return 'textDisabled'
      case Phase.Whitelist:
        return 'info'
      default:
        return 'primary'
    }
  }, [phase])

  return (
    <CustomTag variant={tagVariant}>
      {phase === Phase.Whitelist && <LockIcon color="default" width={8} marginRight="4px" />}
      {phaseString} PHASE
    </CustomTag>
  )
}
