import { Flex, Progress, Text } from '@koda-finance/summitswap-uikit'
import { getTokenImageBySymbol } from 'connectors'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Kickstarter } from 'types/kickstarter'
import { formatNumber } from 'utils/formatInfoNumbers'
import { getKickstarterStatus, getKickstarterStatusLabel } from 'utils/kickstarter'
import { ImgCurrency } from '..'
import ProgressBox from '../ProgressBox'
import StatusLabel from '../StatusLabel'

type Props = {
  kickstarter: Kickstarter
  onClick: () => void
}

const Title = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Card = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.inputColor};
  border-radius: 8px;
  width: 100%;
  overflow: hidden;
  cursor: pointer;
`

const Banner = styled(Flex)<{ image: string }>`
  height: 115px;
  padding: 12px;
  background: ${(props) => `url(${props.image})`}, rgba(0, 18, 29, 0.4);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-blend-mode: overlay;
`

function ProjectCard({ kickstarter, onClick }: Props) {
  const endTimestamp = useMemo(() => kickstarter.endTimestamp?.toNumber() || 0, [kickstarter.endTimestamp])
  const status = useMemo(() => getKickstarterStatus(endTimestamp, kickstarter.approvalStatus), [
    endTimestamp,
    kickstarter.approvalStatus,
  ])

  const fundedPercentage = useMemo(() => {
    if (!kickstarter.totalContribution || !kickstarter.projectGoals) return '0'
    if (kickstarter.totalContribution.isEqualTo(0) || kickstarter.projectGoals.isEqualTo(0)) return '0'

    return kickstarter.totalContribution.div(kickstarter.projectGoals).times(100).toString()
  }, [kickstarter.projectGoals, kickstarter.totalContribution])

  return (
    <Card flexDirection="column" onClick={onClick}>
      <Banner flexDirection="column" image={kickstarter.imageUrl || ''}>
        <StatusLabel status={status} style={{ marginLeft: 'auto' }}>
          {getKickstarterStatusLabel(endTimestamp, kickstarter.approvalStatus)}
        </StatusLabel>
      </Banner>
      <Flex flexDirection="column" paddingTop="16px" paddingBottom="24px" paddingX="20px">
        <Text fontSize="12px" marginBottom="4px" color="textSubtle">
          {kickstarter.creator}
        </Text>
        <Title marginBottom={16}>{kickstarter.title}</Title>
        <Flex justifyContent="space-between" alignItems="center" marginBottom="24px">
          <Text fontSize="14px">Project Goal</Text>
          <Flex alignItems="center" style={{ columnGap: '8px' }}>
            <ImgCurrency image={getTokenImageBySymbol(kickstarter.tokenSymbol)} />
            <Text fontSize="14px">{`${formatNumber(kickstarter.projectGoals?.toString())} ${
              kickstarter.tokenSymbol
            }`}</Text>
          </Flex>
        </Flex>
        <Text marginBottom="8px">
          <b>{fundedPercentage}%</b> funded
        </Text>
        <ProgressBox>
          <Progress primaryStep={Number(fundedPercentage)} />
        </ProgressBox>
      </Flex>
    </Card>
  )
}

export default React.memo(ProjectCard)
