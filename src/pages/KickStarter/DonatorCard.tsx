import { BinanceIcon, Flex, Text } from "@koda-finance/summitswap-uikit"
import React from "react"
import { Donator } from "./types"

type Props = {
  donator: Donator
  isFirstItem: boolean
  isLastItem: boolean
}

function DonatorCard({ donator, isFirstItem, isLastItem }: Props) {
  return (
    <Flex
      justifyContent="space-between"
      paddingTop={isFirstItem ? 0 : "16px"}
      paddingBottom="12px"
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
    </Flex>
  )
}

export default DonatorCard
