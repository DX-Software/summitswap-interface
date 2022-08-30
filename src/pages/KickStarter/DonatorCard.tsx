import { BinanceIcon, Flex, Text } from "@koda-finance/summitswap-uikit"
import { BackedKickstarter } from "hooks/useBackKickstartersByAddress"
import React from "react"
import styled from "styled-components"

type Props = {
  backedKickstarter: BackedKickstarter
  isFirstItem: boolean
  isLastItem: boolean
}

const Wrapper = styled(Flex)`
  row-gap: 4px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

function DonatorCard({ backedKickstarter, isFirstItem, isLastItem }: Props) {
  return (
    <Wrapper
      justifyContent="space-between"
      paddingTop={isFirstItem ? 0 : "16px"}
      paddingBottom={isLastItem ? 0 : "12px"}
      borderBottom={`${isLastItem ? 0 : 1}px solid`}
      borderBottomColor="inputColor">
      <Flex flexDirection="column">
        <Text fontSize="14px" color="textSubtle">{backedKickstarter.contributor.id}</Text>
      </Flex>
      <Flex alignItems="center" style={{ columnGap: "8px"  }}>
        <BinanceIcon />
        <Text fontSize="24px" fontWeight="bold">{backedKickstarter.amount.toString()}</Text>
      </Flex>
    </Wrapper>
  )
}

export default DonatorCard
