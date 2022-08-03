import { BinanceIcon, Flex, Text } from "@koda-finance/summitswap-uikit"
import React from "react"
import styled from "styled-components"
import { Donator } from "./types"

type Props = {
  donator: Donator
  isFirstItem: boolean
  isLastItem: boolean
}

const Wrapper = styled(Flex)`
  row-gap: 4px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

function DonatorCard({ donator, isFirstItem, isLastItem }: Props) {
  return (
    <Wrapper
      justifyContent="space-between"
      paddingTop={isFirstItem ? 0 : "16px"}
      paddingBottom={isLastItem ? 0 : "12px"}
      borderBottom={`${isLastItem ? 0 : 1}px solid`}
      borderBottomColor="inputColor">
      <Flex flexDirection="column">
          <Text fontWeight="bold" marginBottom="4px">{donator.name}</Text>
          <Text fontSize="14px" marginBottom="4px" color="menuItemActiveBackground">{donator.email}</Text>
          <Text fontSize="14px" color="textSubtle">{donator.walletAddress}</Text>
      </Flex>
      <Flex alignItems="center" style={{ columnGap: "8px"  }}>
        <BinanceIcon />
        <Text fontSize="24px" fontWeight="bold">{donator.amount}</Text>
      </Flex>
    </Wrapper>
  )
}

export default DonatorCard
