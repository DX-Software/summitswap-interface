import { Button, Flex, Text } from "@koda-finance/summitswap-uikit"
import React from "react"
import FundingInput from "../shared/FundingInput"

function ProjectSettings() {
  return (
    <Flex flexDirection="column" alignItems="flex-start">
      <Text bold fontSize="20px" color='sidebarActiveColor'>
        Project Creation Fee
      </Text>
      <p>
        Project fee is collected when user create a new project. Set your project fee amount here
      </p>
      <br />
      <FundingInput
        label="Enter Amount"
        value="0"
        description="If the user set 100 BNB as goal, they will have to pay 0 BNB for the project fee"
        onChange={(value) => console.log(value)}
      />
      <br />
      <Button style={{fontFamily:'Poppins'}}>
        Save Changes
      </Button>
    </Flex>
  )
}

export default ProjectSettings
