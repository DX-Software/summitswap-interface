import { BinanceIcon, Flex, Progress, Text } from "@koda-finance/summitswap-uikit"
import BigNumber from "bignumber.js"
import React, { useMemo } from "react"
import styled from "styled-components"
import ProgressBox from "./ProgressBox"
import StatusLabel from "./shared/StatusLabel"
import { getDayRemaining, getKickstarterStatus } from "./utility"

type Props = {
  title: string
  creator: string
  projectGoals: BigNumber
  totalContribution: BigNumber
  endTimestamp: number
  showStatus?: boolean
  onClick: () => void
}

const Wrapper = styled(Flex)`
  padding-bottom: 16px;
  column-gap: 12px;
  cursor: pointer;
`

const Banner = styled(Flex)`
  position: relative;
  width: 84px;
  height: 84px;
  background: gray;
  border-radius: 8px;
  flex-shrink: 0;
  padding: 4px;
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

function ProjectCardMobile({ title, creator, projectGoals, totalContribution, endTimestamp, showStatus, onClick }: Props) {
  const status = useMemo(() => getKickstarterStatus(endTimestamp), [endTimestamp])

  const fundedPercentage = useMemo(() => {
    if (totalContribution.toString() === "0") {
      return "0"
    }
    return totalContribution.div(projectGoals).times(100).toString()
  }, [projectGoals, totalContribution])

  return (
    <Wrapper onClick={onClick}>
      <Banner>
      {showStatus && (
        <StatusLabel status={status} style={{ fontSize: "10px", marginLeft: "auto" }}>
          {status.replace(/_/g, ' ')}
        </StatusLabel>
      )}
      </Banner>
      <Flex flexDirection="column" flex={1}>
        <Name>{creator}</Name>
        <Title>{title}</Title>
        <Flex justifyContent="space-between" marginBottom="8px">
          <Text fontSize="12px">Project Goal</Text>
          <Flex style={{ columnGap: "4px" }}>
            <BinanceIcon />
            <Text fontSize="12px">{projectGoals.toString()}</Text>
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