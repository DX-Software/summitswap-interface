import { BinanceIcon, Flex, Progress, Text } from "@koda-finance/summitswap-uikit"
import BigNumber from "bignumber.js"
import React, { useMemo } from "react"
import styled from "styled-components"
import ProgressBox from "./ProgressBox"
import StatusLabel from "./shared/StatusLabel"
import { Statuses } from "./types"
import { getDayRemaining, getKickstarterStatus } from "./utility"

type Props = {
  title: string
  creator: string
  projectGoals: BigNumber
  totalContribution: BigNumber
  endTimestamp: number
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
  background-color: ${({theme}) => theme.colors.inputColor};
  border-radius: 8px;
  width: 100%;
  overflow: hidden;
  cursor: pointer;
`

const Banner = styled(Flex)`
  height: 115px;
  background: gray;
  padding: 12px;
`

function ProjectCard({ title, creator, projectGoals, totalContribution, endTimestamp, onClick }: Props) {

  const status = useMemo(() => getKickstarterStatus(endTimestamp), [endTimestamp])

  const fundedPercentage = useMemo(() => {
    if (totalContribution.toString() === "0") {
      return "0"
    }
    return totalContribution.div(projectGoals).times(100).toString()
  }, [projectGoals, totalContribution])
  return (
    <Card flexDirection="column" onClick={onClick}>
      <Banner flexDirection="column">
        <StatusLabel status={status} style={{ marginLeft: "auto" }}>
          {status !== Statuses.END_SOON
            ? status
            : `${getDayRemaining(endTimestamp)} day(s) left`
          }
        </StatusLabel>
      </Banner>
      <Flex flexDirection="column" paddingTop="16px" paddingBottom="24px" paddingX="20px">
        <Text fontSize="12px" marginBottom="4px" color="textSubtle">{creator}</Text>
        <Title marginBottom={16}>{title}</Title>
        <Flex justifyContent="space-between" alignItems="center" marginBottom="24px">
          <Text fontSize="14px">Project Goal</Text>
          <Flex alignItems="center" style={{ columnGap: "8px" }}>
            <BinanceIcon width="20px" />
            <Text fontSize="14px">{projectGoals.toString()}</Text>
          </Flex>
        </Flex>
        <Text color="primary" marginBottom="8px"><b>{fundedPercentage}%</b> funded</Text>
        <ProgressBox>
          <Progress primaryStep={Number(fundedPercentage)} />
        </ProgressBox>
      </Flex>
    </Card>
  )
}

export default ProjectCard
