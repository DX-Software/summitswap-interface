import { BinanceIcon, Flex, Progress, Text } from "@koda-finance/summitswap-uikit";
import BigNumber from "bignumber.js";
import React, { useMemo } from "react"
import styled from "styled-components";
import ProgressBox from "./ProgressBox";

enum STATUSES {
  ONGOING = "ongoing",
  END_SOON = "end soon",
  COMPLETED = "completed",
}

type Props = {
  title: string
  creator: string
  projectGoals: BigNumber
  totalContribution: BigNumber
  endTimestamp: number
  onClick: () => void
}

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
`;

const Label = styled(Text)<{ status: STATUSES }>`
  padding: 4px 12px;
  border-radius: 20px;
  background: ${({ status, theme }) => {
    if (status === STATUSES.COMPLETED) return theme.colors.dropdownBackground
    if (status === STATUSES.ONGOING) return theme.colors.primary
    return theme.colors.failure

  }};
  margin-left: auto;
  text-transform: uppercase;
`;

function ProjectCard({ title, creator, projectGoals, totalContribution, endTimestamp, onClick }: Props) {
  const oneDayTimestamp = 60 * 60 * 24;
  const currentTimestamp = Math.floor(Date.now() / 1000)

  const dayRemaining = useMemo(() => {
    const timeRemaining = endTimestamp > currentTimestamp ? endTimestamp - currentTimestamp : 0
    return Math.ceil(timeRemaining / oneDayTimestamp)
  }, [currentTimestamp, endTimestamp, oneDayTimestamp]);

  const status = useMemo(() => {
    if (currentTimestamp > endTimestamp) return STATUSES.COMPLETED
    if (currentTimestamp + 7 * oneDayTimestamp > endTimestamp) return STATUSES.END_SOON
    return STATUSES.ONGOING
  }, [currentTimestamp, oneDayTimestamp, endTimestamp])

  const fundedPercentage = useMemo(() => {
    if (totalContribution.toString() === "0") {
      return "0"
    }
    return totalContribution.div(projectGoals).times(100).toString()
  }, [projectGoals, totalContribution])
  return (
    <Card flexDirection="column" onClick={onClick}>
      <Banner flexDirection="column">
        <Label status={status} fontSize="12px" fontWeight="bold">
          {status !== STATUSES.END_SOON
            ? status
            : `${dayRemaining} day(s) left`
          }
        </Label>
      </Banner>
      <Flex flexDirection="column" paddingTop="16px" paddingBottom="24px" paddingX="20px">
        <Text fontSize="12px" marginBottom="4px" color="textSubtle">{creator}</Text>
        <Text fontSize="20px" marginBottom="16px" fontWeight="bold">
          {title}
        </Text>
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
