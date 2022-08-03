import { BinanceIcon, Flex, Progress, Text } from "@koda-finance/summitswap-uikit"
import React from "react"
import styled from "styled-components"
import ProgressBox from "./ProgressBox"

const Wrapper = styled(Flex)`
  padding-bottom: 16px;
  column-gap: 12px;
`

const Banner = styled(Flex)`
  position: relative;
  width: 84px;
  height: 84px;
  background: gray;
  border-radius: 8px;
  flex-shrink: 0;
`

const Label = styled(Text)`
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 12px;
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
`

function ProjectCardMobile() {
  return (
    <Wrapper>
      <Banner>
        <Label style={{ background: "#ED4B9E" }}>End Soon</Label>
      </Banner>
      <Flex flexDirection="column">
        <Name>SUMMITSWAP</Name>
        <Title>SummitSwap#1 Fundraising Project</Title>
        <Flex justifyContent="space-between" marginBottom="8px">
          <Text fontSize="12px">Project Goal</Text>
          <Flex style={{ columnGap: "4px" }}>
            <BinanceIcon />
            <Text fontSize="12px">0,000001</Text>
          </Flex>
        </Flex>
        <ProgressBox>
          <Progress primaryStep={30} />
        </ProgressBox>
      </Flex>
    </Wrapper>
  )
}

export default ProjectCardMobile
