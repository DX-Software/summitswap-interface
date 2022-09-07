import { BinanceIcon, Flex, Progress, Text } from "@koda-finance/summitswap-uikit"
import React, { useMemo } from "react"
import styled from "styled-components"
import { Kickstarter } from "types/kickstarter"
import { getKickstarterStatus } from "utils/kickstarter"
import ProgressBox from "../ProgressBox"
import StatusLabel from "../StatusLabel"

type Props = {
  kickstarter: Kickstarter
  showStatus?: boolean
  onClick: () => void
}

const Wrapper = styled(Flex)`
  padding-bottom: 16px;
  column-gap: 12px;
  cursor: pointer;
`

const Banner = styled(Flex)<{ image: string }>`
  position: relative;
  width: 84px;
  height: 84px;
  border-radius: 8px;
  flex-shrink: 0;
  padding: 4px;

  background: ${(props) => `url(${props.image})`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-blend-mode: overlay;
`

const Name = styled(Text)`
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 10px;
`

const Title = styled(Text)`
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 8px;
  width: 100%;
  overflow: hidden;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  white-space: pre-wrap;
`

function ProjectCardMobile({ kickstarter, showStatus, onClick }: Props) {
  const status = useMemo(() => getKickstarterStatus(kickstarter.endTimestamp?.toNumber() || 0), [kickstarter.endTimestamp])

  const fundedPercentage = useMemo(() => {
    if (!kickstarter.totalContribution || !kickstarter.projectGoals || kickstarter.projectGoals.eq(0)) {
      return "0"
    }
    return kickstarter.totalContribution.div(kickstarter.projectGoals).times(100).toString()
  }, [kickstarter.projectGoals, kickstarter.totalContribution])

  return (
    <Wrapper onClick={onClick}>
      <Banner image={kickstarter.imageUrl || ""}>
      {showStatus && (
        <StatusLabel status={status} style={{ fontSize: "10px", marginLeft: "auto" }}>
          {status.replace(/_/g, ' ')}
        </StatusLabel>
      )}
      </Banner>
      <Flex flexDirection="column" flex={1}>
        <Name>{kickstarter.creator}</Name>
        <Title>{kickstarter.title}</Title>
        <Flex justifyContent="space-between" marginBottom="8px">
          <Text fontSize="12px">Project Goal</Text>
          <Flex style={{ columnGap: "4px" }}>
            <BinanceIcon />
            <Text fontSize="12px">{kickstarter.projectGoals?.toString()}</Text>
          </Flex>
        </Flex>
        <ProgressBox>
          <Progress primaryStep={Number(fundedPercentage)} />
        </ProgressBox>
      </Flex>
    </Wrapper>
  )
}

export default ProjectCardMobile

ProjectCardMobile.defaultProps = {
  showStatus: false,
}
