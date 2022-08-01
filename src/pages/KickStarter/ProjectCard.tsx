import { BinanceIcon, Flex, Progress, Text } from "@koda-finance/summitswap-uikit";
import React from "react"
import styled from "styled-components";
import ProgressBox from "./ProgressBox";

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

function ProjectCard() {
  return (
    <Card flexDirection="column">
      <Banner flexDirection="column">
        <Label fontSize="12px" fontWeight="bold">7 days left</Label>
      </Banner>
      <Flex flexDirection="column" paddingTop="16px" paddingBottom="24px" paddingX="20px">
        <Text fontSize="12px" marginBottom="4px" color="textSubtle">SUMMITSWAP</Text>
        <Text fontSize="20px" marginBottom="16px" fontWeight="bold">
          SummitSwap#1 Fundraising Project
        </Text>
        <Flex justifyContent="space-between" alignItems="center" marginBottom="24px">
          <Text fontSize="14px">Project Goal</Text>
          <Flex alignItems="center" style={{ columnGap: "8px" }}>
            <BinanceIcon width="20px" />
            <Text fontSize="14px">0,00001</Text>
          </Flex>
        </Flex>
        <Text color="primary" marginBottom="8px"><b>30%</b> funded</Text>
        <ProgressBox>
          <Progress primaryStep={30} />
        </ProgressBox>
      </Flex>
    </Card>
  )
}

export default ProjectCard;
