import { BinanceIcon, Flex, Progress, Text } from "@koda-finance/summitswap-uikit";
import BigNumber from "bignumber.js";
import React, { useMemo } from "react"
import styled from "styled-components";
import ProgressBox from "./ProgressBox";

type Props = {
  title: string
  creator: string
  projectGoals: BigNumber
  totalContribution: BigNumber
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

const Label = styled(Text)`
  padding: 4px 12px;
  border-radius: 20px;
  background: ${({theme}) => theme.colors.failure};
  margin-left: auto;
  text-transform: uppercase;
`;

function ProjectCard({ title, creator, projectGoals, totalContribution, onClick }: Props) {
  const fundedPercentage = useMemo(() => {
    if (totalContribution.toString() === "0") {
      return "0"
    }
    return totalContribution.div(projectGoals).times(100).toString()
  }, [projectGoals, totalContribution])
  return (
    <Card flexDirection="column" onClick={onClick}>
      <Banner flexDirection="column">
        <Label fontSize="12px" fontWeight="bold">7 days left</Label>
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
